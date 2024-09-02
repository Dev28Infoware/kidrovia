const MerchantService = require('../services/MerchantService')

const merchantService = new MerchantService();
exports.getAllMerchant = async(req,res)=>{
    let isCached = req.query.isCached;
    if(typeof isCached === 'undefined'){
        isCached=true;
    }
    else{
        isCached = isCached.toLowerCase()==='true';
    }
    try{
        const prod = await merchantService.getAllMerchant(isCached);
        res.json(prod);
    }
    catch(error){
        console.error(error.stack);
        res.status(500).send(error.message);
    }
}