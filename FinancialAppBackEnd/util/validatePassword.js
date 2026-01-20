exports.validatePassword = (val) => {
  const checkedPassword = { val, errors: [] };

  if (!/[a-z]/.test(val)) {
    checkedPassword.errors.push("Senha deve conter ao menos uma letra minúscula");
  }

  if (!/[A-Z]/.test(val)) {
    checkedPassword.errors.push("Senha deve conter ao menos uma letra maiúscula");
  }
  if (!/[0-9]/.test(val)) {
    checkedPassword.errors.push("Senha deve conter ao menos um número");
  }
  if (!/[^a-zA-Z0-9\s]/.test(val)) {
    checkedPassword.errors.push("Senha deve conter ao menos um símbolo");
  }

  return checkedPassword;
};
