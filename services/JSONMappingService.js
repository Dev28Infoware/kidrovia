const fs = require('fs');
const path = require('path');
const jsonMappingFilePath = path.join(__dirname, '../file_structure/keyword_dump/keywordMappings.json');

class JSONMappingService {
    async readMappingFile() {
        try {
            if (fs.existsSync(jsonMappingFilePath)) {
                const data = fs.readFileSync(jsonMappingFilePath, 'utf8');
                return JSON.parse(data);
            } else {
                return {};
            }
        } catch (error) {
            throw new Error('Error reading JSON mapping file.');
        }
    }

    async writeMappingFile(data) {
        try {
            fs.writeFileSync(jsonMappingFilePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            throw new Error('Error writing to JSON mapping file.');
        }
    }

    async addMapping(key, value) {
        const data = await this.readMappingFile();
        
        // Check if the key exists
        if (!data[key]) {
            // Key does not exist, create new key with an array containing the value
            data[key] = [value];
        } else {
            // Key exists, add value to the existing key if not already present
            if (!data[key].includes(value)) {
                data[key].push(value);
            } else {
                throw new Error('Value already exists for this key.');
            }
        }
        
        await this.writeMappingFile(data);
        return { message: 'Mapping added successfully.', data };
    }

    async editMapping(key, oldValue, newValue) {
        const data = await this.readMappingFile();
        if (!data[key]) {
            throw new Error('Key not found.');
        }

        const index = data[key].indexOf(oldValue);
        if (index === -1) {
            throw new Error('Value to be replaced not found.');
        }

        // Replace old value with new value
        data[key][index] = newValue;
        await this.writeMappingFile(data);
        return { message: 'Mapping updated successfully.', data };
    }

    async removeMapping(key, value) {
        const data = await this.readMappingFile();
        if (!data[key]) {
            throw new Error('Key not found.');
        }

        const index = data[key].indexOf(value);
        if (index === -1) {
            throw new Error('Value not found for this key.');
        }

        // Remove the specific value from the key
        data[key].splice(index, 1);

        // If the key has no more values, remove the key
        if (data[key].length === 0) {
            delete data[key];
        }

        await this.writeMappingFile(data);
        return { message: 'Mapping updated successfully.', data };
    }
}

module.exports = JSONMappingService;
