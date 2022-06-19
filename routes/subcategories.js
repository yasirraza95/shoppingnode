const express = require("express");
const { body } = require("express-validator");
const subcatController = require("../controllers/subcategories");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/all", isAuth, subcatController.getAllSubcat);
router.post("/add", isAuth, subcatController.addSubcat);
router.get("/get/:id", isAuth, subcatController.getSubcat);
router.put("/update/:id", isAuth, subcatController.updateSubcat);
router.delete("/delete/:id", isAuth, subcatController.deleteSubcat);

module.exports = router;