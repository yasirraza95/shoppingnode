const express = require("express");
const { body } = require("express-validator");
const wishlistController = require("../controllers/wishlist");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/get/:id", isAuth, wishlistController.getByUserId);
router.post("/add", isAuth, wishlistController.addWishlist);
router.delete("/delete/:id", isAuth, wishlistController.deleteById);
router.delete("/deleteUserWishlist/:id", isAuth, wishlistController.addWishlist);

module.exports = router;