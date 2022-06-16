const express = require("express");
const { body } = require("express-validator/check");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.post("/login", userController.login);