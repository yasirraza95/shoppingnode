const express = require("express");
const { body } = require("express-validator/check");
const authController = require("../controllers/auth");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.post(
    '/signup',
    [
      body('email').isEmail().withMessage('Please enter a valid email.').normalizeEmail(),
      body('password').trim().isLength({ min: 5 }),
      body('name').trim().not().isEmpty(),
      body('phone').isLength({ min: 11 }).withMessage("Please enter a valid mobile no.").not().isEmpty(),
      body('username').trim().not().isEmpty()
    ],
    authController.signup
  );

router.post("/login", authController.login);

router.get("/profile/:id", isAuth, authController.getProfile);
router.put("/profile/:id", isAuth, authController.updateProfile);

module.exports = router;