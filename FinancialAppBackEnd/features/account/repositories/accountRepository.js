const Account = require("../models/account");

exports.createAccount = async (accountData) => {
  const account = new Account(accountData);
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
