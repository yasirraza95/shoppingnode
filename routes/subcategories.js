const express = require("express");
const { check } = require("express-validator");
const subcatController = require("../controllers/subcategories");
const router = express.Router();
const authorize = require("../middleware/authorize");
const Role = require("../helpers/role");

router.get("/all", authorize(), subcatController.getAllSubcat);
router.post("/add", authorize(Role.Admin), [
    check("name", "Name is required").notEmpty(),
    check("cat_id", "Category Id is required").notEmpty()
], subcatController.addSubcat);
router.get("/get/:id", authorize(), subcatController.getSubcat);
router.put("/update/:id", authorize(Role.Admin), subcatController.updateSubcat);
router.delete("/delete/:id", authorize(Role.Admin), subcatController.deleteSubcat);

module.exports = router;
