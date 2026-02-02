const AccountService = require("../../account/services/accountService");
const TransactionRepository = require("../../transaction/repositories/transactionRepository");

//Função para pegar saldo total de uma conta
exports.getAccountBalance = async (accountId, userId) => {
  const account = await AccountService.getAccount(accountId, userId);

  const transactions = await TransactionRepository.findByUserIdAndAccountId(accountId, userId);

  const sumTransactions = transactions.reduce((sum, transaction) => {
    if (transaction.type === "income") {
      return sum + transaction.amount;
    } else {
      return sum - transaction.amount;
    }
  }, 0);

  const totalBalance = account.initialBalance + sumTransactions;

  return totalBalance;
};

//Função para pegar saldo de uma conta por um período determinado
exports.getAccountBalanceByPeriod = async (accountId, userId, initialDate, finalDate) => {
  const account = await AccountService.getAccount(accountId, userId);

  const transactions = await TransactionRepository.findByPeriod(userId, accountId, initialDate, finalDate);

  const sumTransactions = transactions.reduce((sum, transaction) => {
    if (transaction.type === "income") {
      return sum + transaction.amount;
    } else {
      return sum - transaction.amount;
    }
  }, 0);

  const totalBalance = account.initialBalance + sumTransactions;

  return totalBalance;
};

//Função para pegar saldo de uma conta até uma data
exports.getAccountBalaceUntilPeriod = async (userId, accountId, date) => {
  const account = await AccountService.getAccount(accountId, userId);

  const transactions = await TransactionRepository.findUntilPeriod(userId, accountId, date);

  const sumTransactions = transactions.reduce((sum, transaction) => {
    if (transaction.type === "income") {
      return sum + transaction.amount;
    } else {
      return sum - transaction.amount;
    }
  }, 0);

  const totalBalance = account.initialBalance + sumTransactions;

  return totalBalance;
};
