const fs = require('fs'); // Path to the CSV file
const path = require('path');
const product = require('../utils/AxiosService');
const CsvService = require('../utils/CsvService');
const JsonService = require('../utils/JsonService');
const S3CSVService = require('../utils/S3CSVService')
const store = new CsvService();
const CsvApiService = require('../services/CsvApiService')
const csvApiService = new CsvApiService();
// const JsonService = new JsonService();
const STOREFILEWRITEPATH = path.join(__dirname, '../file_structure/product_dump/product.json'); 
const awsFilePath = 'file_structure/store/store.csv';
const jsonMappingFilePath = path.join(__dirname, '../file_structure/store_dump/store.json'); // Path to your JSON file



class ProductService {
    constructor() {
        this.csvService = new CsvService();
    }

  async getProductsFromCSV(query, page = 1, pageSize = 10) {
    try {
      const analysis = await csvApiService.downloadFile("search");
      const queryAnalysis = analysis.find((item) => item.keyword === query);
      const attributes = queryAnalysis.prefix.split(",") || [];
      const targetItem = queryAnalysis.product.split(",") || [];
      const target = queryAnalysis.target.split(",") || [];
      const products = await store.readFromFile(STOREFILEWRITEPATH);
      // Step 2: Filter products based on the analysis
      const filteredProducts = products.filter((product) => {
        const { productName, description } = product;
        const productText = `${productName} ${description}`;
        let hasAttribute = attributes.some((keyword) =>
          productText.toUpperCase().includes(keyword.toUpperCase())
        );
        let hasTarget = target.some((keyword) =>
          productText.toUpperCase().includes(keyword.toUpperCase())
        );
        let hasProduct = targetItem.some((keyword) =>
          productText.toUpperCase().includes(keyword.toUpperCase())
        );
        return hasProduct &&(hasTarget||hasAttribute);
      });
      const uniqueMap = new Set();
      const finalProduct = filteredProducts.filter(product=>{
        if(!uniqueMap.has(product.imageUrl)){
          uniqueMap.add(product.imageUrl,true);
          return true;
        }
        else{
          return false;
        }
      })
      const startIndex = (page - 1) * pageSize;
      const paginatedResults = finalProduct.slice(
      startIndex,
      startIndex + (+pageSize)
      );
      let response = {
        totalItems: finalProduct.length,
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalPages: Math.ceil(finalProduct.length / pageSize),
        data: paginatedResults,
      };
      return response;
    } catch (error) {
      console.error("Error occured :", error.stack);
      throw error;
    }
  }

    async fetchCIDsAndUpdateJSON() {
        const jsonData = await JsonService.readJSONFile(jsonMappingFilePath);

        const flexofferStores = jsonData.filter(store => store.from === 'FLEXOFFER' && !store.cid);
    
        if (flexofferStores.length > 0) {
            const flexOfferHeader = {
                'apiKey': '41a02e6b-b5a3-4d7f-ae2a-476cdd6be0b7',
                'Accept': 'application/json'
            };
    
            for (const store of flexofferStores) {
                const FLEXOFFER_CATALOG_API = `https://api.flexoffers.com/products/catalogs?aid=${store.store_id}`;
                try {
                    const catalog = await product.getAPI(FLEXOFFER_CATALOG_API, flexOfferHeader, 'JSON');
                    if (catalog && catalog.length > 0) {
                        const cids = catalog.map(c => c.cid).join(',');
                        store.cid = cids;
    
                        // Update the store in the JSON file with the fetched CIDs
                        await this.updateJSONWithCID(store.store_id, cids);
                    }
                } catch (error) {
                    console.error(`Error fetching CIDs for store ID ${store.store_id}:`, error.message);
                }
            }
        }
    }

