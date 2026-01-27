const Category = require("../repositories/categoryRepository");
const ErrorObjects = require("../../../core/errors");

exports.createCategory = async (categoryData) => {
  const existingCategory = !!(await Category.findByUserId(userId));

  if (existingCategory) {
    throw ErrorObjects.conflictError("Categoria já existe");
  }
};
