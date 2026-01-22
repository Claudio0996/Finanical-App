const Account = require("../repositories/accountRepository");

exports.createAccount = async (accountData) => {
  try {
    const existingAccount = !!(await Account.findAccount(accountData.bankId, accountData.userId));

    if (existingAccount) {
      throw new Error("Essa conta já existe para esse usuário");
    }
    const createdAccount = await Account.createAccount(accountData);
    return createdAccount;
  } catch (err) {}
};
