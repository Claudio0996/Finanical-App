const Account = require("../models/account");

exports.createAccount = async ({ name, type, initialBalance, currency, userId, bankId }) => {
  const account = new Account({ userId, name, bankId, type, initialBalance, currency });
  const savedAccount = await account.save();
  return savedAccount;
};

exports.findById = async (id) => {
  return await Account.findById(id);
};

exports.findByUserId = async (userId) => {
  return await Account.find({ userId });
};

exports.deleteById = async (id) => {
  return await Account.findOneAndDelete({ _id: id }, { new: false });
};
