const express = require("express");
const { check } = require('express-validator');
const { body } = require("express-validator");
const cartController = require("../controllers/cart");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/get/:id", isAuth, cartController.getByUserId);
router.post("/add", isAuth, [
    check("user_id", "User Id is required").notEmpty(),
    check("prod_id", "Product Id is required").notEmpty(),
    check("quantity", "Quantity is required").notEmpty()
], cartController.addCart);
router.put("/addQuantity/:id", isAuth, cartController.addQuantity);
router.put("/removeQuantity/:id", isAuth, cartController.removeQuantity);
router.delete("/delete/:id", isAuth, cartController.deleteById);
router.delete("/deleteUserCart/:id", isAuth, cartController.deleteUserCart);

module.exports = router;
