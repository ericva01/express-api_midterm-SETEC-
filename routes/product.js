const express = require('express');
const router = express.Router();

const productController = require('../controller/productController.js');
const upload = require("../middlewares/upload");
router.get('/', productController.getProducts_eric);
router.get('/:id', productController.getProduct_eric);
router.post('/', upload.single('productimage'), productController.createProduct_eric);
router.put('/:id', upload.single('productimage'), productController.updateProduct_eric);
router.delete('/:id', productController.deleteProduct_eric);

module.exports = router;