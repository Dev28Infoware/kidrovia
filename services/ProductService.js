const product = require('../utils/AxiosService');
const CsvService = require('../utils/CsvService');

class ProductService {
    constructor() {
        this.csvService = new CsvService();
    }

    async getProductsFromCSV(filePath) {
        try {
            const csvData = await this.csvService.readCSVFile(filePath);
            const allResults = [];

            console.log('csvData',csvData);

            for (const row of csvData) {
                const search = row['query'];
                const advertiserId = row['id'];
                const advertiserName = row['query variance'];
                const type = row['source'];

                if (search) {  // Ensure search query is provided
                    const products = await this.getProductBySearch(search, advertiserId, advertiserName, type);
                    allResults.push(...products);
                }
            }

            return allResults;
        } catch (error) {
            console.error('Error processing CSV file:', error.message);
            throw error;
        }
    }
   
    async getProductBySearch(search, id, name, type) {
        const regexCase = /\b(KID|KIDS|BABY|CHILDREN|TOODLER|CHILDRENS|CHILDREN'S|TOODLERS|TEENS)\b/i;
        let flexSearch = search.replace(' ', ',');
        console.log('flexSearch',flexSearch);
        let analyzedQuery = this.queryAnalysis(search);
        console.log(analyzedQuery);

        // let FLEX_OFFER_API = `https://api.flexoffers.com/products?name=${flexSearch}&page=1&pageSize=10`;
        let flexOfferHeader = {
            'apiKey':'41a02e6b-b5a3-4d7f-ae2a-476cdd6be0b7',
            'Content-Type': 'application/json'
        }
    
        let cid = '';
        if ( id && id !== '0' && name !== '-') {
            if (type === 'FLEXOFFER') {
                let FLEXOFFER_CATELOG = `https://api.flexoffers.com/products/catalogs?aid=${id}`;
                const catalog = await product.getAPI(FLEXOFFER_CATELOG, flexOfferHeader, 'JSON');
                catalog.forEach(c => {
                    cid = cid + c.cid + ',';
                });
                cid = cid.substring(0, cid.length - 1);
                FLEX_OFFER_API = FLEX_OFFER_API + '&cid=' + cid;
            }
        } else {
            cid = '172122.156074.815D5727FF79F9D1,172122.156074.477079660CE9C556,158527.1.4D5,209002.156074.1310692960C87047,200434.156074.7A6D0F7C12820A28,181293.156074.E474BA81234AD025,204122.156052.207C,192065.156052.219F';
        }
        
        // let FLEX_OFFER_API = `https://api.flexoffers.com/products?name=${flexSearch}&page=1&pageSize=10&cid=${cid}`;
        let FLEX_OFFER_API1 = `https://api.flexoffers.com/products?cid=157993.156074.8C0134638C25338F&name=Shoes&page=1&pageSize=10`;

        try {
            // Fetch product IDs
            const productIds = await product.getFlexOfferProductIds(FLEX_OFFER_API1, flexOfferHeader);
            const responseData = [];
            const uniqueMap = new Map();

            console.log('productIds', productIds);

            for (const pid of productIds) {
                const productDetailsAPI = `https://api.flexoffers.com/products/product?pid=${pid}`;
                try {
                    const fullProductDetailsArray = await product.getAPI(productDetailsAPI, flexOfferHeader, 'JSON');
                    console.log('Full Product Details:', fullProductDetailsArray);

                    if (fullProductDetailsArray && fullProductDetailsArray!== 'undefined' && fullProductDetailsArray.length > 0) {
                        const fullProductDetails = fullProductDetailsArray[0];

                        if (true
                            // !uniqueMap.has(fullProductDetails.deepLinkURL) &&
                            // fullProductDetails.isInstock &&
                            // fullProductDetails.deepLinkURL &&
                            // fullProductDetails.priceCurrency === 'USD' &&
                            // (regexCase.test(fullProductDetails.description) || regexCase.test(fullProductDetails.name)) &&
                            // (analyzedQuery.item && new RegExp(`\\b${analyzedQuery.item}\\b`, 'i').test(fullProductDetails.description) || new RegExp(`\\b${analyzedQuery.item}\\b`, 'i').test(fullProductDetails.name))
                        ) {
                            const responseStructure = {
                                'productName': fullProductDetails.name,
                                'imageUrl': fullProductDetails.imageUrl ? [fullProductDetails.imageUrl] : [],
                                'price': fullProductDetails.price,
                                'currency': fullProductDetails.priceCurrency,
                                'salesPrice': fullProductDetails.salePrice,
                                'discount': fullProductDetails.discount,
                                'category': fullProductDetails.category,
                                'manufacturer': fullProductDetails.manufacturer,
                                'advertiserName': fullProductDetails.advertiserName,
                                'description': fullProductDetails.description,
                                'linkurl': [fullProductDetails.deepLinkURL],
                                'from': 'FLEXOFFER',
                                'color': fullProductDetails.color ? [fullProductDetails.color] : [],
                                'size': fullProductDetails.size ? [fullProductDetails.size] : [],
                                'gender': fullProductDetails.gender,
                                'isInStock': fullProductDetails.isInstock,
                                'isOnSale': fullProductDetails.isOnSale
                            };

                            uniqueMap.set(fullProductDetails.deepLinkURL, responseStructure);
                        } else if (uniqueMap.has(fullProductDetails.deepLinkURL) && fullProductDetails.isInstock) {
                            const responseStructure = uniqueMap.get(fullProductDetails.deepLinkURL);
                            if (fullProductDetails.imageUrl) {
                                responseStructure.imageUrl.push(fullProductDetails.imageUrl);
                            }
                            if (fullProductDetails.color) {
                                responseStructure.color.push(fullProductDetails.color);
                            }
                            if (fullProductDetails.size) {
                                responseStructure.size.push(fullProductDetails.size);
                            }
                        }
                    } else {
                        console.error('No product details returned from API for pid:', pid);
                    }
                } catch (detailsError) {
                    console.error('Error fetching product details from API:', detailsError.message);
                }
            }

            // let mid = '41094';
            // let one = 'kids,teens,children,toodler';
            // if (analyzedQuery.gender === 'GIRL' || analyzedQuery.gender === 'GIRLS') {
            //     one = 'girls,girl,kids,teens,children,toodler';
            // } else if (analyzedQuery.gender === 'BOY' || analyzedQuery.gender === 'BOYS') {
            //     one = 'boy,boys,kids,teens,children,toodler';
            // }

           // let LINK_SHARE_API = `https://api.linksynergy.com/productsearch/1.0?keyword=${search}&mid=${mid}&sort=productname&sorttype=asc&max=100&pagenumber=1&one=${one}`;
            // let linkShareHeader = {
            //     'Authorization':`Bearer ${await product.linkShareRefreshToken()}`,
            // }
            // console.log(LINK_SHARE_API);
            // const apiDataLinkShare = await product.getAPI(LINK_SHARE_API,linkShareHeader,'XML');
            // // console.log(apiDataLinkShare.result.item);
            // apiDataLinkShare.result.item.forEach(prod=>{
            //     let currency = prod.price[0].$.currency;
            //     if(!uniqueMap.has(prod.imageurl[0])&& currency==='USD' && (targetWordRegix.test(prod.prductname[0])||targetWordRegix.test(prod.description[0].short[0]))){
            //         let salesPrice = prod.saleprice[0]._;
            //         let price = prod.price[0]._;
            //         const responseStructure = {
            //             'productName': prod.productname[0],
            //             'imageUrl': prod.imageurl !=null? [...prod.imageurl] : [],
            //             'price': price,
            //             'currency': currency,
            //             'salesPrice': salesPrice,
            //             'discount':'0%',
            //             'category': prod.category[0].primary[0]+'->'+prod.category[0].secondary[0],
            //             'manufacturer': '-',
            //             'advertiserName':prod.merchantname[0],
            //             'description': prod.description[0].short[0],
            //             'linkurl': [prod.linkurl[0]],
            //             'from': 'LINKSHARE',
            //             'color': [],
            //             'size': [],
            //             'gender':'-',
            //             'isInStock':true,
            //             'isOnSale':price>salesPrice
            //         };
            //         // uniqueMap.set(prod.imageurl[0], responseStructure);
            //     }
            // });

            uniqueMap.forEach((value, key) => {
                responseData.push(value);
            });
            return responseData;
        } catch (error) {
            console.log('Error on fetching API data', error.message);
            // console.error(error.stack);
        }
    }
    

    queryAnalysis(query) {
        let suffix = /\b(BEST|LUXURY|TOP|HIGHEND)\b/i;
        let gender = /\b(GIRL|GIRLS|BOY|BOYS)\b/i;
        let target = /\b(KID|KIDS|BABY|CHILDREN|TOODLER|CHILDRENS|CHILDREN'S|TOODLERS|TEENS)\b/i;
        let helpingWord = /\b(FOR|WITH|IN|IS|WITH)\b/i;
        let age = /\b(\d+)\b/;
        let response = {
            gender: null,
            product: null,
            suffix: null,
            target: null,
            item: null,
            age: null,
            helpingWord: null
        };
        let wordArray = query.toUpperCase().split(' ');
        wordArray.forEach(word => {
            word = word.replace('-', '');
            if (gender.test(word.toUpperCase())) {
                response.gender = word.toUpperCase();
            } else if (suffix.test(word.toUpperCase())) {
                response.suffix = word.toUpperCase();
            } else if (target.test(word.toUpperCase())) {
                response.target = word.toUpperCase();
            } else if (age.test(word.toUpperCase())) {
                response.age = word.toUpperCase();
            } else if (helpingWord.test(word.toUpperCase())) {
                response.helpingWord = word.toUpperCase();
            } else {
                response.item = word.toUpperCase();
            }
        });
        return response;
    }
}

module.exports = ProductService;