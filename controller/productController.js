const Product = require("../models/productModel");

// Validation helper functions
const validateId = (id) => {
  if (!id) {
    return { valid: false, message: "Product ID is required" };
  }
  if (isNaN(id) || parseInt(id) <= 0) {
    return { valid: false, message: "Product ID must be a positive integer" };
  }
  return { valid: true };
};

const validateProductName = (productname) => {
  if (!productname) {
    return { valid: false, message: "Product name is required" };
  }
  if (typeof productname !== 'string') {
    return { valid: false, message: "Product name must be a string" };
  }
  if (productname.trim().length === 0) {
    return { valid: false, message: "Product name cannot be empty or whitespace only" };
  }
  if (productname.trim().length < 2) {
    return { valid: false, message: "Product name must be at least 2 characters long" };
  }
  if (productname.length > 200) {
    return { valid: false, message: "Product name cannot exceed 200 characters" };
  }
  return { valid: true };
};

const validatePrice = (price) => {
  if (price === undefined || price === null) {
    return { valid: false, message: "Price is required" };
  }
  
  const priceNum = parseFloat(price);
  
  if (isNaN(priceNum)) {
    return { valid: false, message: "Price must be a valid number" };
  }
  if (priceNum < 0) {
    return { valid: false, message: "Price cannot be negative" };
  }
  if (priceNum > 999999999.99) {
    return { valid: false, message: "Price is too large" };
  }
  return { valid: true };
};

const validateQuantity = (qty) => {
  if (qty === undefined || qty === null) {
    return { valid: false, message: "Quantity is required" };
  }
  
  const qtyNum = parseInt(qty);
  
  if (isNaN(qtyNum)) {
    return { valid: false, message: "Quantity must be a valid number" };
  }
  if (qtyNum < 0) {
    return { valid: false, message: "Quantity cannot be negative" };
  }
  if (qtyNum > 1000000) {
    return { valid: false, message: "Quantity cannot exceed 1,000,000 units" };
  }
  return { valid: true };
};

const validateDiscount = (discount) => {
  // Discount is optional
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

const validateCategoryId = (categoryid) => {
  if (categoryid === undefined || categoryid === null) {
    return { valid: false, message: "Category ID is required" };
  }
  
  const categoryIdNum = parseInt(categoryid);
  
  if (isNaN(categoryIdNum)) {
    return { valid: false, message: "Category ID must be a valid number" };
  }
  if (categoryIdNum <= 0) {
    return { valid: false, message: "Category ID must be a positive integer" };
  }
  return { valid: true };
};
const validateFile = (file) => {
  if (!file) {
    return { valid: true }; // File is optional
  }

  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return { 
      valid: false, 
      message: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed" 
    };
  }

  if (file.size > maxSize) {
    return { 
      valid: false, 
      message: "File size exceeds 5MB limit" 
    };
  }

  return { valid: true };
};
/**
 * GET product by ID
 */
exports.getProduct_eric = async (req, res) => {
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

    const product = await Product.findByPk(req.params.id);
    
    if (product) {
      res.status(200).json({
        statuscode: 200,
        message: "Successfully retrieved product",
        data: product
      });
    } else {
      res.status(404).json({
        statuscode: 404,
        message: "Product not found",
        data: null
      });
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while fetching the product",
      data: null
    });
  }
};

/**
 * GET all products
 */
exports.getProducts_eric = async (req, res) => {
  try {
    const products = await Product.findAll();
    
    res.status(200).json({
      statuscode: 200,
      message: "Successfully retrieved products",
      data: products
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while fetching products",
      data: null
    });
  }
};

/**
 * CREATE product
 */
exports.createProduct_eric = async (req, res) => {
  try {
    const { productname, price, qty, discount, categoryid,productimage } = req.body;

    // Validate product name
    const nameValidation = validateProductName(productname);
    if (!nameValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: nameValidation.message,
        data: null
      });
    }

    // Validate price
    const priceValidation = validatePrice(price);
    if (!priceValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: priceValidation.message,
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
    //Validate file (optional)
    const fileValidation = validateFile(req.file);
    if (!fileValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: fileValidation.message,
        data: null
      });
    }

    // Validate category ID
    const categoryIdValidation = validateCategoryId(categoryid);
    if (!categoryIdValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: categoryIdValidation.message,
        data: null
      });
    }

    // Check for duplicate product name
    const existingProduct = await Product.findOne({
      where: { productname: productname.trim() }
    });

    if (existingProduct) {
      return res.status(409).json({
        statuscode: 409,
        message: "A product with this name already exists",
        data: null
      });
    }

    const newProduct = await Product.create({
      productname: productname.trim(),
      price: parseFloat(price),
      qty: parseInt(qty),
      productimage: productimage,
      discount: discount !== undefined && discount !== null ? parseFloat(discount) : 0,
      categoryid: parseInt(categoryid),
    });

    res.status(201).json({
      statuscode: 201,
      message: "Product created successfully",
      data: newProduct
    });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while creating the product",
      data: null,
      details: err.message,
    });
  }
};

/**
 * UPDATE product
 */
exports.updateProduct_eric = async (req, res) => {
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

    // Validate product name if provided
    if (req.body.productname !== undefined) {
      const nameValidation = validateProductName(req.body.productname);
      if (!nameValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: nameValidation.message,
          data: null
        });
      }
    }

    // Validate price if provided
    if (req.body.price !== undefined) {
      const priceValidation = validatePrice(req.body.price);
      if (!priceValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: priceValidation.message,
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
    if(req.file){
      //Validate file 
      const fileValidation = validateFile(req.file);
      if (!fileValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: fileValidation.message,
          data: null
        });
      }
    }

    // Validate category ID if provided
    if (req.body.categoryid !== undefined) {
      const categoryIdValidation = validateCategoryId(req.body.categoryid);
      if (!categoryIdValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: categoryIdValidation.message,
          data: null
        });
      }
    }

    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        statuscode: 404,
        message: "Product not found",
        data: null
      });
    }

    // Check for duplicate product name if updating name
    if (req.body.productname !== undefined && req.body.productname.trim() !== product.productname) {
      const existingProduct = await Product.findOne({
        where: { productname: req.body.productname.trim() }
      });

      if (existingProduct) {
        return res.status(409).json({
          statuscode: 409,
          message: "A product with this name already exists",
          data: null
        });
      }
    }

    // Update fields
    if (req.body.productname !== undefined) {
      product.productname = req.body.productname.trim();
    }
    if (req.body.price !== undefined) {
      product.price = parseFloat(req.body.price);
    }
    if (req.body.qty !== undefined) {
      product.qty = parseInt(req.body.qty);
    }
    if (req.body.discount !== undefined) {
      product.discount = parseFloat(req.body.discount);
    }
    if (req.file) {
      product.productimage = req.file.filename;
    }
    if (req.body.categoryid !== undefined) {
      product.categoryid = parseInt(req.body.categoryid);
    }

    await product.save();
    
    res.status(200).json({
      statuscode: 200,
      message: "Product updated successfully",
      data: product
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while updating the product",
      data: null
    });
  }
};

/**
 * DELETE product
 */
exports.deleteProduct_eric = async (req, res) => {
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

    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        statuscode: 404,
        message: "Product not found",
        data: null
      });
    }

    await product.destroy();
    
    res.status(200).json({
      statuscode: 200,
      message: "Product deleted successfully",
      data: null
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while deleting the product",
      data: null
    });
  }
};