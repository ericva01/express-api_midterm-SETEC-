const express = require("express");
const router = express.Router();

const categoryController = require("../controller/categoryController.js");
const upload = require("../middlewares/upload");
// ROUTES
router.get("/", categoryController.getCategories_eric);
router.get("/:id", categoryController.getCategory_eric);

// 👇 image upload here
router.post("/",upload.single("categoryicon"), categoryController.createCategory_eric);

router.put("/:id",upload.single("categoryicon"), categoryController.updateCategory_eric);

router.delete("/:id", categoryController.deleteCategory_eric);

module.exports = router;
