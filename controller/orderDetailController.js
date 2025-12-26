// const OrderDetail = require("../models/orderDetailModel");

// /**
//  * GET order detail by ID
//  */
// exports.getOrderDetailById_eric = async (req, res) => {
//   try {
//     const orderDetail = await OrderDetail.findByPk(req.params.id);

//     if (!orderDetail) {
//       return res.status(404).json({ error: "Order Detail not found" });
//     }

//     res.json(orderDetail);
//   } catch (err) {
//     console.error("Error fetching order detail:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// /**
//  * GET all order details
//  */
// exports.getAllOrderDetails_eric = async (req, res) => {
//   try {
//     const orderDetails = await OrderDetail.findAll();
//     res.json(orderDetails);
//   } catch (err) {
//     console.error("Error fetching order details:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// /**
//  * CREATE order detail
//  */
// exports.createOrderDetail_eric = async (req, res) => {
//   try {
//     const { orderid, productid, qty, discount } = req.body;

//     const newOrderDetail = await OrderDetail.create({
//       orderid,
//       productid,
//       qty,
//       discount,
//     });

//     res.status(201).json(newOrderDetail);
//   } catch (err) {
//     console.error("Error creating order detail:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// /**
//  * UPDATE order detail
//  */
// exports.updateOrderDetail_eric = async (req, res) => {
//   try {
//     const orderDetail = await OrderDetail.findByPk(req.params.id);

//     if (!orderDetail) {
//       return res.status(404).json({ error: "Order Detail not found" });
//     }

//     const { orderid, productid, qty, discount } = req.body;

//     orderDetail.orderid = orderid ?? orderDetail.orderid;
//     orderDetail.productid = productid ?? orderDetail.productid;
//     orderDetail.qty = qty ?? orderDetail.qty;
//     orderDetail.discount = discount ?? orderDetail.discount;

//     await orderDetail.save();

//     res.json(orderDetail);
//   } catch (err) {
//     console.error("Error updating order detail:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// /**
//  * DELETE order detail
//  */
// exports.deleteOrderDetail_eric = async (req, res) => {
//   try {
//     const orderDetail = await OrderDetail.findByPk(req.params.id);

//     if (!orderDetail) {
//       return res.status(404).json({ error: "Order Detail not found" });
//     }

//     await orderDetail.destroy();
//     res.json({ message: "Order Detail deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting order detail:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };


const OrderDetail = require("../models/orderDetailModel");

// Validation helper functions
const validateId = (id) => {
  if (!id) {
    return { valid: false, message: "ID is required" };
  }
  if (isNaN(id) || parseInt(id) <= 0) {
    return { valid: false, message: "ID must be a positive integer" };
  }
  return { valid: true };
};

const validateOrderId = (orderid) => {
  if (orderid === undefined || orderid === null) {
    return { valid: false, message: "Order ID is required" };
  }
  if (isNaN(orderid) || parseInt(orderid) <= 0) {
    return { valid: false, message: "Order ID must be a positive integer" };
  }
  return { valid: true };
};

const validateProductId = (productid) => {
  if (productid === undefined || productid === null) {
    return { valid: false, message: "Product ID is required" };
  }
  if (isNaN(productid) || parseInt(productid) <= 0) {
    return { valid: false, message: "Product ID must be a positive integer" };
  }
  return { valid: true };
};

const validateQuantity = (qty) => {
  if (qty === undefined || qty === null) {
    return { valid: false, message: "Quantity is required" };
  }
  if (isNaN(qty) || parseInt(qty) <= 0) {
    return { valid: false, message: "Quantity must be a positive integer" };
  }
  if (parseInt(qty) > 10000) {
    return { valid: false, message: "Quantity cannot exceed 10,000 units" };
  }
  return { valid: true };
};

const validateDiscount = (discount) => {
  // Discount is optional, so if not provided, it's valid
  if (discount === undefined || discount === null) {
    return { valid: true };
  }

  const discountNum = parseFloat(discount);
  
  if (isNaN(discountNum)) {
    return { valid: false, message: "Discount must be a number" };
  }
  if (discountNum < 0) {
    return { valid: false, message: "Discount cannot be negative" };
  }
  if (discountNum > 100) {
    return { valid: false, message: "Discount cannot exceed 100%" };
  }
  return { valid: true };
};

/**
 * GET order detail by ID
 */
exports.getOrderDetailById_eric = async (req, res) => {
  try {
    // Validate ID
    const idValidation = validateId(req.params.id);
    if (!idValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: idValidation.message,
        data: null
      });
    }

    const orderDetail = await OrderDetail.findByPk(req.params.id);

    if (!orderDetail) {
      return res.status(404).json({
        statuscode: 404,
        message: "Order detail not found",
        data: null
      });
    }

    res.status(200).json({
      statuscode: 200,
      message: "Successfully retrieved order detail",
      data: orderDetail
    });
  } catch (err) {
    console.error("Error fetching order detail:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while fetching the order detail",
      data: null
    });
  }
};

/**
 * GET all order details
 */
exports.getAllOrderDetails_eric = async (req, res) => {
  try {
    const orderDetails = await OrderDetail.findAll();
    
    res.status(200).json({
      statuscode: 200,
      message: "Successfully retrieved order details",
      data: orderDetails
    });
  } catch (err) {
    console.error("Error fetching order details:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while fetching order details",
      data: null
    });
  }
};

