const Account = require("../repositories/accountRepository");
const ErrorObjects = require("../../../core/errors");

exports.createAccount = async (name, userId, bankId, type, initialBalance, currency) => {
  const existingAccount = await Account.findByUserId(userId);

  if (existingAccount.length > 0) {
    existingAccount.forEach((acc) => {
      if (acc.bankId.toString() === bankId) {
        throw ErrorObjects.conflictError("Uma conta neste banco já existe para este usuário");
      }
    });
  }

  const newAccount = await Account.createAccount(name, type, initialBalance, currency, userId, bankId);

  return newAccount;
};

exports.listAccounts = async (userId) => {
  const accounts = await Account.findByUserId(userId);

  return accounts;
};

exports.deleteAccount = async (accountId, userId) => {
  const account = await Account.findById(accountId);
  const existingAccount = !!account;

  if (!existingAccount) {
    throw ErrorObjects.notFoundError("Esta conta não existe");
  }

  if (account.userId.toString() !== userId) {
    throw ErrorObjects.authError("Essa conta não pertence ao usuário, portanto não é possível excluir");
  }

  const deletedAccount = await Account.deleteById(accountId);

  return `Conta ${deletedAccount.name} deletada`;
};
