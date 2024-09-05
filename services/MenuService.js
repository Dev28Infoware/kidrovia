const fs = require('fs');
const path = require('path');

const menuFilePath = path.join(__dirname, '../file_structure/menu_dump/menu.json');

// Function to fetch and return menu data
async function fetchMenuData() {
    try {
        if (fs.existsSync(menuFilePath)) {
            const data = fs.readFileSync(menuFilePath, 'utf8');
            return JSON.parse(data);
        } else {
            return {};
        }
    } catch (error) {
        throw new Error('Error reading menu JSON file.');
    }
}

module.exports = { fetchMenuData };
