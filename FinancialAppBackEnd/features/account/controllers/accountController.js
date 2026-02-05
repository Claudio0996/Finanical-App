const AccountService = require("../services/accountService");

//Controller para criação de conta
exports.createAccount = async (req, res, next) => {
  const userId = req.userId;
  const accountData = req.body;

  try {
    const newAccount = await AccountService.createAccount(userId, accountData);

    res.status(201).json({
      success: true,
      message: "Conta criada com sucesso",
      data: { account: newAccount },
    });
  } catch (err) {
    console.log("[AccountContollerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

//Controller para pegar uma conta específica
exports.getAccount = async (req, res, next) => {
  const accountId = req.params.id;
  const userId = req.userId;

  try {
    const account = await AccountService.getAccount(accountId, userId);

    res.status(200).json({
      success: true,
      message: "Conta encontrada com sucesso",
      data: { account: account },
    });
  } catch (err) {
    console.log("[AccountContollerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

//Controller para pegar todas as contas do usuário
exports.getAccounts = async (req, res, next) => {
  const userId = req.userId;

  try {
    const accounts = await AccountService.getAccounts(userId);

    res.status(200).json({
      success: true,
      message: "Contas encontradas com sucesso",
      data: { account: accounts },
    });
  } catch (err) {
    console.log("[AccountContollerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

//Controller para atualizar a conta cadastrada
exports.updateAccount = async (req, res, next) => {
  const accountId = req.params.id;
  const accountData = req.body;
  const userId = req.userId;

  try {
    const updatedAccount = await AccountService.updateAccount(accountData, accountId, userId);

    res.status(200).json({
      success: true,
      message: "Conta atualizada com sucesso",
      data: { account: updatedAccount },
    });
  } catch (err) {
    console.log("[AccountContollerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};

//Controller para excluir uma conta
exports.deleteAccount = async (req, res, next) => {
  const accountId = req.params.id;
  const userId = req.userId;

  try {
    const deletedAccount = await AccountService.deleteAccount(accountId, userId);

    res.status(200).json({
      success: true,
      message: "Conta deletada com sucesso",
      data: { account: deletedAccount },
    });
  } catch (err) {
    console.log("[AccountContollerError]. Erro interno: " + err.message);
    return res.status(err.status || 500).json({
      success: false,
      message: err.message,
      data: null,
    });
  }
};
