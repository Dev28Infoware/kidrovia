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
