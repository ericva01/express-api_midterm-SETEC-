const express = require('express');
const router = express.Router();

const orderController = require('../controller/orderController.js');

router.get('/', orderController.getAllOrders_eric);
router.get('/:id', orderController.getOrderById_eric);
router.post('/', orderController.createOrder_eric);
router.put('/:id', orderController.updateOrder_eric);
router.delete('/:id', orderController.deleteOrder_eric);

module.exports = router;