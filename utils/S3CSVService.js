const AWS = require('aws-sdk');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify');
const stream = require('stream');

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

class S3CSVService {
    async readCSVFromS3(bucketName, fileName) {
        const params = {
            Bucket: bucketName,
            Key: fileName
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
}

module.exports = new S3CSVService();
