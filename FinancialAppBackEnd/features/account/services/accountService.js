const Account = require("../repositories/accountRepository");
const ErrorObjects = require("../../../core/errors");

//Função para criar nova conta bancária
exports.createAccount = async (userId, accountData) => {
  const existingAccount = await Account.findByIndex({ bankId: accountData.bankId, userId, type: accountData.type });

  if (existingAccount) {
    throw ErrorObjects.conflictError("Conta já existe");
  }

  const accountObject = {
    userId,
    ...accountData,
  };

  const newAccount = await Account.createAccount(accountObject);

  return newAccount;
};

//Função para atualizar uma conta
exports.updateAccount = async (accountData, id, userId) => {
  const existingAccount = await Account.findById(id);

  if (!existingAccount) {
    throw ErrorObjects.notFoundError("Conta não encontrada");
  }

  if (existingAccount.userId.toString() !== userId) {
    throw ErrorObjects.authError("Esta conta não pertence ao seu usuário");
  }

  return await Account.updateAccount(id, accountData);
};

//Função para Excluir uma conta de um usuário
exports.deleteAccount = async (id, userId) => {
  const existingAccount = await Account.findById(id);

  if (!existingAccount) {
    throw ErrorObjects.notFoundError("Conta não encontrada");
  }

  if (existingAccount.userId.toString() !== userId) {
    throw ErrorObjects.authError("Esta conta não pertence ao seu usuário");
  }

  return await Account.deleteById(id);
};

//Função para pegar apenas uma conta por usuário
exports.getAccount = async (id, userId) => {
  const existingAccount = await Account.findById(id);

  if (!existingAccount) {
    throw ErrorObjects.notFoundError("Conta não encontrada");
  }

  if (existingAccount.userId.toString() !== userId) {
    throw ErrorObjects.authError("Essra conta não pertence ao usuário");
  }

  return existingAccount;
};

//Função para trazer todas as contas de um usuário
exports.getAccounts = async (userId) => {
  const accounts = await Account.findAccount(userId);

  return accounts;
};
