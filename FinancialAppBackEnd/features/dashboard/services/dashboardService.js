const TransactionService = require("../../transaction/services/transactionService");
const BalanceService = require("../../balance/services/balanceService");

const ErrorObjects = require("../../../core/errors");

exports.getSummary = async (userId, type) => {
  const defaultType = type === "receita" || type === "despesa" ? type : undefined;

  const [transactions, balance] = await Promise.allSettled([
    TransactionService.getLastTransactions({ userId, limit: 10, type: defaultType }),
    BalanceService.getBalance(userId),
  ]);

  if (transactions.status === "rejectd") {
    throw ErrorObjects.notFoundError("Dados não encontrados");
  }

  const finalObject = {
    transactions: transactions.value,
    balance: balance.status === "fulfilled" ? balance.value : null,
  };

  console.log(transactions, balance);

  return finalObject;
};
