const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController')
const merchantController = require('../controllers/MerchantController')

router.get('/products/search',productController.getAllProducts);
router.get('/merchant/get_all',merchantController.getAllMerchant);
module.exports = router;