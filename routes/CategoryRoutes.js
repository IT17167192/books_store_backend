const express = require('express');
const router = express.Router();

//controller references
const { create, getAllCategories, getCategoryByIdMiddleware, deleteCategoryById, updateCategoryById } = require("../controllers/CategoryController");
const { required_login, is_admin, category_validator } = require('../validators/index');

//routes
router.post("/category/create", required_login, is_admin, category_validator, create);
router.get("/category/all", required_login, is_admin, getAllCategories);
router.delete("/category/:categoryId", required_login, is_admin, deleteCategoryById);
router.put("/category/:categoryId", required_login, is_admin, updateCategoryById)

//routes for categoryId
router.param('categoryId', getCategoryByIdMiddleware);// Whenever categoryId is called, getCategoryById executes

module.exports = router;