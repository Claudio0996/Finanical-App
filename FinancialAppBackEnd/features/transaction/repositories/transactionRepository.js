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

//Função para buscar transações por query dinâmica
exports.findTransactions = async (userId, filters) => {
  const query = { userId };

  if (filters.accountId) {
    query.accountId = filters.accountId;
  }

  if (filters.initialDate && filters.finalDate) {
    query.date = { $gte: filters.initialDate, $lte: filters.finalDate };
  }

  if (filters.finalDate && !filters.initialDate) {
    query.date = { $lte: filters.finalDate };
  }

  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  return await Transaction.find(query).sort({ createdAt: -1 });
};

//Função para buscar por limite de listagem e, se existir, tipo de transação
exports.findByLimitAndType = async ({userId, limit, type}) => {
  const query = { userId };

  if (type) {
    query.type = type;
  }

  return await Transaction.find(query).sort({ createdAt: -1 }).limit(limit);
};

//Função para atualizar uma transação
exports.updateTransaction = async (id, newData) => {
  return await Transaction.findOneAndUpdate({ _id: id }, newData, { new: true });
};

//Função para excluir uma transação
exports.deleteById = async (id) => {
  return await Transaction.findOneAndDelete({ _id: id });
};
