const Category = require("../repositories/categoryRepository");
const ErrorObjects = require("../../../core/errors");

//Função para criar nova categoria
exports.createCategory = async (categoryData, userId) => {
  const existingCategory = await Category.findByIndex({
    ...categoryData,
    userId,
  });

  if (existingCategory) {
    throw ErrorObjects.conflictError("Categoria já existe");
  }
  const categoryObject = {
    ...categoryData,
    userId,
  };
  const newCategory = await Category.createCategory(categoryObject);

  return newCategory;
};

//Função para atualizar informações de uma categoria
exports.updateCategory = async (categoryData, id, userId) => {
  const existingCategory = await Category.findById(id);

  if (!existingCategory) {
    throw ErrorObjects.notFoundError("Categoria não existe");
  }

  if (existingCategory.userId.toString() !== userId) {
    throw ErrorObjects.authError("Categoria não pertence ao usuário");
  }

  const updatedCategory = await Category.updateCategory(id, categoryData);

  return updatedCategory;
};

//Função para excluir uma categoria
exports.deleteCategory = async (id, userId) => {
  const existingCategory = await Category.findById(id);

  if (!existingCategory) {
    throw ErrorObjects.notFoundError("Categoria não existe");
  }

  if (existingCategory.userId.toString() !== userId) {
    throw ErrorObjects.authError("Categoria não pertence ao usuário");
  }

  return await Category.deleteById(id);
};

//Função para retornar uma categoria específica
exports.getCategory = async (id, userId) => {
  const existingCategory = await Category.findById(id);

  if (!existingCategory) {
    throw ErrorObjects.notFoundError("Categoria não existe");
  }

  if (existingCategory.userId.toString() !== userId) {
    throw ErrorObjects.authError("Categoria não pertence ao usuário");
  }

  return existingCategory;
};

//Função para retornar todas as categorias de um usuário
exports.getCategories = async (userId) => {
  const existingCategory = await Category.findByUserId(userId);

  return existingCategory;
};
