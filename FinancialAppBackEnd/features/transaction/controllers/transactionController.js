const TransactionService = require("../services/transactionService");

//Controller para criar transação única
exports.createSingleTransaction = async (req, res, next) => {
  const userId = req.userId;
  const transactionData = req.body;

  try {
    const createdTranscation = await TransactionService.createSingleTransaction(userId, transactionData);

    res.status(201).json({
      success: true,
      message: "Transação criada com sucesso",
      data: { transaction: createdTranscation },
    });
  } catch (err) {
    console.log("[TransactionContollerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

//Controller para criação de múltiplas transações
exports.createMultipleTransactions = async (req, res, next) => {
  const userId = req.userId;
  const transactionData = req.body;

  try {
    const createdTransactions = await TransactionService.createMultipleTransaction(userId, transactionData);

    res.status(201).json({
      success: true,
      message: "Transações criadas com sucesso",
      data: {
        transactions: createdTransactions,
      },
    });
  } catch (err) {
    console.log("[TransactionContollerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

//Controller para trazer uma transação ou mais
exports.getTransactions = async (req, res, next) => {
  const userId = req.userId;
  const filters = req.query;

  try {
    const transaction = await TransactionService.getTransaction(userId, filters);

    res.status(200).json({
      success: true,
      message: "Transação encontrada",
      data: { transaction: transaction },
    });
  } catch (err) {
    console.log("[TransactionContollerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

//Controller para atualizar uma transação
exports.updateTransaction = async (req, res, next) => {
  const transactionId = req.params.id;
  const userId = req.userId;
  const updatedData = req.body;

  try {
    const updatedTransaction = await TransactionService.updateTransaction(transactionId, updatedData, userId);
    res.status(200).json({
      success: true,
      message: "Transação atualizada",
      data: { transaction: updatedTransaction },
    });
  } catch (err) {
    console.log("[TransactionContollerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

//Controller para excluir uma transação
exports.deleteTransaction = async (req, res, next) => {
  const transactionId = req.params.id;
  const userId = req.userId;

  try {
    const transactionDeleted = await TransactionService.deleteTransaction(transactionId, userId);

    res.status(200).json({
      success: true,
      message: "Transação excluída com sucesso",
      data: { transaction: transactionDeleted },
    });
  } catch (err) {
    console.log("[TransactionControllerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};
