const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user");
const router = express.Router();
const authorize = require("../middleware/authorize");
const Role = require("../helpers/role");

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
    body("phone")
      .isLength({ min: 10 })
      .withMessage("Please enter a valid mobile no.")
      .not()
      .isEmpty(),
    body("username").trim().not().isEmpty(),
  ],
  userController.signup
);

router.post(
  "/refreshtoken",
  [body("token").trim().not().isEmpty()],
  userController.refreshToken
);
router.post("/login", userController.login);
router.post("/adminLogin", userController.adminLogin);

router.get("/profile/:id", authorize(Role.User), userController.getProfile);
router.put("/profile/:id", authorize(Role.User), userController.updateProfile);

router.post("/forgot", userController.forgotPassword);
router.get("/checkToken", userController.checkForgotToken);
router.put("/activate/:username", userController.activateAccount);
router.post("/contact", userController.contact);

module.exports = router;
