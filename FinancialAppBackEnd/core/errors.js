exports.authError = (message = "Credenciais Inválidas!!") => {
  const error = new Error(message);
  error.status = 401;
  return error;
};

exports.conflictError = (message = "Conflito de dados") => {
  const error = new Error(message);
  error.status = 409;
  return error;
};

exports.notFoundError = (message = "Recurso não encontrado") => {
  const error = new Error(message);
  error.status = 404;
  return error;
};

exports.expiredTokenError = (message = "Token Expirado") => {
  const error = new Error(message);
  error.status = 401;
  return error;
};
