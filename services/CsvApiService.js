const exchange = require('../utils/AxiosService');
// const CsvService = require('../utils/CsvService');
const S3CSVService = require('../utils/S3CSVService');
// const s3 = new S3CSVService();
        // s3://file_structure/coupons/coupons.csv
        // s3://file_structure/product/product.csv
        // s3://file_structure/store/store.csv
class CsvApiService {
    async uploadFile(filename,buffer){
        try{
            let path = '';
            if(filename==='store.csv'){
                path = 'file_structure/store/store.csv';
            }
            else if(filename==='coupons.csv'){
                path = 'file_structure/coupons/coupons.csv';
            }
            else if(filename==='product.csv'){
                path = 'file_structure/product/product.csv';
            }
            else if(filename ==='seo.csv'){
                path = 'file_structure/seo/seo.csv';
            }
            else if(filename === 'seo-search.csv'){
                path = 'file_structure/seo/seo-search.csv';
            }
            else if(filename === 'search.csv'){
                path = 'file_structure/seo/search.csv';
            }
            await S3CSVService.writeCsvToS3(path, buffer);
            return 'Upload Sucess !';
        }
        catch(error){
            console.log(error.stack);
            return 'Unable to upload';
        }
    }

    async downloadFile(fileName){
        try{
            // let path = 'https://transcriptscog.s3.ap-south-1.amazonaws.com/file_structure/product/product.csv';
            let path ='';
            if(fileName==='store'){
                path = 'file_structure/store/store.csv';
            }
            else if(fileName==='coupons'){
                path = 'file_structure/coupons/coupons.csv';
            }
            else if(fileName==='product'){
                path = 'file_structure/product/product.csv';
            }
            else if(fileName === 'seo'){
                path = 'file_structure/seo/seo.csv';
            }
            else if(fileName === 'seo-search'){
                path = 'file_structure/seo/seo-search.csv';
            }
            else if(fileName === 'search'){
                path = 'file_structure/seo/search.csv';
            }
            const data = await S3CSVService.readCSVFromS3(path);
            // console.log('download Sucess !');
            return data;
        }
        catch(error){
            console.log(error.stack);
            return 'Unable to download';
        }
    }
}
module.exports = CsvApiService;