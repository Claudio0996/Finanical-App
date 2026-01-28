const Account = require("../models/account");

exports.createAccount = async (accountData) => {
  const newAccount = await Account.create(accountData);
  return newAccount;
};

exports.findById = async (id) => {
  return await Account.findById(id);
};

exports.findByUserId = async (userId) => {
  return await Account.find({ userId });
};

exports.findByIndex = async (indexObject) => {
  return await Account.findOne(indexObject);
};

exports.updateAccount = async (id, newData) => {
  return await Account.findOneAndUpdate({ _id: id }, newData, { new: true });
};

exports.deleteById = async (id) => {
  return await Account.findOneAndDelete({ _id: id });
};
