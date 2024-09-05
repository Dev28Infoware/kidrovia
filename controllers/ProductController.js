const ProductService = require("../services/ProductService");
const path = require("path");
const CsvApiService = require("../services/CsvApiService");
const csvService = new CsvApiService();
const productService = new ProductService();

exports.getAllProductsByPhrase = async (req, res) => {
  try {
    const query = req.query.query;

    const allResults = await productService.getProductsFromCSV(query);
    res.json(allResults);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.shopByProduct = async (req, res) => {
  let isCached = req.query.isCached;
  if (typeof isCached === "undefined") {
    isCached = true;
  } else {
    isCached = isCached.toLowerCase() === "true";
  }

  try {
    const { page = 1, pageSize = 10 } = req.query; // Default to page 1 and 10 items per page if not provided
    const paginatedResults =
      await productService.getAllProductByShopByPagination(
        isCached,
        parseInt(page),
        parseInt(pageSize)
      );
    res.json(paginatedResults);
    // If `getAllProductByShop` returns the total count, include it in the response
    // const totalItems = (await productService.getAllProductByShop(isCached)).length;

    // res.json({
    //     totalItems: totalItems,
    //     page: parseInt(page),
    //     pageSize: parseInt(pageSize),
    //     totalPages: Math.ceil(totalItems / pageSize),
    //     data: paginatedResults
    // });
  } catch (error) {
    res.status(500).send(error.stack);
  }
};

exports.getProductByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const productsByCategory = await productService.getProductsByCategory(
      category
    );
    res.json(productsByCategory);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.searchProducts = async (req, res) => {
  const { shop, keywords = [] } = req.body;
  const { page = 1, pageSize = 10 } = req.query;

  try {
    // Validate input
    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({ message: "Invalid keywords format" });
    }

    // Call the search method with pagination parameters
    const searchResults = await productService.searchProductsByKeywords(
      shop,
      keywords,
      parseInt(page),
      parseInt(pageSize)
    );
    res.json(searchResults);
  } catch (error) {
    res.status(500).send(error.stack);
  }
};
