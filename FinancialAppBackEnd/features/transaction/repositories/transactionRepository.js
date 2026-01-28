const Transaction = require("../models/transaction");

//Função para criar uma transação
exports.createSingleTransaction = async (transacitionData) => {
  const transaction = await Transaction.create(transacitionData);

  return transaction;
};

//Função para criar várias transações
exports.createManyTransactions = async (transactionsList) => {
  const transactions = await Transaction.insertMany(transactionsList);
  return transactions;
};

//Função para buscar uma transação por Id
exports.findById = async (id) => {
  return await Transaction.findById(id);
};
