const router = require("express").Router();
const { getCategories, createCategory, editCategory, deleteCategory } = require("../controllers/category");
const {
  validateCategoryData,
  validateCategoryById,
} = require("../utils/validate/categoryValidate");

router.get("/", getCategories);
router.post("/", validateCategoryData, createCategory);
router.patch("/:id", validateCategoryData, editCategory);
router.delete("/:id", validateCategoryById, deleteCategory);

module.exports = router;
