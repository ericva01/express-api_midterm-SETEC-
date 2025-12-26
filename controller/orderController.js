// const Order = require("../models/orderModel");

// exports.getOrderById_eric = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (isNaN(id)) {
//       return res.status(400).json({ error: "Invalid order ID" });
//     }

//     const order = await Order.findByPk(id);

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     res.status(200).json(order);
//   } catch (err) {
//     console.error("Error fetching order:", err);
//     res.status(500).json({ error: "Failed to fetch order" });
//   }
// };

// /**
//  * GET all orders
//  */
// exports.getAllOrders_eric = async (req, res) => {
//   try {
//     const orders = await Order.findAll();
//     res.status(200).json(orders);
//   } catch (err) {
//     console.error("Error fetching orders:", err);
//     res.status(500).json({ error: "Failed to fetch orders" });
//   }
// };

// /**
//  * CREATE order
//  */
// exports.createOrder_eric = async (req, res) => {
//   try {
//     const { orderdate, orderno, userid } = req.body;

//     // ✅ Validation
//     if (!orderdate || !orderno || !userid) {
//       return res.status(400).json({
//         error: "orderdate, orderno, and userid are required",
//       });
//     }

//     const newOrder = await Order.create({
//       orderdate,
//       orderno,
//       userid,
//     });

//     res.status(201).json(newOrder);
//   } catch (err) {
//     console.error("Error creating order:", err);
//     res.status(500).json({ error: "Failed to create order" });
//   }
// };

// /**
//  * UPDATE order
//  */
// exports.updateOrder_eric = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (isNaN(id)) {
//       return res.status(400).json({ error: "Invalid order ID" });
//     }

//     const order = await Order.findByPk(id);

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     // ✅ Safe updates (allow null / partial update)
//     if (req.body.orderdate !== undefined)
//       order.orderdate = req.body.orderdate;

//     if (req.body.orderno !== undefined)
//       order.orderno = req.body.orderno;

//     if (req.body.userid !== undefined)
//       order.userid = req.body.userid;

//     await order.save();
//     res.status(200).json(order);
//   } catch (err) {
//     console.error("Error updating order:", err);
//     res.status(500).json({ error: "Failed to update order" });
//   }
// };

// /**
//  * DELETE order
//  */
// exports.deleteOrder_eric = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (isNaN(id)) {
//       return res.status(400).json({ error: "Invalid order ID" });
//     }

//     const order = await Order.findByPk(id);

//     if (!order) {
//       return res.status(404).json({ error: "Order not found" });
//     }

//     await order.destroy();
//     res.status(204).send();
//   } catch (err) {
//     console.error("Error deleting order:", err);
//     res.status(500).json({ error: "Failed to delete order" });
//   }
// };

const Order = require("../models/orderModel");

// Validation helper functions
const validateId = (id) => {
  if (!id) {
    return { valid: false, message: "Order ID is required" };
  }
  if (isNaN(id) || parseInt(id) <= 0) {
    return { valid: false, message: "Order ID must be a positive integer" };
  }
  return { valid: true };
};

const validateOrderDate = (orderdate) => {
  if (!orderdate) {
    return { valid: false, message: "Order date is required" };
  }

  const date = new Date(orderdate);
  if (isNaN(date.getTime())) {
    return { valid: false, message: "Invalid date format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)" };
  }

  // Check if date is not in the future
  const now = new Date();
  if (date > now) {
    return { valid: false, message: "Order date cannot be in the future" };
  }

  // Check if date is not too old (e.g., more than 10 years ago)
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
  if (date < tenYearsAgo) {
    return { valid: false, message: "Order date cannot be more than 10 years in the past" };
  }

  return { valid: true };
};

const validateOrderNo = (orderno) => {
  if (!orderno) {
    return { valid: false, message: "Order number is required" };
  }

  if (typeof orderno !== 'string') {
    return { valid: false, message: "Order number must be a string" };
  }

  if (orderno.trim().length === 0) {
    return { valid: false, message: "Order number cannot be empty or whitespace only" };
  }

  if (orderno.length < 3) {
    return { valid: false, message: "Order number must be at least 3 characters long" };
  }

  if (orderno.length > 50) {
    return { valid: false, message: "Order number cannot exceed 50 characters" };
  }

  // Optional: validate format (alphanumeric with hyphens/underscores)
  const orderNoPattern = /^[a-zA-Z0-9\-_]+$/;
  if (!orderNoPattern.test(orderno)) {
    return { valid: false, message: "Order number can only contain letters, numbers, hyphens, and underscores" };
  }

  return { valid: true };
};

