// const Category = require("../models/categoryModel");

// exports.getCategories_eric = async (req, res) => {
//   try {
//     const categories = await Category.findAll();

//     // Return in the standard format
//     res.status(200).json({
//       statuscode: res.statusCode,
//       message: "Successfully retrieved categories",
//       data: categories
//     });
//   } catch (err) {
//     console.error("Error fetching categories:", err);

//     res.status(500).json({
//       statuscode: 500,
//       message: "An error occurred while fetching categories",
//       data: null
//     });
//   }
// };

// // exports.getCategories_eric = async (req, res) => {
// //   try {
// //     const category = await Category.findAll();

// //     let result = {
// //       "status": 200,
// //       "message": "Successfully retrieved categories",
// //       "data": category
// //     }
// //     res.json(result);
// //   } catch (err) {
// //     console.error("Error fetching categories:", err);
// //     res
// //       .status(500)
// //       .json({ error: "An error occurred while fetching categories" });
// //   }
// // };
// exports.getCategory_eric = async (req, res) => {
//   try {

//     if (isNaN(req.params.id)) {
//       return res.status(400).json({ error: "Invalid category ID(id must be integer)" });
//     }

//     const category = await Category.findByPk(req.params.id);
//     console.log("Fetched category:", category);
//     if (category) {
//       res.status(200).json({
//         statuscode: res.statusCode,
//         message: "Category has created",
//         data: category
//       })
//     }else{
//       return res.status(400).json({error : ""})
//     }
//   } catch (err) {
//     console.error("Error fetching category:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching the category" });
//   }
// };
// exports.createCategory_eric = async (req, res) => {
//   try {
//     const { categoryname } = req.body;

//     if (!categoryname) {
//       return res.status(400).json({
//         statuscode: 400,
//         message: "categoryname is required",
//       });
//     }

//     const newCategory = await Category.create({
//       categoryname,
//       categoryicon: req.file ? req.file.filename : null
//     });

//     res.status(201).json({
//       statuscode: 201,
//       message: "Category created successfully",
//       data: newCategory,
//     });
//   } catch (err) {
//     console.error("Error creating category", err);
//     res.status(500).json({
//       statuscode: 500,
//       message: "An error occurred while creating the category",
//       details: err.message,
//     });
//   }
// };


// exports.updateCategory_eric = async (req, res) => {
//   try {
//     const category = await Category.findByPk(req.params.id);
//     if (category) {
//       category.categoryname = req.body.categoryname || category.categoryname;
//       category.categoryicon = req.file ? req.file.filename : category.categoryicon;
//       await category.save();
//       res.json(category);
//     } else {
//       res.status(404).json({ error: "Category not found" });
//     }
//   } catch (err) {
//     console.error("Error updating category:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while updating the category" });
//   }
// };
// exports.deleteCategory_eric = async (req, res) => {
//   try {
//     const category = await Category.findByPk(req.params.id);
//     if (category) {
//       await category.destroy();
//       res.json({ message: "Category deleted successfully" });
//     } else {
//       res.status(404).json({ error: "Category not found" });
//     }
//   } catch (err) {
//     console.error("Error deleting category:", err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while deleting the category" });
//   }
// };


const Category = require("../models/categoryModel");

// Validation helper functions
const validateId = (id) => {
  if (!id) {
    return { valid: false, message: "Category ID is required" };
  }
  if (isNaN(id) || parseInt(id) <= 0) {
    return { valid: false, message: "Category ID must be a positive integer" };
  }
  return { valid: true };
};

const validateCategoryName = (categoryname) => {
  if (!categoryname) {
    return { valid: false, message: "Category name is required" };
  }
  if (typeof categoryname !== 'string') {
    return { valid: false, message: "Category name must be a string" };
  }
  if (categoryname.trim().length === 0) {
    return { valid: false, message: "Category name cannot be empty or whitespace only" };
  }
  if (categoryname.trim().length < 2) {
    return { valid: false, message: "Category name must be at least 2 characters long" };
  }
  if (categoryname.length > 100) {
    return { valid: false, message: "Category name cannot exceed 100 characters" };
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

exports.getCategories_eric = async (req, res) => {
  try {
    const categories = await Category.findAll();

    res.status(200).json({
      statuscode: 200,
      message: "Successfully retrieved categories",
      data: categories
    });
  } catch (err) {
    console.error("Error fetching categories:", err);

    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while fetching categories",
      data: null
    });
  }
};

exports.getCategory_eric = async (req, res) => {
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

    const category = await Category.findByPk(req.params.id);
    console.log("Fetched category:", category);
    
    if (category) {
      res.status(200).json({
        statuscode: 200,
        message: "Successfully retrieved category",
        data: category
      });
    } else {
      return res.status(404).json({
        statuscode: 404,
        message: "Category not found",
        data: null
      });
    }
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while fetching the category",
      data: null
    });
  }
};

exports.createCategory_eric = async (req, res) => {
  try {
    const { categoryname } = req.body;

    // Validate category name
    const nameValidation = validateCategoryName(categoryname);
    if (!nameValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: nameValidation.message,
        data: null
      });
    }

    // Validate file if present
    const fileValidation = validateFile(req.file);
    if (!fileValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: fileValidation.message,
        data: null
      });
    }

    // Check for duplicate category name
    const existingCategory = await Category.findOne({
      where: { categoryname: categoryname.trim() }
    });

    if (existingCategory) {
      return res.status(409).json({
        statuscode: 409,
        message: "A category with this name already exists",
        data: null
      });
    }

    const newCategory = await Category.create({
      categoryname: categoryname.trim(),
      categoryicon: req.file ? req.file.filename : null
    });

    res.status(201).json({
      statuscode: 201,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while creating the category",
      data: null,
      details: err.message,
    });
  }
};

exports.updateCategory_eric = async (req, res) => {
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

    // Validate category name if provided
    if (req.body.categoryname) {
      const nameValidation = validateCategoryName(req.body.categoryname);
      if (!nameValidation.valid) {
        return res.status(400).json({
          statuscode: 400,
          message: nameValidation.message,
          data: null
        });
      }
    }

    // Validate file if present
    const fileValidation = validateFile(req.file);
    if (!fileValidation.valid) {
      return res.status(400).json({
        statuscode: 400,
        message: fileValidation.message,
        data: null
      });
    }

    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        statuscode: 404,
        message: "Category not found",
        data: null
      });
    }

    // Check for duplicate category name if updating name
    if (req.body.categoryname && req.body.categoryname.trim() !== category.categoryname) {
      const existingCategory = await Category.findOne({
        where: { categoryname: req.body.categoryname.trim() }
      });

      if (existingCategory) {
        return res.status(409).json({
          statuscode: 409,
          message: "A category with this name already exists",
          data: null
        });
      }
    }

    // Update category
    category.categoryname = req.body.categoryname ? req.body.categoryname.trim() : category.categoryname;
    category.categoryicon = req.file ? req.file.filename : category.categoryicon;
    await category.save();
    
    res.status(200).json({
      statuscode: 200,
      message: "Category updated successfully",
      data: category
    });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while updating the category",
      data: null
    });
  }
};

exports.deleteCategory_eric = async (req, res) => {
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

    const category = await Category.findByPk(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        statuscode: 404,
        message: "Category not found",
        data: null
      });
    }

    await category.destroy();
    
    res.status(200).json({
      statuscode: 200,
      message: "Category deleted successfully",
      data: null
    });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({
      statuscode: 500,
      message: "An error occurred while deleting the category",
      data: null
    });
  }
};