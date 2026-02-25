const uuid = require("uuid");

const TransactionRepository = require("../repositories/transactionRepository");
const AccountService = require("../../account/services/accountService");
const CategoryService = require("../../category/services/categoryService");
const ErrorObjects = require("../../../core/errors");

const { getInstallmentDate } = require("../../../util/dateFunctions");

//Função para criar transação única
exports.createSingleTransaction = async (userId, transactionData) => {
  await AccountService.getAccount(transactionData.accountId, userId);

  const category = await CategoryService.getCategory(transactionData.categoryId, userId);

  if (transactionData.type !== category.type) {
    throw ErrorObjects.conflictError("Categoria e transação não são do mesmo tipo");
  }

  const transaction = await TransactionRepository.createSingleTransaction({
    ...transactionData,
    userId,
  });

  return transaction;
};

//Função para criar transação parcelada
exports.createMultipleTransaction = async (userId, transactionData) => {
  const transactions = [];
  await AccountService.getAccount(transactionData.accountId, userId);

  const category = await CategoryService.getCategory(transactionData.categoryId, userId);

  if (transactionData.type !== category.type) {
    throw ErrorObjects.conflictError("Categoria e transação não são do mesmo tipo");
  }

  //Criar uma função futura para ajustar calculo das parcelas
  const value = Number.parseFloat((transactionData.amount / transactionData.installments).toFixed(2));

  const installmentGroupId = uuid.v4();

  for (let i = 0; i < transactionData.installments; i++) {
    const transaction = {
      ...transactionData,
      installmentNumber: i + 1,
      date: getInstallmentDate(transactionData.date, i),
      amount: value,
      installmentGroupId,
      userId,
    };
    transactions.push(transaction);
  }

  const createdTransactions = await TransactionRepository.createManyTransactions(transactions);

  return createdTransactions;
};

//Função que retorna todas as transações de um usuário
exports.getTransactions = async (userId, filters) => {
  if (filters.accountId) {
    await AccountService.getAccount(filters.accountId, userId);
  }

  const transactionList = await TransactionRepository.find({
    ...filters,
    userId,
  });

  return transactionList;
};

//Função para atualizar uma transação
exports.updateTransaction = async (id, data, userId) => {
  const transaction = await TransactionRepository.findById(id);

  if (!transaction) {
    throw ErrorObjects.notFoundError("Transação não encontrada");
  }

  if (transaction.userId.toString() !== userId) {
    throw ErrorObjects.authError("Essa transação não pertence ao usuário");
  }

  if (data.type !== transaction.type) {
    throw ErrorObjects.conflictError("Transações não são do mesmo tipo");
  }

  if (data.accountId !== transaction.accountId.toString()) {
    await AccountService.getAccount(data.accountId, userId);
  }

  if (data.categoryId !== transaction.categoryId.toString()) {
    await CategoryService.getCategory(data.categoryId, userId);
  }

  return await TransactionRepository.updateTransaction(id, data);
};

//Função para excluir uma transação
exports.deleteTransaction = async (id, userId) => {
  const transaction = await TransactionRepository.findById(id);

  if (!transaction) {
    throw ErrorObjects.notFoundError("Transação não existe");
  }

  if (transaction.userId.toString() !== userId) {
    throw ErrorObjects.authError("Esta transação não pertence ao usuário");
  }

  return await TransactionRepository.deleteById(id);
};

exports.getLastTransactions = async ({ userId, limit, type }) => {
  const lookupObject = { limit };

  if (type) {
    lookupObject.type = type;
  }

  const limitedTransactions = await TransactionRepository.findByLimitAndType({
    userId,
    ...lookupObject,
  });

  return limitedTransactions;
};
