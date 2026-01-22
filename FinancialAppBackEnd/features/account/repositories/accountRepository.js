const Account = require("../models/account");

exports.createAccount = async ({ name, type, initialBalance, currency, userId, bankId }) => {
  const account = new Account({ userId, name, bankId, type, initialBalance, currency });
  const savedAccount = await account.save();
  return savedAccount;
};

exports.findAccount = async (bankId, userId) => {
  return await Account.findOne({ userId, bankId });
};

exports.deleteAccount = async (bankId, userId) => {
  return await Account.findOneAndDelete({ userId, bankId });
};