/**
 * CREATE order detail
 */
exports.createOrderDetail_eric = async (req, res) => {
  try {
    const { orderid, productid, qty, discount } = req.body;

    // Validate order ID
    const orderIdValidation = validateOrderId(orderid);
    if (!orderIdValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: orderIdValidation.message,
        data: null
      });
    }

    // Validate product ID
    const productIdValidation = validateProductId(productid);
    if (!productIdValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: productIdValidation.message,
        data: null
      });
    }

    // Validate quantity
    const qtyValidation = validateQuantity(qty);
    if (!qtyValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: qtyValidation.message,
        data: null
      });
    }

    // Validate discount (optional)
    const discountValidation = validateDiscount(discount);
    if (!discountValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: discountValidation.message,
        data: null
      });
    }

    // Check for duplicate order detail (same orderid and productid)
    const existingOrderDetail = await OrderDetail.findOne({
      where: { 
        orderid: orderid,
        productid: productid
      }
    });

    if (existingOrderDetail) {
      return res.status(409).json({
        statuscode: 409,
        message: "This product already exists in the order. Please update the existing order detail instead.",
        data: null
      });
    }

    const newOrderDetail = await OrderDetail.create({
      orderid,
      productid,
      qty: parseInt(qty),
      discount: discount !== undefined && discount !== null ? parseFloat(discount) : 0,
    });

    res.status(201).json({
      statuscode: 201,
      message: "Order detail created successfully",
      data: newOrderDetail
    });
  } catch (err) {
    console.error("Error creating order detail:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while creating the order detail",
      data: null,
      details: err.message
    });
  }
};

/**
 * UPDATE order detail
 */
exports.updateOrderDetail_eric = async (req, res) => {
  try {
    // Validate ID
    const idValidation = validateId(req.params.id);
    if (!idValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: idValidation.message,
        data: null
      });
    }

    // Validate order ID if provided
    if (req.body.orderid !== undefined) {
      const orderIdValidation = validateOrderId(req.body.orderid);
      if (!orderIdValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: orderIdValidation.message,
          data: null
        });
      }
    }

    // Validate product ID if provided
    if (req.body.productid !== undefined) {
      const productIdValidation = validateProductId(req.body.productid);
      if (!productIdValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: productIdValidation.message,
          data: null
        });
      }
    }

    // Validate quantity if provided
    if (req.body.qty !== undefined) {
      const qtyValidation = validateQuantity(req.body.qty);
      if (!qtyValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: qtyValidation.message,
          data: null
        });
      }
    }

    // Validate discount if provided
    if (req.body.discount !== undefined) {
      const discountValidation = validateDiscount(req.body.discount);
      if (!discountValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: discountValidation.message,
          data: null
        });
      }
    }

    const orderDetail = await OrderDetail.findByPk(req.params.id);

    if (!orderDetail) {
      return res.status(404).json({
        statuscode: 404,
        message: "Order detail not found",
        data: null
      });
    }

    // Check for duplicate if changing orderid or productid
    if (req.body.orderid !== undefined || req.body.productid !== undefined) {
      const newOrderId = req.body.orderid !== undefined ? req.body.orderid : orderDetail.orderid;
      const newProductId = req.body.productid !== undefined ? req.body.productid : orderDetail.productid;

      // Only check if the combination is actually changing
      if (newOrderId !== orderDetail.orderid || newProductId !== orderDetail.productid) {
        const existingOrderDetail = await OrderDetail.findOne({
          where: { 
            orderid: newOrderId,
            productid: newProductId
          }
        });

        if (existingOrderDetail) {
          return res.status(409).json({
            statuscode: 409,
            message: "This product already exists in the order",
            data: null
          });
        }
      }
    }

    // Update fields
    if (req.body.orderid !== undefined) {
      orderDetail.orderid = req.body.orderid;
    }
    if (req.body.productid !== undefined) {
      orderDetail.productid = req.body.productid;
    }
    if (req.body.qty !== undefined) {
      orderDetail.qty = parseInt(req.body.qty);
    }
    if (req.body.discount !== undefined) {
      orderDetail.discount = parseFloat(req.body.discount);
    }

    await orderDetail.save();

    res.status(200).json({
      statuscode: 200,
      message: "Order detail updated successfully",
      data: orderDetail
    });
  } catch (err) {
    console.error("Error updating order detail:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while updating the order detail",
      data: null
    });
  }
};

/**
 * DELETE order detail
 */
exports.deleteOrderDetail_eric = async (req, res) => {
  try {
    // Validate ID
    const idValidation = validateId(req.params.id);
    if (!idValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: idValidation.message,
        data: null
      });
    }

    const orderDetail = await OrderDetail.findByPk(req.params.id);

    if (!orderDetail) {
      return res.status(404).json({
        statuscode: 404,
        message: "Order detail not found",
        data: null
      });
    }

    await orderDetail.destroy();
    
    res.status(200).json({
      statuscode: 200,
      message: "Order detail deleted successfully",
      data: null
    });
  } catch (err) {
    console.error("Error deleting order detail:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while deleting the order detail",
      data: null
    });
  }
};