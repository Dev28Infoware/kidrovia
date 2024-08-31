const CouponService = require('../services/CouponService')
const couponService = new CouponService();
exports.getCouponByStore = async(req,res)=>{
    try{
        const coupons = await couponService.getCouponsByStore();
        res.json(coupons)
    }
    catch(error){
        console.log(error.stack);
        res.status(500).send(error.message);
    }
}

exports.getCouponByCategory = async(req,res)=>{
    try{
        const coupons = await couponService.getCouponsByCategories();
        res.json(coupons);
    }
    catch(error){
        console.log(error.stack);
        res.status(500).send(error.message);
    }
}