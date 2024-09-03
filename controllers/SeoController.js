const SeoService = require('../services/SeoService')
const seo = new SeoService();

exports.getSeoTagByFilter=async(req,res)=>{
    const filter = req.query.page;
    const response= await seo.getSeoTagBasedOnFilter(filter);
    res.json(response);
};