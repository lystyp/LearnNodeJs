var express = require('express');
var router = express.Router();  

const ProductController = require('../controllers/product/product_controller');
productController = new ProductController();
 
router.get('', productController.getAllProductList); 
router.get('/orderedList', productController.getOrderedList);
router.post('/order', productController.orderProductListData);
router.get('/delete', productController.deleteOrderedList);


module.exports = router;

