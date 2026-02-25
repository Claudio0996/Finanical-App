const DashboardService = require("../services/dashboardService");

exports.getSummary = async (req, res, next) => {
  const type = req.query.transactionType;
  const userId = req.userId;

  try {
    const data = await DashboardService.getSummary(userId, type);

    return res.status(200).json({
      success: true,
      message: "Dados retornados com sucesso",
      data: data,
    });
  } catch (err) {
    console.log("[DashboardControllerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};
