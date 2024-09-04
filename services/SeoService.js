const CsvApiService = require('../services/CsvApiService')
const csvService = new CsvApiService();

class SeoService{
    async getSeoTagBasedOnFilter(filter){
        try{
            let response = await csvService.downloadFile('seo');
            return response.find(element=>element.page === filter)?response.find(element=>element.page === filter):new Map();
            // return result ?result:new Map();
        }
        catch(error){

            console.log('No file found ',error.stack);
            return new Map();
        }
    }
}
module.exports = SeoService;