const express = require("express");
const { check } = require('express-validator');
const cartController = require("../controllers/cart");
const router = express.Router();
const authorize = require("../middleware/authorize");
const Role = require("../helpers/role");

router.get("/get/:id", authorize(), cartController.getByUserId);
router.post("/add", authorize(Role.User), [
    check("user_id", "User Id is required").notEmpty(),
    check("prod_id", "Product Id is required").notEmpty(),
    check("quantity", "Quantity is required").notEmpty()
], cartController.addCart);
router.put("/addQuantity/:id", authorize(Role.User), cartController.addQuantity);
router.put("/removeQuantity/:id", authorize(Role.User), cartController.removeQuantity);
router.delete("/delete/:id", authorize(Role.User), cartController.deleteById);
router.delete("/deleteUserCart/:id", authorize(Role.User), cartController.deleteUserCart);

module.exports = router;
