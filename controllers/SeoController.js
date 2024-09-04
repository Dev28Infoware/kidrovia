const SeoService = require('../services/SeoService')
const seo = new SeoService();

exports.getSeoTagByFilter=async(req,res)=>{
    const filter = req.query.page;
    const response= await seo.getSeoTagBasedOnFilter(filter);
    res.json(response);
};

exports.getSeoTagByFilterForSearch=async(req,res)=>{
    const filter = req.query.query;
    const response = await seo.getSeoTagForSearchProduct(filter);
    res.json(response);
}

exports.getAllSeoQueryAndUrl= async(req,res)=>{
    const response = await seo.getAllSearchQuery();
    res.json(response);
}