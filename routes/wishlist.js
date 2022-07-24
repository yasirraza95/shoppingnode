const express = require("express");
const { check } = require('express-validator');
const wishlistController = require("../controllers/wishlist");
const router = express.Router();
const authorize = require("../middleware/authorize");
const Role = require("../helpers/role");

router.get("/get/:id", authorize(Role.User), wishlistController.getByUserId);
router.post("/existItem", authorize(Role.User), [
    check("user_id", "User Id is required").notEmpty(),
    check("prod_id", "Product Id is required").notEmpty()
], wishlistController.existItem);
router.post("/add", authorize(Role.User), [
    check("user_id", "User Id is required").notEmpty(),
    check("prod_id", "Product Id is required").notEmpty()
], wishlistController.addWishlist);
router.delete("/delete/:id", authorize(Role.User), wishlistController.deleteById);
router.delete("/deleteUserWishlist/:id", authorize(Role.User), wishlistController.addWishlist);

module.exports = router;