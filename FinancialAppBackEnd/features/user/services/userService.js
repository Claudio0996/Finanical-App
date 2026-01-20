const { hashPassword } = require("../../security/services/passwordService");
const User = require("../repositories/userRepository");
const ErrorObjects = require("../../../core/errors");

exports.createUser = async ({ name, email, password }) => {
  const existingUser = !!(await User.findUserByEmail(email));
  if (existingUser) {
    throw ErrorObjects.conflictError("Usuário já existe");
  }
  const hashedPassword = await hashPassword(password);
  return await User.saveUser({ name, email, password: hashedPassword });
};

exports.findUserByEmail = async (email) => {
  return await User.findUserByEmail(email);
};

exports.findUserById = async (id) => {
  return await User.findUserById(id);
};
