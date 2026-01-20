export default function validatePassword(password) {
  const errors = [];

  if (password.length < 6) {
    errors.push({ message: "Senha deve ter ao menos 6 caracteres" });
  }

  if (!/[a-z]/.test(password)) {
    errors.push({ message: "Senha deve conter ao menos uma letra minúscula" });
  }

  if (!/[A-Z]/.test(password)) {
    errors.push({ message: "Senha deve conter ao menos uma letra maiúscula" });
  }
  if (!/[0-9]/.test(password)) {
    errors.push({ message: "Senha deve conter ao menos um número" });
  }
  if (!/[\.@_\$&-]/.test(password)) {
    errors.push({ message: "Senha deve conter ao menos um símbolo" });
  }

  return errors;
}
