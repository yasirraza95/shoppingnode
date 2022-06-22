const express = require("express");
const { check } = require('express-validator');
const wishlistController = require("../controllers/wishlist");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/get/:id", isAuth, wishlistController.getByUserId);
router.post("/add", isAuth, [
    check("user_id", "User Id is required").notEmpty(),
    check("prod_id", "Product Id is required").notEmpty()
], wishlistController.addWishlist);
router.delete("/delete/:id", isAuth, wishlistController.deleteById);
router.delete("/deleteUserWishlist/:id", isAuth, wishlistController.addWishlist);

module.exports = router;