    async updateJSONWithCID(storeId, cids) {
        const jsonData = await JsonService.readJSONFile(jsonMappingFilePath);
        const updatedData = jsonData.map(store => {
            if (store.id === storeId) {
                store.cid = cids;
            }
            return store;
        });
    
        await JsonService.writeToFile(jsonMappingFilePath, updatedData);
    }

    async shopByProduct() {
      try {
        const csvData = await S3CSVService.readCSVFromS3(awsFilePath);
        const regexCase =
          /\b(KID|KIDS|KID'S|BABIE'S|CHILDREN|TOODLER|CHILDRENS|CHILDREN'S|TOODLERS|TEENS|BABIES|TOYS|TOY|TOY'S)\b/i;
  
        const flexofferIds = [];
        const linkshareIds = [];
        const allResults = [];
        const uniqueMap = new Map();
        let timeGap = 4000;
        let loopCount = 10;
        const keywordGroups = [
          "kids",
          "toddler",
          "boys",
          "boy",
          "girls",
          "girl",
          "babies",
          "baby",
        ];
  
        // Separate store IDs by source
        csvData.forEach((row) => {
          if (row.source === "FLEXOFFER") {
            flexofferIds.push(row.store_id);
          } else if (row.source === "LINKSHARE") {
            linkshareIds.push(row.store_id);
          }
        });
  
        // Fetch products from FlexOffers
        if (flexofferIds.length > 0) {
          const flexOfferHeader = {
            apiKey: "41a02e6b-b5a3-4d7f-ae2a-476cdd6be0b7",
            Accept: "application/json",
          };
  
          // for (const storeId of flexofferIds) {
          //     const FLEXOFFER_CATALOG_API = `https://api.flexoffers.com/products/catalogs?aid=${storeId}`;
  
          //     const catalog = await product.getAPI(FLEXOFFER_CATALOG_API, flexOfferHeader, 'JSON');
          //     if(catalog){
          //         catalog.forEach(c => {
          //             cidList.push(c.cid);
          //         });
          //     }
          // }
  
          const cidList = [];
          for (const storeId of flexofferIds) {
            const FLEXOFFER_CATALOG_API = `https://api.flexoffers.com/products/catalogs?aid=${storeId}`;
  
            const catalog = await product.getAPI(
              FLEXOFFER_CATALOG_API,
              flexOfferHeader,
              "JSON"
            );
            if (catalog) {
              catalog.forEach((c) => {
                cidList.push(c.cid);
              });
            }
            await this.delay(timeGap);
          }
  
          for (const cid of cidList) {
            // await this.delay(timeGap);
            // const uniqueMap = new Map();
            const keywordString = keywordGroups.join(",");
            // for (const pid of productIds) {
            // const productDetailsAPI = `https://api.flexoffers.com/products/product?pid=${pid}`;
            try {
              // const fullProductDetailsArray = await product.getAPI(productDetailsAPI, flexOfferHeader, 'JSON');
              let isEmpty = false;
              
              let i = 1;
              while (!isEmpty && i<=loopCount) {
                await this.delay(timeGap);
                const FLEX_OFFER_PRODUCTS_API = `https://api.flexoffers.com/products/full?cid=${cid}&page=${i}&pageSize=500&name${keywordString}`;
  
                const fullProductDetailsArray =
                  await product.getFlexOfferProducts(
                    FLEX_OFFER_PRODUCTS_API,
                    flexOfferHeader
                  );
                if (
                  !fullProductDetailsArray ||
                  fullProductDetailsArray.length < 500
                ) {
                  isEmpty = true;
                } else {
                  i++;
                }
                if (
                  fullProductDetailsArray &&
                  fullProductDetailsArray !== "undefined" &&
                  fullProductDetailsArray.length > 0
                ) {
                  // const fullProductDetails = fullProductDetailsArray[0];
                  fullProductDetailsArray.forEach((fullProductDetails) => {
                    try {
                      // Analyzed query for filtering
                      // const analyzedQuery = this.queryAnalysis(fullProductDetails.description || fullProductDetails.name);
  
                      // Check gender filter
                      // if (analyzedQuery.gender === 'GIRL' || analyzedQuery.gender === 'GIRLS') {
                      //     isValidProduct = /girl|girls|kids|teens|children|toddler/i.test(fullProductDetails.description || fullProductDetails.name);
                      // } else if (analyzedQuery.gender === 'BOY' || analyzedQuery.gender === 'BOYS') {
                      //     isValidProduct = /boy|boys|kids|teens|children|toddler/i.test(fullProductDetails.description || fullProductDetails.name);
                      // } else {
                      //     isValidProduct = regexCase.test(fullProductDetails.description || fullProductDetails.name);
                      // }
  
                      // Apply conditions as in getFlexofferProduct
                      if (
                        !uniqueMap.has(fullProductDetails.imageUrl) &&
                        fullProductDetails.isInstock &&
                        fullProductDetails.deepLinkURL &&
                        fullProductDetails.priceCurrency === "USD" &&
                        (regexCase.test(fullProductDetails.description) ||
                          regexCase.test(fullProductDetails.name))
                        // && (analyzedQuery.item && new RegExp(`\\b${analyzedQuery.item}\\b`, 'i').test(fullProductDetails.description) || new RegExp(`\\b${analyzedQuery.item}\\b`, 'i').test(fullProductDetails.name))
                      ) {
                        const responseStructure =
                          this.createProductResponseStructure(
                            fullProductDetails,
                            "FLEXOFFER"
                          );
                        uniqueMap.set(
                          fullProductDetails.imageUrl,
                          responseStructure
                        );
                      } else if (
                        uniqueMap.has(fullProductDetails.imageUrl) &&
                        fullProductDetails.isInstock
                      ) {
                        const responseStructure = uniqueMap.get(
                          fullProductDetails.imageUrl
                        );
                        if (fullProductDetails.color) {
                          responseStructure.color.push(fullProductDetails.color);
                        }
                        if (fullProductDetails.size) {
                          responseStructure.size.push(fullProductDetails.size);
                        }
                        uniqueMap.set(
                          fullProductDetails.imageUrl,
                          responseStructure
                        );
                      } 
                    } catch (e) {
                      console.log(e.stack);
                    }
                  });
                }
              }
            } catch (detailsError) {
              console.log(detailsError.stack);
              console.error(
                "Error fetching product details from API:",
                detailsError.message
              );
            }
          }
  
          uniqueMap.forEach((value, key) => {
            allResults.push(value);
          });
        }
        // }
  
        // Fetch products from LinkShare
        if (linkshareIds.length > 0) {
          const linkShareHeader = {
            Authorization: `Bearer ${await product.linkShareRefreshToken()}`,
          };
          // const keywordGroups = ['kids' , 'toddler' , 'boys' , 'boy', 'girls' ,'girl' ,'babies' ,'baby']; // Fallback keywords in order of priority
  
          for (const mid of linkshareIds) {
            let productsFound = false;
  
            for (const keywords of keywordGroups) {
              const one = encodeURIComponent(keywords);
              let isEmpty = false;
              let i = 1;
              while (!isEmpty&& i<=(loopCount*5)) {
                
                const LINK_SHARE_API = `https://api.linksynergy.com/productsearch/1.0?pagenumber=${i}&max=100&language=en_US&one=${one}&mid=${mid}`;
  
                try {
                  const apiDataLinkShare = await product.getAPI(
                    LINK_SHARE_API,
                    linkShareHeader,
                    "XML"
                  );
                  if (!apiDataLinkShare || apiDataLinkShare.length < 100) {
                    isEmpty = true;
                  } else {
                    i++;
                  }
                  if (apiDataLinkShare.result?.item?.length > 0) {
                    apiDataLinkShare.result.item.forEach((prod) => {
                      const responseStructure =
                        this.createProductResponseStructure(prod, "LINKSHARE");
                      uniqueMap.set(prod.deepLinkURL, responseStructure);
                      allResults.push(responseStructure);
                    });
                    productsFound = true;
                    break; // Exit loop if products are found
                  }
                } catch (apiError) {
                  console.error(
                    `Error fetching LinkShare products with keywords "${keywords}":`,
                    apiError.message
                  );
                }
              }
            }
          }
          uniqueMap.forEach((value, key) => {
            allResults.push(value);
          });
        }
  
        await store.writeToFile(STOREFILEWRITEPATH, allResults);
        return allResults;
      } catch (error) {
        console.error("Error processing shop by product:", error.message);
        throw error;
      }
    }
    