const validateUserId = (userid) => {
  if (!userid) {
    return { valid: false, message: "User ID is required" };
  }

  if (isNaN(userid) || parseInt(userid) <= 0) {
    return { valid: false, message: "User ID must be a positive integer" };
  }

  return { valid: true };
};

/**
 * GET order by ID
 */
exports.getOrderById_eric = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    const idValidation = validateId(id);
    if (!idValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: idValidation.message,
        data: null
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        statuscode: 404,
        message: "Order not found",
        data: null
      });
    }

    res.status(200).json({
      statuscode: 200,
      message: "Successfully retrieved order",
      data: order
    });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while fetching the order",
      data: null
    });
  }
};

/**
 * GET all orders
 */
exports.getAllOrders_eric = async (req, res) => {
  try {
    const orders = await Order.findAll();
    
    res.status(200).json({
      statuscode: 200,
      message: "Successfully retrieved orders",
      data: orders
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while fetching orders",
      data: null
    });
  }
};

/**
 * CREATE order
 */
exports.createOrder_eric = async (req, res) => {
  try {
    const { orderdate, orderno, userid } = req.body;

    // Validate order date
    const dateValidation = validateOrderDate(orderdate);
    if (!dateValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: dateValidation.message,
        data: null
      });
    }

    // Validate order number
    const orderNoValidation = validateOrderNo(orderno);
    if (!orderNoValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: orderNoValidation.message,
        data: null
      });
    }

    // Validate user ID
    const userIdValidation = validateUserId(userid);
    if (!userIdValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: userIdValidation.message,
        data: null
      });
    }

    // Check for duplicate order number
    const existingOrder = await Order.findOne({
      where: { orderno: orderno.trim() }
    });

    if (existingOrder) {
      return res.status(409).json({
        statuscode: 409,
        message: "An order with this order number already exists",
        data: null
      });
    }

    const newOrder = await Order.create({
      orderdate,
      orderno: orderno.trim(),
      userid,
    });

    res.status(201).json({
      statuscode: 201,
      message: "Order created successfully",
      data: newOrder
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while creating the order",
      data: null,
      details: err.message
    });
  }
};

/**
 * UPDATE order
 */
exports.updateOrder_eric = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    const idValidation = validateId(id);
    if (!idValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: idValidation.message,
        data: null
      });
    }

    // Validate order date if provided
    if (req.body.orderdate !== undefined) {
      const dateValidation = validateOrderDate(req.body.orderdate);
      if (!dateValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: dateValidation.message,
          data: null
        });
      }
    }

    // Validate order number if provided
    if (req.body.orderno !== undefined) {
      const orderNoValidation = validateOrderNo(req.body.orderno);
      if (!orderNoValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: orderNoValidation.message,
          data: null
        });
      }
    }

    // Validate user ID if provided
    if (req.body.userid !== undefined) {
      const userIdValidation = validateUserId(req.body.userid);
      if (!userIdValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: userIdValidation.message,
          data: null
        });
      }
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        statuscode: 404,
        message: "Order not found",
        data: null
      });
    }

    // Check for duplicate order number if updating orderno
    if (req.body.orderno !== undefined && req.body.orderno.trim() !== order.orderno) {
      const existingOrder = await Order.findOne({
        where: { orderno: req.body.orderno.trim() }
      });

      if (existingOrder) {
        return res.status(409).json({
          statuscode: 409,
          message: "An order with this order number already exists",
          data: null
        });
      }
    }

    // Update order fields
    if (req.body.orderdate !== undefined) {
      order.orderdate = req.body.orderdate;
    }

    if (req.body.orderno !== undefined) {
      order.orderno = req.body.orderno.trim();
    }

    if (req.body.userid !== undefined) {
      order.userid = req.body.userid;
    }

    await order.save();
    
    res.status(200).json({
      statuscode: 200,
      message: "Order updated successfully",
      data: order
    });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while updating the order",
      data: null
    });
  }
};

/**
 * DELETE order
 */
exports.deleteOrder_eric = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    const idValidation = validateId(id);
    if (!idValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: idValidation.message,
        data: null
      });
    }

    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({
        statuscode: 404,
        message: "Order not found",
        data: null
      });
    }

    await order.destroy();
    
    res.status(200).json({
      statuscode: 200,
      message: "Order deleted successfully",
      data: null
    });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while deleting the order",
      data: null
    });
  }
};