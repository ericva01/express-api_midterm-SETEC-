const OrderDetail = require("../models/orderDetailModel");

/**
 * GET order detail by ID
 */
exports.getOrderDetailById_eric = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findByPk(req.params.id);

    if (!orderDetail) {
      return res.status(404).json({ error: "Order Detail not found" });
    }

    res.json(orderDetail);
  } catch (err) {
    console.error("Error fetching order detail:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * GET all order details
 */
exports.getAllOrderDetails_eric = async (req, res) => {
  try {
    const orderDetails = await OrderDetail.findAll();
    res.json(orderDetails);
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * CREATE order detail
 */
exports.createOrderDetail_eric = async (req, res) => {
  try {
    const { orderid, productid, qty, discount } = req.body;

    const newOrderDetail = await OrderDetail.create({
      orderid,
      productid,
      qty,
      discount,
    });

    res.status(201).json(newOrderDetail);
  } catch (err) {
    console.error("Error creating order detail:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * UPDATE order detail
 */
exports.updateOrderDetail_eric = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findByPk(req.params.id);

    if (!orderDetail) {
      return res.status(404).json({ error: "Order Detail not found" });
    }

    const { orderid, productid, qty, discount } = req.body;

    orderDetail.orderid = orderid ?? orderDetail.orderid;
    orderDetail.productid = productid ?? orderDetail.productid;
    orderDetail.qty = qty ?? orderDetail.qty;
    orderDetail.discount = discount ?? orderDetail.discount;

    await orderDetail.save();

    res.json(orderDetail);
  } catch (err) {
    console.error("Error updating order detail:", err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * DELETE order detail
 */
exports.deleteOrderDetail_eric = async (req, res) => {
  try {
    const orderDetail = await OrderDetail.findByPk(req.params.id);

    if (!orderDetail) {
      return res.status(404).json({ error: "Order Detail not found" });
    }

    await orderDetail.destroy();
    res.json({ message: "Order Detail deleted successfully" });
  } catch (err) {
    console.error("Error deleting order detail:", err);
    res.status(500).json({ error: "Server error" });
  }
};
