const AccountService = require("../../account/services/accountService");
const TransactionRepository = require("../../transaction/repositories/transactionRepository");

const calculateBalance = (initalBalance, transactions) => {
  const sumTransactions = transactions.reduce((sum, transaction) => {
    if (transaction.type === "receita") {
      return sum + transaction.amount;
    } else {
      return sum - transaction.amount;
    }
  }, 0);

  const totalBalance = initalBalance + sumTransactions;

  return totalBalance;
};

//Função para pegar saldo total com base em queryDinâmica
exports.getBalance = async (userId, filters) => {
  let initialBalance = filters.accountId
    ? (await AccountService.getAccount(filters.accountId, userId)).initialBalance
    : 0;
  const transactions = await TransactionRepository.findTransactions(userId, filters);

  return calculateBalance(initialBalance, transactions);
};
