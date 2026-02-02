const uuid = require("uuid");

const TransactionRepository = require("../repositories/transactionRepository");
const AccountService = require("../../account/services/accountService");
const CategoryService = require("../../category/services/categoryService");
const ErrorObjects = require("../../../core/errors");

const { getInstallmentDate } = require("../../../util/dateFunctions");

//Função para criar transação única
exports.createSingleTransaction = async (transactionData, userId) => {
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
exports.createMultipleTransaction = async (transactionData, userId) => {
  const transactions = [];
  await AccountService.getAccount(transactionData.accountId, userId);

  const category = await CategoryService.getCategory(transactionData.categoryId, userId);

  if (transactionData.type !== category.type) {
    throw ErrorObjects.conflictError("Categoria e transação não são do mesmo tipo");
  }

  //Criar uma função futura para ajustar calculo das parcelas
  const value = Number.parseFloat((transactionData.amount / transactionData.totalInstallments).toFixed(2));

  const installmentGroupId = uuid.v4();

  for (let i = 0; i < transactionData.totalInstallments; i++) {
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
