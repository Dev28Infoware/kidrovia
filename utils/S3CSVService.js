const AWS = require('aws-sdk');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify');
const stream = require('stream');


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const bucketName = process.env.AWS_BUCKET_NAME;
const s3 = new AWS.S3();

class S3CSVService {
    async readCSVFromS3(fileName) {
        const params = {
            Bucket: bucketName,
            Key: fileName
            // ContentType: 'text/csv'
        };
        const s3Object = await s3.getObject(params).promise();

        return new Promise((resolve, reject) => {
            const results = [];
            const readStream = new stream.Readable();
            readStream._read = () => {};
            readStream.push(s3Object.Body);
            readStream.push(null);

            readStream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }

    async writeCsvToS3(fileKey , data){
        console.log(`Bucket = ${bucketName} && Key = ${fileKey}`);
        // const csvStream = parseString(data,{header:true});

        const params = {
            Bucket: bucketName,
            Key: fileKey,
            Body:data,
            ContentType:'text/csv'
        };
        try {
            const result = await s3.upload(params).promise();
            console.log('File uploaded successfully:', result);
            return result; // Return result if needed
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error; // Rethrow the error to be caught in uploadFile
        }
    }
}

module.exports = new S3CSVService();
