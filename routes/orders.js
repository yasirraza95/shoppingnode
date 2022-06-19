const express = require("express");
const { body } = require("express-validator");
const orderController = require("../controllers/orders");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/get/:id", isAuth, orderController.getByUserId);
router.post("/add", isAuth, orderController.addOrder);
router.delete("/delete/:id", isAuth, orderController.deleteById);

module.exports = router;