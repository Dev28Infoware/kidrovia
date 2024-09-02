const exchange = require('../utils/AxiosService');
const CsvService = require('../utils/CsvService');
const path = require('path');
const store = new CsvService();
const filePath = path.join(__dirname, '../file_structure/store/store.csv');
const STORECOUPONBYSTOREFILEWRITEPATH = path.join(__dirname, '../file_structure/coupon_dump/couponByStore.json'); 
const STORECOUPONBYCATEGORYFILEWRITEPATH = path.join(__dirname, '../file_structure/coupon_dump/couponByCategory.json'); 
class CouponService {

    async getCouponsByStore(isCached) {
      if(isCached){
        let responseData = await this.checkIfDataIsThere(STORECOUPONBYSTOREFILEWRITEPATH);
        if(Object.keys(responseData).length>0){
            return responseData;
        }
      }
      let responseData=await this.getCouponByStoreFromAPI();
      return responseData;
    }
    async getAllCoupons(){
      let responseData = await this.checkIfDataIsThere(STORECOUPONBYSTOREFILEWRITEPATH);
      let allCoupons=[];
      if(Object.keys(responseData).length>0){
        for(let key  in responseData){
            allCoupons=allCoupons.concat(responseData[key]);
        }
      }
      return allCoupons;
    }

