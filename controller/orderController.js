// const Order = require("../models/orderModel.js");

// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findByPk(req.params.id);
//     if (order) {
//       res.json(order);
//     } else {
//       res.status(404).json({ error: "Order not found" });
//     }
//   } catch (err) {
//     console.error("Error fetching order:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching the order" });
//   }
// };
// exports.getAllOrders = async (req, res) => {
//   try {
//     const orders = await Order.findAll();
//     res.json(orders);
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//     res.status(500).json({ error: "An error occurred while fetching orders" });
//   }
// };
// exports.createOrder = async (req, res) => {
//   try {
//     const newOrder = await Order.create({
//       orderDate: req.body.orderDate,
//       totalAmount: req.body.totalAmount,
//       userId: req.body.userId,
//     });
//     res.status(201).json(newOrder);
//   } catch (err) {
//     console.error("Error creating order:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while creating the order" });
//   }
// };
// exports.updateOrder = async (req, res) => {
//   try {
//     const order = await Order.findByPk(req.params.id);
//     if (order) {
//       order.orderDate = req.body.orderDate || order.orderDate;
//       order.totalAmount = req.body.totalAmount || order.totalAmount;
//       order.userId = req.body.userId || order.userId;
//       await order.save();
//       res.json(order);
//     } else {
//       res.status(404).json({ error: "Order not found" });
//     }
//   } catch (err) {
//     console.error("Error updating order:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while updating the order" });
//   }
// };
// exports.deleteOrder = async (req, res) => {
//   try {
//     const order = await Order.findByPk(req.params.id);
//     if (order) {
//       await order.destroy();
//       res.json({ message: "Order deleted successfully" });
//     } else {
//       res.status(404).json({ error: "Order not found" });
//     }
//   } catch (err) {
//     console.error("Error deleting order:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while deleting the order" });
//   }
// };



const Order = require("../models/orderModel");

/**
 * GET order by ID
 */
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
};

/**
 * GET all orders
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

/**
 * CREATE order
 */
exports.createOrder = async (req, res) => {
  try {
    const { orderdate, orderno, userid } = req.body;

    // ✅ Validation
    if (!orderdate || !orderno || !userid) {
      return res.status(400).json({
        error: "orderdate, orderno, and userid are required",
      });
    }

    const newOrder = await Order.create({
      orderdate,
      orderno,
      userid,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

/**
 * UPDATE order
 */
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // ✅ Safe updates (allow null / partial update)
    if (req.body.orderdate !== undefined)
      order.orderdate = req.body.orderdate;

    if (req.body.orderno !== undefined)
      order.orderno = req.body.orderno;

    if (req.body.userid !== undefined)
      order.userid = req.body.userid;

    await order.save();
    res.status(200).json(order);
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
};

/**
 * DELETE order
 */
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    await order.destroy();
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
};
