const fs = require('fs');
const path = require('path');

class JsonService {
    async readJSONFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading file:', err.message);
                    reject(err);
                } else {
                    try {
                        const jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } catch (parseError) {
                        console.error('Error parsing JSON:', parseError.message);
                        reject(parseError);
                    }
                }
            });
        });
    }

    // Method to write JSON data to a file
    async writeToFile(filePath, jsonData) {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to file:', err.message);
                    reject(err);
                } else {
                    console.log('File written successfully');
                    resolve();
                }
            });
        });
    }

    // Method to update an existing JSON file with new data
    async updateJSONFile(filePath, newData) {
        try {
            const existingData = await this.readJSONFile(filePath);
            const updatedData = { ...existingData, ...newData };
            await this.writeToFile(filePath, updatedData);
        } catch (error) {
            console.error('Error updating JSON file:', error.message);
            throw error;
        }
    }
}

module.exports = new JsonService();
