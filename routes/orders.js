const express = require("express");
const { check } = require("express-validator");
const orderController = require("../controllers/orders");
const router = express.Router();
const authorize = require("../middleware/authorize");
const Role = require("../helpers/role");

router.get("/all", authorize(Role.Admin), orderController.getAllOrders);
router.get("/get/:id", authorize(), orderController.getByUserId);
router.post("/add", authorize(Role.User), [
    check("user_id", "User Id is required").notEmpty(),
    check("address", "Address is required").notEmpty(),
    check("email", "Email is required").notEmpty(),
    check("phone", "Phone is required").notEmpty()
], orderController.addOrder);
router.delete("/delete/:id", authorize(Role.Admin), orderController.deleteById);

module.exports = router;
