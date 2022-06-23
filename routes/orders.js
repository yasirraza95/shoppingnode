const express = require("express");
const { body } = require("express-validator");
const orderController = require("../controllers/orders");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/get/:id", isAuth, orderController.getByUserId);
router.post("/add", isAuth, [
    check("user_id", "User Id is required").notEmpty(),
    check("address", "Address is required").notEmpty(),
    check("email", "Email is required").notEmpty(),
    check("phone", "Phone is required").notEmpty()
], orderController.addOrder);
router.delete("/delete/:id", isAuth, orderController.deleteById);

module.exports = router;