    createProductResponseStructure(productDetails, source) {
        let advertiserName = (productDetails.advertiserName || productDetails.merchantname?.[0] || 'N/A')
        if((productDetails.advertiserName||productDetails.merchantname?.[0]||'N/A')==='Bergdorf Goodman (Neiman Marcus)'){
            advertiserName='Bergdorf Goodman';
        }
        const urlName = advertiserName
            .replace(/\..*$/, '')           
            .replace(/[^a-zA-Z0-9\s]/g, '')  
            .replace(/\s+/g, '-')            
            .toLowerCase();  
    
            let price = parseFloat((productDetails.price?.[0]?._ || productDetails.price || 0));
            let salesPrice = parseFloat(productDetails.salePrice || (productDetails.saleprice?.[0]?._ || 0));

            if (!+salesPrice) {
              [price, salesPrice] = [+salesPrice, +price];
            } else if (+price && +salesPrice > +price) {
              [price, salesPrice] = [+salesPrice, +price];
            }
        return {
            productName: productDetails.name || productDetails.productname?.[0] || 'N/A',
            imageUrl: productDetails.imageUrl 
                ? productDetails.imageUrl
                : productDetails.imageurl 
                    ? productDetails.imageurl?.[0]
                    : '',
            price: price.toString(),
            currency: productDetails.priceCurrency || productDetails.price?.[0]?.$?.currency || 'USD',
            salesPrice: salesPrice.toString(),
            discount: productDetails.discount || '0%',
            category: productDetails.category 
                ? (Array.isArray(productDetails.category) 
                    ? `${productDetails.category[0]?.primary?.[0]} -> ${productDetails.category[0]?.secondary?.[0]}` 
                    : productDetails.category) 
                : 'N/A',
            manufacturer: productDetails.manufacturer || '-',
            advertiserName: advertiserName,
            urlName: urlName,
            description: productDetails.description?.[0]?.short?.[0] || productDetails.description || 'N/A',
            linkurl: productDetails.deepLinkURL || productDetails.linkurl?.[0] || '',
            from: source,
            // color: productDetails.color ? new Set([productDetails.color]) : new Set(),
            // size: productDetails.size ? new Set([productDetails.size]) : new Set(),
            color: productDetails.color ? [productDetails.color] : [],
            size: productDetails.size ? [productDetails.size] : [],
            gender: productDetails.gender || '-',
            isInStock: productDetails.isInstock !== undefined ? productDetails.isInstock : true,
            isOnSale: productDetails.isOnSale || (price > salesPrice)
        };
    }
    
    
    async checkIfDataIsThere(){
        const productData = await store.readFromFile(STOREFILEWRITEPATH);
        if(productData && productData!='undefine' && Object.keys(productData).length>0){
          return productData;
        }
        else{
          return new Map();
        }
    }

