const Transaction = require("../models/transaction");

exports.create = async (transactionData) => {
  const transaction = await Transaction.create(transactionData);
  return transaction;
};

exports.createMany = async (transactionsList) => {
  const transactions = await Transaction.insertMany(transactionsList);
  return transactions;
};
