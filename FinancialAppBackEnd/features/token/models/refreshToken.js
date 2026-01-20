const { Schema, model } = require("mongoose");

const refreshTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    replacedBy: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model("RefreshToken", refreshTokenSchema);
