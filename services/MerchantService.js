const product = require('../utils/AxiosService');
const CsvService = require('../utils/CsvService');
const path = require('path');
const store = new CsvService();
const STORECSVPATH = path.join(__dirname, '../file_structure/store/store.csv');
const STOREFILEWRITEPATH = path.join(__dirname, '../file_structure/store_dump/store.json'); 
class MerchantService{

    async getAllMerchant(){
      let responseData = await this.checkIfDataIsThere();
      if(responseData.length>0){
        return responseData;
      }
      else{
        responseData=await this.getStoreFromAPI();
        return responseData;
      }
    }
    async getStoreFromAPI(){
      const responseData=[];
      try{
        let flexOfferId = new Set();
        let linkShareId = new Set();
        const storeData = await store.readCSVFile(STORECSVPATH);
        storeData.forEach(store=>{
          if(store.source==='FLEXOFFER'){
              flexOfferId.add(+store.store_id);
          }
          else{
            linkShareId.add(+store.store_id);
          }
        });
        let FLEX_OFFER_API = `https://api.flexoffers.com/products/advertisers?page=1&pageSize=500`
        let flexOfferHeader = {
            'apiKey':'41a02e6b-b5a3-4d7f-ae2a-476cdd6be0b7',
            'Content-Type': 'application/json'
        }
        try{
          const apiDataFlexOffer = await product.getAPI(FLEX_OFFER_API,flexOfferHeader,'JSON');
          apiDataFlexOffer.forEach(advertiser=>{
            if(advertiser.country==='US' && flexOfferId.has(advertiser.aid)){
                const responseFormat = {
                    'id':advertiser.aid,
                    'name':advertiser.name,
                    'url':advertiser.domainUrl,
                    'imageUrl':advertiser.imageUrl,
                    'description':advertiser.description,
                    'country':advertiser.country,
                    'urlName':advertiser.name.replace(/\..*$/, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase(),
                    'from':'FLEXOFFER'
                }
                responseData.push(responseFormat);
            }
        });
        }
        catch(error){
          console.log(`Error fetching advertiser for flexoffer :`,error.message);
        }
        let LINK_SHARE_MERCHANT_BY_ID = `https://api.linksynergy.com/v2/advertisers/`;
         let linkShareHeader = {
          'Authorization':`Bearer ${await product.linkShareRefreshToken()}`,
        }
        for (const value of linkShareId) {
          try {
              const advertiser = await product.getAPI(LINK_SHARE_MERCHANT_BY_ID+value, linkShareHeader, 'JSON');
              let country = advertiser.advertiser.contact.country;
              if(country==='United States' || country==='US'){
                  const responseFormat = {
                      'id': advertiser.advertiser.id,
                      'name': advertiser.advertiser.name,
                      'url': advertiser.advertiser.url,
                      'imageUrl': advertiser.advertiser.profiles.logoURL,
                      'country': advertiser.advertiser.contact.country,
                      'description': advertiser.advertiser.description,
                      'urlName':advertiser.advertiser.name.replace(/\..*$/, '').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase(),
                      'from': 'LINKSHARE'
                  };
                  responseData.push(responseFormat);
              }
          } catch (error) {
              console.error(`Error fetching advertiser for merchantId ${value}:`, error.message);
          }
      }
        }
        catch(error){
          console.log(error.stack);
        }
      await store.writeToFile(STOREFILEWRITEPATH,responseData);
      return responseData;
    }

    async checkIfDataIsThere(){
      const storeData = await store.readFromFile(STOREFILEWRITEPATH);
      if(storeData && storeData!='undefine' && storeData.length>0){
        return storeData;
      }
      else{
        return [];
      }
    }
}
module.exports = MerchantService;