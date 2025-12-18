const express = require("express");
const router = express.Router();

const orderDetailController = require("../controller/orderDetailController.js");

router.get("/", orderDetailController.getAllOrderDetails_eric);
router.get("/:id", orderDetailController.getOrderDetailById_eric);
router.post("/", orderDetailController.createOrderDetail_eric);
router.put("/:id", orderDetailController.updateOrderDetail_eric);
router.delete("/:id", orderDetailController.deleteOrderDetail_eric);

module.exports = router;