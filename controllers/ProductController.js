const ProductService = require('../services/ProductService');
const path = require('path');

const productService = new ProductService();

exports.getAllProducts = async (req, res) => {
    const filePath = path.join(__dirname, '../file_structure/product/Product.csv');  // Path to the CSV file

    try {
        const allResults = await productService.getProductsFromCSV(filePath);
        res.json(allResults);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.shopByProduct = async (req, res) => {
    let isCached = req.query.isCached;
    if(typeof isCached === 'undefined'){
        isCached=true;
    }
    else{
        isCached = isCached.toLowerCase()==='true';
    }
    try {
        const { page = 1, pageSize = 10 } = req.query; // Default to page 1 and 10 items per page if not provided
        const allResults = await productService.getAllProductByShop(isCached);

        // Pagination logic
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + parseInt(pageSize);
        const paginatedResults = allResults.slice(startIndex, endIndex);

        res.json({
            totalItems: allResults.length,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalPages: Math.ceil(allResults.length / pageSize),
            data: paginatedResults
        });
    } catch (error) {
        res.status(500).send(error.stack);
    }
};


exports.getProductByCategory = async (req, res) => {
    const { category } = req.params;

    try {
        const productsByCategory = await productService.getProductsByCategory(category);
        res.json(productsByCategory);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.searchProducts = async (req, res) => {
    const { shop, keywords = [] } = req.body;
    const { page = 1, pageSize = 100 } = req.query;

    try {
        // Validate input
        if (!keywords || !Array.isArray(keywords)) {
            return res.status(400).json({ message: "Invalid keywords format" });
        }

        // Call the search method
        const searchResults = await productService.searchProductsByKeywords(shop, keywords);

        // Pagination logic
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + parseInt(pageSize);
        const paginatedResults = searchResults.slice(startIndex, endIndex);

        res.json({
            totalItems: searchResults.length,
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            totalPages: Math.ceil(searchResults.length / pageSize),
            data: paginatedResults
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

