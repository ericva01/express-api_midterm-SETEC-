const Category = require("../models/categoryModel");

exports.getCategories = async (req, res) => {
  try {
    const category = await Category.findAll();
    res.json(category);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching categories" });
  }
};
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (err) {
    console.error("Error fetching category:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the category" });
  }
};
exports.createCategory = async (req, res) => {
  try {
    const { categoryname } = req.body; // ✅ define variable

    // ✅ validate first
    if (!categoryname) {
      return res.status(400).json({ message: "categoryname is required" });
    }

    // ✅ wait for DB insert
    const newCategory = await Category.create({
      categoryname,
    });

    res.status(201).json(newCategory);
  } catch (err) {
    console.error("Error creating category", err);
    res.status(500).json({
      error: "An error occurred while creating the category",
      details: err.message,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      category.categoryname = req.body.categoryname || category.categoryname;
      await category.save();
      res.json(category);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (err) {
    console.error("Error updating category:", err);
    res
      .status(500)
      .json({ error: "An error occurred while updating the category" });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      await category.destroy();
      res.json({ message: "Category deleted successfully" });
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (err) {
    console.error("Error deleting category:", err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the category" });
  }
};
