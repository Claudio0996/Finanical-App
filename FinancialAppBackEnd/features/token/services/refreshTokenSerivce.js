const {
  save,
  findValidForRead,
  revokeToken,
  revokeAllByUser,
  updateOldToken,
  rotateTokenAtomic,
} = require("../repositories/refreshToken");
const crypto = require("crypto");
const { promisify } = require("util");

const randomBytesAsync = promisify(crypto.randomBytes);

const ErrorObjects = require("../../../core/errors");

const createToken = async () => {
  const buffer = await randomBytesAsync(32);

  return buffer.toString("hex");
};

const generateTokenObject = async (userId, userAgent = null, ipAddress = null) => {
  const token = await createToken();

  return {
    userId,
    token,
    userAgent,
    ipAddress,
    expiresAt: parseInt(Date.now()) + parseInt(process.env.REFRESH_TOKEN_TTL_MS),
  };
};

const generateRefreshTokenObject = async (oldToken, tokenString) => {
  return {
    userId: oldToken.userId,
    token: tokenString,
    userAgent: oldToken.userAgent,
    ipAddress: oldToken.ipAddress,
    expiresAt: oldToken.expiresAt,
  };
};
const findValidTokenObject = async (token) => {
  const validToken = await findValidForRead(token);
  if (!validToken) throw ErrorObjects.expiredTokenError("Token expirado");

  return validToken;
};

const persistTokenObject = async (token) => {
  const savedToken = await save(token);
  return savedToken;
};

exports.revokeTokenObject = async (token) => {
  const revokedToken = await revokeToken(token);
  if (!revokedToken) throw ErrorObjects.notFoundError("Não foi possível encontrar o token");

  return revokedToken;
};

exports.revokeAllTokensByUser = async (userId) => {
  const { acknowledged } = await revokeAllByUser(userId);
  if (!acknowledged) throw ErrorObjects.notFoundError("Não foi possível encontrar tokens deste usuário");

  return acknowledged;
};

exports.rotateToken = async (oldTokenString) => {
  const newTokenString = await createToken();

  const updatedToken = await rotateTokenAtomic(oldTokenString, newTokenString);

  if (!updatedToken) throw ErrorObjects.expiredTokenError("Token Expirado");

  const newToken = await generateRefreshTokenObject(updatedToken, newTokenString);

  return await persistTokenObject(newToken);
};

exports.findValidTokenObject = findValidTokenObject;
exports.generateTokenObject = generateTokenObject;
exports.persistTokenObject = persistTokenObject;
