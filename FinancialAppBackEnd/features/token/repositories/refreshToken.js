const RefreshToken = require("../models/refreshToken");

exports.save = async (tokenData) => {
  return await RefreshToken.create(tokenData);
};

exports.updateOldToken = async (oldToken, newToken) => {
  return await RefreshToken.findOneAndUpdate(
    { _id: oldToken._id },
    { revokedAt: Date.now(), replacedBy: newToken.token }
  );
};

exports.findValidForRead = async (token) => {
  return await RefreshToken.findOne({
    token,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
    replacedBy: null,
  }).lean();
};

exports.rotateTokenAtomic = async (oldTokenString, newTokenString) => {
  return await RefreshToken.findOneAndUpdate(
    {
      token: oldTokenString,
      revokedAt: null,
      replacedBy: null,
      expiresAt: { $gt: new Date() },
    },
    { $set: { revokedAt: new Date(), replacedBy: newTokenString } },
    { new: false }
  );
};

exports.revokeToken = async (token) => {
  return await RefreshToken.findOneAndUpdate({ token }, { revokedAt: Date().now }, { new: true });
};

exports.revokeAllByUser = async (userId) => {
  return await RefreshToken.updateMany({ userId }, { revokedAt: Date().now });
};
