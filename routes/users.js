const express = require("express");
const router = express.Router();

const userController = require("../controller/userController.js");

router.get("/", userController.getUsers_eric);
router.get("/:id", userController.getUser_eric);
router.post("/", userController.createUser_eric);
router.put("/:id", userController.updateUser_eric);
router.delete("/:id", userController.deleteUser_eric);

module.exports = router;
