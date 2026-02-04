const CategoryService = require("../services/categoryService");

//Controler para criação de categoria
exports.createCategory = async (req, res, next) => {
  const categoryData = req.body;
  const userId = req.userId;

  try {
    const newCategory = await CategoryService.createCategory(categoryData, userId);

    return res.status(201).json({
      success: true,
      message: "Categoria criada com sucesso",
      data: { category: newCategory },
    });
  } catch (err) {
    console.log("[CategoryContollerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

//Controller para seleção de categoria
exports.getCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const userId = req.userId;

  try {
    const category = await CategoryService.getCategory(categoryId, userId);

    return res.status(200).json({
      success: true,
      message: "Categoria encontrada",
      data: { category },
    });
  } catch (err) {
    console.log("[CategoryControllerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

//Controller que traz todas categorias do usuário
exports.getCategories = async (req, res, next) => {
  const userId = req.userId;

  try {
    const category = await CategoryService.getCategories(userId);

    return res.status(201).json({
      success: true,
      message: "Categorias encontradas",
      data: { category },
    });
  } catch (err) {
    console.log("[CategoryControllerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

//Controller para atualizar categoria
exports.updateCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const categoryData = req.body;
  const userId = req.userId;

  try {
    const categoryUpdated = await CategoryService.updateCategory(categoryData, categoryId, userId);

    res.status(200).json({
      success: true,
      message: "Categoria atualizada com sucesso",
      data: { category: categoryUpdated },
    });
  } catch (err) {
    console.log("[CategoryControllerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

//Controller para excluir categoria
exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const userId = req.userId;

  try {
    const deletedCategory = await CategoryService.deleteCategory(categoryId, userId);

    res.status(204).json({
      success: true,
      message: "Categoria deletada com sucesso",
      data: { category: deletedCategory },
    });
  } catch (err) {
    console.log("[CategoryControllerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};
