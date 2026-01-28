const Transaction = require("../models/transaction");

//Função para criar uma transação
exports.createSingleTransaction = async (transactionData) => {
  const transaction = await Transaction.create(transactionData);

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

//Função para buscar todas as transações de um usuário
exports.findByUserId = async (userId) => {
  return await Transaction.find({ userId });
};

exports.findByUserIdAndDate = async (userId, startDate, endDate) => {};
