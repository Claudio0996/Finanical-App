const Account = require("../models/account");

//Função para criar a conta
exports.createAccount = async (accountData) => {
  const newAccount = await Account.create(accountData);
  return newAccount;
};

//Função para buscar conta por id da conta
exports.findById = async (id) => {
  return await Account.findById(id);
};

//Função para encontrar conta por índice
exports.findByIndex = async (indexObject) => {
  return await Account.findOne(indexObject);
};

//Função para busca de contas com filtro dinâmico
exports.findAccount = async (userId, filters) => {
  const query = { userId };

  if (filters) {
    query.bankId = filters.bankId;
  }

  if (filters) {
    query.type = filters.type;
  }

  if (filters) {
    query.name = filters.name;
  }

  return await Account.find(query);
};

//Função para atualizar a conta
exports.updateAccount = async (id, newData) => {
  return await Account.findOneAndUpdate({ _id: id }, newData, { new: true });
};

//Função para excluir uma conta
exports.deleteById = async (id) => {
  return await Account.findOneAndDelete({ _id: id });
};
