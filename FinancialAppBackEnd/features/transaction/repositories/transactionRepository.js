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

//Função para buscar por data
exports.findByPeriod = async ({ userId, initialDate, finalDate }) => {
  return await Transaction.find({ userId, date: { $gte: initialDate, $lte: finalDate } });
};

//Função para atualizar uma transação
exports.updateTransaction = async (id, newData) => {
  return await Transaction.findOneAndUpdate({ _id: id }, newData, { new: true });
};

//Função para excluir uma transação
exports.deleteById = async (id) => {
  return await Transaction.findOneAndDelete({ _id: id });
};
