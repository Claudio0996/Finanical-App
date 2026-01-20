const passwordService = require("../../security/services/passwordService");
const userService = require("../../user/services/userService");
const accessTokenService = require("./accessTokenService");
const refreshTokenService = require("../../token/services/refreshTokenSerivce");

const ErrorObjects = require("../../../core/errors");

exports.loginUser = async ({ inputEmail, inputPassword }) => {
  const user = await userService.findUserByEmail(inputEmail);
  if (!user) {
    throw ErrorObjects.notFoundError("Usuário não existe");
  }
  const isMatched = await passwordService.comparePassword(inputPassword, user.password);
  if (!isMatched) {
    throw ErrorObjects.authError("Usuário ou senha incorreta");
  }

  const { password, ...publicUser } = user.toObject();
  const accessToken = accessTokenService.generateAccessToken(user._id, "admin");
  const refreshToken = await refreshTokenService.generateTokenObject(user._id);
  const persistedToken = await refreshTokenService.persistTokenObject(refreshToken);

  return {
    user: publicUser,
    token: accessToken,
    refreshToken: persistedToken,
  };
};

exports.registerUser = async ({ inputName, inputEmail, inputPassword }) => {
  const createdUser = await userService.createUser({ name: inputName, email: inputEmail, password: inputPassword });
  const { password, ...safeUser } = createdUser.toObject();
  const accessToken = accessTokenService.generateAccessToken(createdUser._id, "admin");
  const refreshToken = await refreshTokenService.generateTokenObject(createdUser._id);
  const persistedToken = await refreshTokenService.persistTokenObject(refreshToken);

  return { user: safeUser, token: accessToken, refreshToken: persistedToken };
};

exports.refreshSession = async (oldRefreshToken) => {
  const newRefreshToken = await refreshTokenService.rotateToken(oldRefreshToken);

  const user = await userService.findUserById(newRefreshToken.userId);
  if (!user) {
    throw ErrorObjects.notFoundError("Usuário não existe");
  }

  const { password, ...safeUser } = user.toObject();

  const accessToken = accessTokenService.generateAccessToken(user._id, "admin");

  return { user: safeUser, accessToken, refreshToken: newRefreshToken };
};
