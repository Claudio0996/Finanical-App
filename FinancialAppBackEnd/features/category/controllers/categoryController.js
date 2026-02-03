const CategoryService = require("../services/categoryService");

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
      message: "Não foi possível criar a categoria",
      data: null,
    });
  }
};

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
      message: "Categoria não encontrada",
      data: null,
    });
  }
};
