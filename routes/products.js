const express = require("express");
const { body } = require("express-validator");
const productController = require("../controllers/products");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/all", isAuth, productController.getAllProducts);
router.post("/add", isAuth, productController.addProduct);
router.get("/get/:id", isAuth, productController.getProduct);
router.put("/update/:id", isAuth, productController.updateProduct);
router.delete("/delete/:id", isAuth, productController.deleteProduct);

module.exports = router;