    async getAllProductByShop(isCached) {
        let allResults;
        if (isCached) {
            allResults = await this.checkIfDataIsThere();
            if (Object.keys(allResults).length > 0) {
                return allResults;
            }
        }
            allResults = await this.shopByProduct();
    }
    
    async getAllProductByShopByPagination(isCached, page = 1, pageSize = 10) {
        let allResults;
        if (isCached) {
            allResults = await this.checkIfDataIsThere();
            if (Object.keys(allResults).length == 0) {
                allResults = await this.shopByProduct();
            }
        }
        else{
            allResults = await this.shopByProduct();
        }
        const startIndex = (page - 1) * (+pageSize);
        const paginatedResults = allResults.slice(startIndex, startIndex + (+pageSize));
        let response = {
            totalItems: allResults.length,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalPages: Math.ceil(allResults.length / pageSize),
            data: paginatedResults
        }
        return response;
    }

    async getProductsByCategory(category) {

        const filePath = path.join(__dirname, '../file_structure/product_dump/product.json'); // Path to the JSON file
        let allProducts;

        try {
            allProducts = await store.readFromFile(filePath);
        } catch (error) {
            console.log(error.stack);
            throw new Error('Failed to read products from file.');
        }
        
        if (!allProducts || allProducts.length === 0) {
            throw new Error('No products found.');
        }

        const filteredProducts = allProducts.filter(product => {
            // Check if the product has a category and compare it
            return product.category && product.category.toLowerCase().includes(category.toLowerCase());
        });

        if (filteredProducts.length === 0) {
            throw new Error('No products found for the specified category.');
        }

        return filteredProducts;
    }

