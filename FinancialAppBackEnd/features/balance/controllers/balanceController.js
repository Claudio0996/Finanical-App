const BalanceService = require("../services/balanceService");

//Função para trazer o saldo de uma conta
exports.calculateBalance = async (req, res, next) => {
  const accountId = req.params.id;
  const userId = req.userId;

  try {
    const balance = await BalanceService.getAccountBalance(accountId, userId);

    res.status(200).json({
      success: true,
      message: "Saldo encontrado com sucesso",
      data: { balance },
    });

    res.status(200).json({});
  } catch (err) {
    console.log("[BalanceContollerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

exports.calculateBalanceByPeriod = async (req, res, next) => {
  const balanceFilters = req.query;
  const userId = req.userId;
};