    async getCouponsByShop(shopName,isCached){
        let responseData = await this.checkIfDataIsThere(STORECOUPONBYSTOREFILEWRITEPATH);
        if(Object.keys(responseData).length>0){
            for(let key in responseData){
                if(key===shopName){
                    return responseData[key];
                }
            }
        }
        return [];
      }
    async getCouponByStoreFromAPI() {
        try{
            const currentDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
            const couponIdSet = new Set();
            let flexOfferAdvertiserId='';
            let linkShareAdvertiserid='';
            const couponsCategoryData = await store.readCSVFile(filePath);
            couponsCategoryData.forEach(coupon=>{
                if(coupon.source==='FLEXOFFER'){
                    flexOfferAdvertiserId=flexOfferAdvertiserId+','+coupon.store_id;
                 }
                 else{
                    linkShareAdvertiserid=linkShareAdvertiserid+'|'+coupon.store_id;
                 }
            });
            let FLEXOFFER_API = 'https://api.flexoffers.com/coupons?page=1&pageSize=500&advertiserIds='+flexOfferAdvertiserId.substring(1);
            
        let flexOfferHeader = {
            'apiKey':'41a02e6b-b5a3-4d7f-ae2a-476cdd6be0b7',
            'Content-Type': 'application/json'
        }
        const responseMap = new Map();
        let flexOfferResponse = await exchange.getAPI(FLEXOFFER_API,flexOfferHeader,'JSON');
        flexOfferResponse.results.forEach(coupon=>{
            const endDate = new Date(coupon.endDate);
            const startDate = new Date(coupon.startDate);
            if((currentDate<endDate) && (currentDate>startDate)){
                let name = coupon.advertiserName;
                let keyName = name.replace(/\..*$/, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                let response;
                let responseFormat = {
                'advertiserName':name,
                'category':coupon.categories,
                'url':coupon.linkUrl,
                'advertiserId':coupon.advertiserId,
                'startDate':coupon.startDate,
                'endDate':coupon.endDate,
                'couponCode':coupon.couponCode,
                'description':coupon.linkDescription,
                'percentageOff':coupon.percentageOff,
                'priceOff':coupon.dollarOff,
                'service':'FLEXOFFER'
            }
            if (responseMap.has(keyName)){
                response = responseMap.get(keyName)
            }
            else{
                response = []
            }
            response.push(responseFormat);
            responseMap.set(keyName,response);
            }
        });

        let LINKSHARE_API = 'https://api.linksynergy.com/coupon/1.0?pagenumber=1&resultsperpage=500&mid='+linkShareAdvertiserid.substring(1);
         let linkShareHeader = {
                'Authorization':`Bearer ${await exchange.linkShareRefreshToken()}`,
        }
        const apiDataLinkShare = await exchange.getAPI(LINKSHARE_API,linkShareHeader,'XML');
        apiDataLinkShare.couponfeed.link.forEach(coupon=>{
            const endDateWithTime = new Date(coupon.offerenddate[0]);
            const startDateWithTime = new Date(coupon.offerstartdate[0]);
            const endDate = new Date(endDateWithTime.getFullYear(),endDateWithTime.getMonth(),endDateWithTime.getDate());
            const startDate = new Date(startDateWithTime.getFullYear(),startDateWithTime.getMonth(),startDateWithTime.getDate());
            // console.log(`current Date = ${currentDate} \n start date = ${startDate}\nend date = ${endDate}\nand comparision of all ${(currentDate<endDate) && (currentDate>startDate)}`)
            if((currentDate<endDate) && (currentDate>startDate)){
                let name = coupon.advertisername[0];
                let keyName = name.replace(/\..*$/, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                let response;
                let responseFormat = {
                    'advertiserName':name,
                    'category':coupon.categories[0].category[0]._,
                    'url':coupon.clickurl[0],
                    'advertiserId':coupon.advertiserid[0],
                    'startDate':coupon.offerstartdate[0],
                    'endDate':coupon.offerenddate[0],
                    'couponCode':coupon.couponcode?coupon.couponcode[0]:'',
                    'description':coupon.offerdescription[0],
                    'percentageOff':'',
                    'priceOff':'',
                    'service':'LINKSHARE'
                }
                if (responseMap.has(keyName)){
                    response = responseMap.get(keyName)
                }
                else{
                    response = []
                }
                response.push(responseFormat);
                responseMap.set(keyName,response);
            }
        });
        await store.writeToFile(STORECOUPONBYSTOREFILEWRITEPATH,Object.fromEntries(responseMap));
        return Object.fromEntries(responseMap);
        }
        catch(error){
            console.log(error.stack);
        }
        
     }

    async getCouponsByCategories(isCached) {
        if(isCached){
            let responseData = await this.checkIfDataIsThere(STORECOUPONBYCATEGORYFILEWRITEPATH);
            if(Object.keys(responseData).length>0>0){
                return responseData;
            }
        }
        let responseData=await this.getCouponsByCategoriesFromAPI();
        return responseData;
    }

    async getCouponsByCategoriesFromAPI() {
        try{
            const currentDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate());
            const couponIdSet = new Set();
            let flexOfferAdvertiserId ='';
            let linkShareAdvertiserid ='';
            const couponsCategoryData = await store.readCSVFile(filePath);
            couponsCategoryData.forEach(coupon=>{
                if(coupon.source==='FLEXOFFER'){
                    flexOfferAdvertiserId=flexOfferAdvertiserId+','+coupon.store_id;
                 }
                 else{
                    linkShareAdvertiserid=linkShareAdvertiserid+'|'+coupon.store_id;
                 }
            });
            let FLEXOFFER_API = 'https://api.flexoffers.com/coupons?page=1&pageSize=500&advertiserIds='+flexOfferAdvertiserId.substring(1);
        let flexOfferHeader = {
            'apiKey':'41a02e6b-b5a3-4d7f-ae2a-476cdd6be0b7',
            'Content-Type': 'application/json'
        }
        const responseMap = new Map();
        let flexOfferResponse = await exchange.getAPI(FLEXOFFER_API,flexOfferHeader,'JSON');
        flexOfferResponse.results.forEach(coupon=>{
            // let categories = coupon.categories.split(',');
            // let underCategory = false;
            // for (const cat of category) {
            //     if (couponIdSet.has(cat)) {
            //         underCategory = true;
            //         break;
            //     }
            // }
           
            const endDate = new Date(coupon.endDate);
            const startDate = new Date(coupon.startDate);
            if((currentDate<endDate) && (currentDate>startDate)){
                let cat = coupon.categories
                let keyName = cat.replace(/\..*$/, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                let response;
                let responseFormat = {
                'advertiserName':coupon.advertiserName,
                'category':cat,
                'url':coupon.linkUrl,
                'advertiserId':coupon.advertiserId,
                'startDate':coupon.startDate,
                'endDate':coupon.endDate,
                'couponCode':coupon.couponCode,
                'description':coupon.linkDescription,
                'percentageOff':coupon.percentageOff,
                'priceOff':coupon.dollarOff,
                'service':'FLEXOFFER'
            }
            if (responseMap.has(keyName)){
                response = responseMap.get(keyName)
            }
            else{
                response = []
            }
            response.push(responseFormat);
            responseMap.set(keyName,response);
            }
        });

        let LINKSHARE_API = 'https://api.linksynergy.com/coupon/1.0?pagenumber=1&resultsperpage=500&mid='+linkShareAdvertiserid.substring(1);
        let linkShareHeader = {
                'Authorization':`Bearer ${await exchange.linkShareRefreshToken()}`,
        }
        const apiDataLinkShare = await exchange.getAPI(LINKSHARE_API,linkShareHeader,'XML');
        apiDataLinkShare.couponfeed.link.forEach(coupon=>{
            const endDateWithTime = new Date(coupon.offerenddate[0]);
            const startDateWithTime = new Date(coupon.offerstartdate[0]);
            const endDate = new Date(endDateWithTime.getFullYear(),endDateWithTime.getMonth(),endDateWithTime.getDate());
            const startDate = new Date(startDateWithTime.getFullYear(),startDateWithTime.getMonth(),startDateWithTime.getDate());
            if((currentDate<endDate) && (currentDate>startDate)){
                let cat = coupon.categories[0].category[0]._;
                let keyName = cat.replace(/\..*$/, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase();
                let response;
                let responseFormat = {
                    'advertiserName':coupon.advertisername[0],
                    'category':cat,
                    'url':coupon.clickurl[0],
                    'advertiserId':coupon.advertiserid[0],
                    'startDate':coupon.offerstartdate[0],
                    'endDate':coupon.offerenddate[0],
                    'couponCode':coupon.couponcode?coupon.couponcode[0]:'',
                    'description':coupon.offerdescription[0],
                    'percentageOff':'',
                    'priceOff':'',
                    'service':'LINKSHARE'
                }
                if (responseMap.has(keyName)){
                    response = responseMap.get(keyName)
                }
                else{
                    response = []
                }
                response.push(responseFormat);
                responseMap.set(keyName,response);
            }
        });
        await store.writeToFile(STORECOUPONBYCATEGORYFILEWRITEPATH,Object.fromEntries(responseMap));
        return Object.fromEntries(responseMap);
        }
        catch(error){
            console.log(error.stack);
        }
        
    }
    
    async checkIfDataIsThere(filePath){
        const storeData = await store.readFromFile(filePath);
        if(storeData && storeData!='undefine' && Object.keys(storeData).length>0){
          return storeData;
        }
        else{
          return new Map();
        }
    }
}

module.exports = CouponService;