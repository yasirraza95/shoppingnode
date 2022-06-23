const express = require("express");
const { check } = require("express-validator");
const productController = require("../controllers/products");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/all", isAuth, productController.getAllProducts);
router.post("/add", isAuth, [
    check("name", "Name is required").notEmpty(),
    check("image", "Image is required").notEmpty(),
    check("price", "Price is required").notEmpty(),
    check("sub_cat_id", "Subcategory Id is required").notEmpty()
], productController.addProduct);
router.get("/get/:id", isAuth, productController.getProduct);
router.put("/update/:id", isAuth, productController.updateProduct);
router.delete("/delete/:id", isAuth, productController.deleteProduct);

module.exports = router;
