const fs = require('fs');
const csv = require('csv-parser');
const S3CSVService = require('./S3CSVService');
// const s3 = new S3CSVService();
class CsvService {
    async readCSVFile(filePath) {
        const results = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    resolve(results);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });

        
        // return s3.readCSVFromS3(filePath);
    }

    async writeToFile(filePath,jsonString){
        fs.writeFile(filePath,JSON.stringify(jsonString, null, 2),(err)=>{
            if(err){
                console.log('Error in writing in file ',err.message);
            }
            else{
                console.log('File written successfully');
            }
        })
    }

    async readFromFile(filePath){
        return new Promise((resolve,reject)=>{
            fs.readFile(filePath,'utf8',(err,data)=>{
                if(err){
                    console.log('Error reading file ',err.message);
                    resolve();
                }
                try{
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (parseError) {
                    console.error('Error parsing JSON:', parseError);
                    resolve();
                }
            });
        })
        
    }
}

module.exports = CsvService;
