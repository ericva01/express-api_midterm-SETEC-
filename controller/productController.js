const Product = require("../models/productModel");

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the product" });
  }
};
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products" });
  }
};
exports.createProduct = async (req, res) => {
  try {
    const { productname, price, qty, discount, categoryid } = req.body;

    // ✅ validation
    if (!productname) {
      return res.status(400).json({
        message: "productname is required",
      });
    }
    if (!price || price == null || isNaN(price)) {
      return res.status(400).json({
        message: "price is required and must be a number",
      });
    }
    if (!qty || qty == null || isNaN(qty)) {
      return res.status(400).json({
        message: "qty is required and must be a number",
      });
    }
    if (!categoryid || categoryid == null || isNaN(categoryid)) {
      return res.status(400).json({
        message: "categoryid is required and must be a number",
      });
    }

    if (price < 0 || qty < 0  || isNaN(price) || isNaN(qty) || isNaN(categoryid) || categoryid < 0) {
      return res.status(400).json({
        message: "price categoryid and qty must be positive numbers",
      });
    }

    const newProduct = await Product.create({
      productname,
      price,
      qty,
      discount,
      categoryid,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({
      error: "An error occurred while creating the product",
      details: err.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      product.productname = req.body.productname || product.productname;
      product.price = req.body.price || product.price;
      product.qty = req.body.qty || product.qty;
      product.discount = req.body.discount || product.discount;
      await product.save();
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    console.error("Error updating product:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the product" });
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (err) {
    console.error("Error deleting product:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product" });
  }
};