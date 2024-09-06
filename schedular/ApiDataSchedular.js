const cron = require('node-cron');
console.log('Scheduler script is running...');
const MerchantService = require('../services/MerchantService')
const merchantService = new MerchantService();
const CouponService = require('../services/CouponService')
const couponService = new CouponService();
const ProductService = require('../services/ProductService');
const productService = new ProductService();

cron.schedule(`0 6 * * *`,async ()=>{   //Every day 6 AM
    const isCached = false;
    console.log('Schedular Started...');
    try{
        console.log('Dumping getAllMerchant Data');
        await merchantService.getAllMerchant(isCached);
    }
    catch(error)
    {
        console.log(`Error in caching getAllMerchant data ${error.message}`);
    }
    try{
        console.log('Dumping getCouponsByStore Data');
        await couponService.getCouponsByStore(isCached);
    }
    catch(error)
    {
        console.log(`Error in caching getCouponsByStore data ${error.message}`);
    }
    try{
        console.log('Dumping getCouponsByCategories Data');
        await couponService.getCouponsByCategories(isCached);
    }
    catch(error)
    {
        console.log(`Error in caching getCouponsByCategories data ${error.message}`);
    }
    try{
        console.log('Dumping shopByProduct Data');
        await productService.shopByProduct();
    }
    catch(error){
        console.log(`Error in caching getAllProductByShop data ${error.message}`);
    }
    console.log('Schedular stop successfully...');
    
});
module.exports = { cron };