const CouponService = require('../services/CouponService')
const couponService = new CouponService();
exports.getCouponByStore = async(req,res)=>{
    let isCached = req.query.isCached;
    if(typeof isCached === 'undefined'){
        isCached=true;
    }
    else{
        isCached = isCached.toLowerCase()==='true';
    }
    try{
        const coupons = await couponService.getCouponsByStore(isCached);
        res.json(coupons)
    }
    catch(error){
        console.log(error.stack);
        res.status(500).send(error.message);
    }
}

exports.getCouponByCategory = async(req,res)=>{
    let isCached = req.query.isCached;
    if(typeof isCached === 'undefined'){
        isCached=true;
    }
    else{
        isCached = isCached.toLowerCase()==='true';
    }
    try{
        const coupons = await couponService.getCouponsByCategories(isCached);
        res.json(coupons);
    }
    catch(error){
        console.log(error.stack);
        res.status(500).send(error.message);
    }
}

exports.getCouponAllOrByShop = async(req,res)=>{
    const shop = req.query.shop;
    try{
        let coupons;
        if(shop){
            coupons = await couponService.getCouponsByShop(shop);
        }
        else{
            coupons = await couponService.getAllCoupons();
        }
        res.json(coupons);
    }
    catch(error){
        console.log(error.stack);
        res.status(500).send(error.message);
    }
}