const BalanceService = require("../services/balanceService");

exports.getBalance = async (req, res, next) => {
  const balanceFilters = req.filters;
  const userId = req.userId;

  try {
    const balance = await BalanceService.getBalance(userId, balanceFilters);

    res.status(200).json({
      success: true,
      message: "Saldo encontrado",
      data: { balance },
    });
  } catch (err) {
    console.log("[BalanceContollerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};