    async searchProductsByKeywords(shop, keywords, page = 1, pageSize = 10) {
    let products = await store.readFromFile(STOREFILEWRITEPATH);
    
    const mappingsFilePath = path.join(__dirname, '../file_structure/keyword_dump/keywordMappings.json');
    const keywordMappings = JSON.parse(fs.readFileSync(mappingsFilePath, 'utf-8'));
    
    // Expand the keywords using the mapping file without changing their case
    const category = new RegExp(keywords.length>=2?keywords[1].toLowerCase():'', 'i');
    if (keywords.length >= 2) {
      keywords.splice(1, 1);
    }
    if(shop && keywords.length==0){
      let accumulatedResults = [];
      const filteredProducts = products.filter(product=>{
        return (shop===product.urlName);
      });
      accumulatedResults = accumulatedResults.concat(filteredProducts);
      products = accumulatedResults;
    }
    keywords.forEach((keyword) => {
      let accumulatedResults = [];
      const expandedKeywords = new Set();
      expandedKeywords.add(keyword.toLowerCase());
      const mappedKeywords = keywordMappings[keyword] || [keyword];
      mappedKeywords.forEach((mappedKeyword) => {
        expandedKeywords.add(mappedKeyword.toLowerCase());
      });
      const pattern = Array.from(expandedKeywords)
      .map(keyword => `${keyword.replace(/[.*+?^${}()|[\]\\]/g, ' ')}`) 
      .join('|'); 
      const regex = new RegExp(pattern, 'i');
      const filteredProducts = products.filter(product=>{
        
        let wholeText = `${product.productName} ${product.description}`;
        let categoryText = product.category?product.category.toLowerCase():'';
        let result = regex.test(wholeText.replace(/[.*+?^${}()|[\]\\]/g, ' ').replace(/[.?\!]/g, ' ').replace(/[^a-zA-Z0-9\s]/g, ' ').replace(/[@#&]/g, ' '));
        let resultCat = category.test(categoryText);
        if(shop && keywords){
          return result&&resultCat && (shop===product.urlName);
        }
        else {
          return resultCat?result&&resultCat:result;
        }
      });
      accumulatedResults = accumulatedResults.concat(filteredProducts);
      products = accumulatedResults;
    });

    // let filterResult =  [];
    // product.forEach(prod=>{
    //   filterResult.push(prod);
    // });
    const startIndex = (page - 1) * (+pageSize);
    const paginatedResults = products.slice(startIndex, startIndex + (+pageSize));
    
   let response = {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalItems: products.length,
        totalPages : Math.round(parseInt(products.length)/pageSize),
        data: paginatedResults
    };
    return response;
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

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = ProductService;