const { Router } = require("express");
const { CategorySchema } = require("../schemas/categorySchema");
const { validate } = require("../../../middlewares/schemaValidations");
const { setUserId } = require("../../../middlewares/authMiddleware");
const CategoryController = require("../controllers/categoryController");

const router = Router();

router.get("/categories/:id", setUserId, CategoryController.getCategory);

router.get("/categories/", setUserId, CategoryController.getCategories);

router.post("/categories", validate(CategorySchema), setUserId, CategoryController.createCategory);

router.put("/categories/:id", validate(CategorySchema), setUserId, CategoryController.updateCategory);

router.delete("/categories/:id", setUserId, CategoryController.deleteCategory);

module.exports = router;
