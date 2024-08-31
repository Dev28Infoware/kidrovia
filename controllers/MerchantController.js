const MerchantService = require('../services/MerchantService')

const merchantService = new MerchantService();
exports.getAllMerchant = async(req,res)=>{
    try{
        const prod = await merchantService.getAllMerchant();
        res.json(prod);
    }
    catch(error){
        console.error(error.stack);
        res.status(500).send(error.message);
    }
}