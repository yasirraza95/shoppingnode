const express = require("express");
const { check } = require("express-validator");
const categoryController = require("../controllers/categories");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/all", isAuth, categoryController.getAllCategories);
router.post("/add", isAuth, [
    check("name", "Name is required").notEmpty()
], categoryController.addCategory);
router.get("/get/:id", isAuth, categoryController.getCategory);
router.put("/update/:id", isAuth, categoryController.updateCategory);
router.delete("/delete/:id", isAuth, categoryController.deleteCategory);

module.exports = router;
