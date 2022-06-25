const express = require("express");
const { check } = require("express-validator");
const categoryController = require("../controllers/categories");
const router = express.Router();
const authorize = require("../middleware/authorize");
const Role = require("../helpers/role");

router.get("/all", authorize(), categoryController.getAllCategories);
router.post("/add", authorize(Role.Admin), [
    check("name", "Name is required").notEmpty()
], categoryController.addCategory);
router.get("/get/:id", authorize(), categoryController.getCategory);
router.put("/update/:id", authorize(Role.Admin), categoryController.updateCategory);
router.delete("/delete/:id", authorize(Role.Admin), categoryController.deleteCategory);

module.exports = router;
