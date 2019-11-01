var express = require('express');
var router = express.Router();

const ProductController = require('../controllers/product/product_controller');
productController = new ProductController();

router.get('', productController.getAllProductList);


module.exports = router;

