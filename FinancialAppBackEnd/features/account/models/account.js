const { Schema, model } = require("mongoose");

const accountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    bankId: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["checking", "savings", "wallet"],
    },
    initialBalance: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

accountSchema.index({ bankId, userId }, { unique: true });

module.exports = model("Account", accountSchema);
