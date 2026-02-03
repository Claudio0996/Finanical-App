const AccountService = require("../../account/services/accountService");
const TransactionRepository = require("../../transaction/repositories/transactionRepository");

const calculateBalance = (initalBalance, transactions) => {
  const sumTransactions = transactions.reduce((sum, transaction) => {
    if (transaction.type === "income") {
      return sum + transaction.amount;
    } else {
      return sum - transaction.amount;
    }
  }, 0);

  const totalBalance = initalBalance + sumTransactions;

  return totalBalance;
};

//Função para pegar saldo total de uma conta
exports.getAccountBalance = async (accountId, userId) => {
  const account = await AccountService.getAccount(accountId, userId);

  const transactions = await TransactionRepository.find(accountId, userId);

  return calculateBalance(account.initialBalance, transactions);
};

//Função para pegar saldo de uma conta por um período determinado
exports.getAccountBalanceByPeriod = async (accountId, userId, initialDate, finalDate) => {
  const account = await AccountService.getAccount(accountId, userId);

  const transactions = await TransactionRepository.find(userId, accountId, initialDate, finalDate);

  return calculateBalance(account.initialBalance, transactions);
};

//Função para pegar saldo de uma conta até uma data
exports.getAccountBalaceUntilPeriod = async (userId, accountId, date) => {
  const account = await AccountService.getAccount(accountId, userId);

  const transactions = await TransactionRepository.find(userId, accountId, date);

  return calculateBalance(account.initialBalance, transactions);
};
