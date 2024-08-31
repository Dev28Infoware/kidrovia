const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController')
const merchantController = require('../controllers/MerchantController')
const couponController = require('../controllers/CouponController')
router.get('/products/search',productController.getAllProducts);
router.get('/merchant/get_all',merchantController.getAllMerchant);
router.get('/coupons/get_by_store',couponController.getCouponByStore);
router.get('/coupons/get_by_category',couponController.getCouponByCategory);
router.get('/shops/products', productController.shopByProduct);
router.get('/shops/products/:category', productController.getProductByCategory);
module.exports = router;