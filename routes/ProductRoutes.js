const express = require("express");
const router = express.Router();
const multer = require("multer");
const productController = require("../controllers/ProductController");
const merchantController = require("../controllers/MerchantController");
const couponController = require("../controllers/CouponController");
const jsonMappingController = require("../controllers/JSONMappingController");
const csvController = require("../controllers/CsvController");
const seoController = require("../controllers/SeoController");
const upload = multer({ storage: multer.memoryStorage() });
// Product Routes
router.get(
  "/products/search_by_phrase",
  productController.getAllProductsByPhrase
);
router.post("/products/search", productController.searchProducts);
router.get("/shops/products", productController.shopByProduct);
// router.get('/shops/products/:category', productController.getProductByCategory);

// Merchant Routes
router.get("/merchant/get_all", merchantController.getAllMerchant);

// Coupon Routes
router.get("/coupons/get_by_store", couponController.getCouponByStore);
router.get("/coupons/get_by_category", couponController.getCouponByCategory);
router.get("/coupons/get_by_shop_all", couponController.getCouponAllOrByShop);

// JSON Mapping Routes
router.post("/json-mapping/add", jsonMappingController.addMapping);
router.put("/json-mapping/edit", jsonMappingController.editMapping);
router.delete("/json-mapping/remove", jsonMappingController.removeMapping);

//Csv Upload to s3 route
router.post("/upload", upload.single("file"), csvController.uploadFile);
router.get("/download", csvController.downloadFile);

//SEO routes
router.get("/seo-meta-tags", seoController.getSeoTagByFilter);
router.get("/seo-meta-tags-search", seoController.getSeoTagByFilterForSearch);
router.get("/seo-meta-query", seoController.getAllSeoQueryAndUrl);
module.exports = router;
