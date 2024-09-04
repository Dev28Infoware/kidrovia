const cron = require('node-cron');
console.log('Scheduler script is running...');

const ProductService = require('../services/ProductService');
const productService = new ProductService();

cron.schedule('0 0 */2 * *', async () => {  // Every 2 days 
    console.log('Scheduler for fetchCIDsAndUpdateJSON started...');
    try {
        await productService.fetchCIDsAndUpdateJSON();
        console.log('fetchCIDsAndUpdateJSON executed successfully.');
    } catch (error) {
        console.error(`Error in executing fetchCIDsAndUpdateJSON: ${error.message}`);
    }
    console.log('Scheduler for fetchCIDsAndUpdateJSON finished.');
});

module.exports = { cron };
