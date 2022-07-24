const express = require("express");
const { check } = require("express-validator");
const productController = require("../controllers/products");
const router = express.Router();
const authorize = require("../middleware/authorize");
const Role = require("../helpers/role");

router.get("/all", productController.getAllProducts);
router.post("/add", authorize(Role.Admin), [
    check("name", "Name is required").notEmpty(),
    check("price", "Price is required").notEmpty(),
    check("sub_cat_id", "Subcategory Id is required").notEmpty()
], productController.addProduct);
router.get("/get/:id", productController.getProduct);
router.put("/update/:id", authorize(Role.Admin), productController.updateProduct);
router.delete("/delete/:id", authorize(Role.Admin), productController.deleteProduct);

module.exports = router;
