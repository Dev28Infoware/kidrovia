const ProductService = require('../services/ProductService')

const productService = new ProductService();
exports.getAllProducts = async(req,res)=>{
    const search = req.query.searchQuery;
    const advertiserId = req.query.id;
    const advertiserName = req.query.name;
    const type = req.query.type;
    console.log(`advertiserId = ${advertiserId} & advertiserName = ${advertiserName}`);
    try{
        const prod = await productService.getFlexofferProduct(search,advertiserId,advertiserName,type);
        res.json(prod);
    }
    catch(error){
        res.status(500).send(error.message);
    }
}