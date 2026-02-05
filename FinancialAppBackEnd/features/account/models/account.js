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
      enum: ["poupança", "corrente", "investimento"],
    },
    initialBalance: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      enum: ["BRL", "USD"],
    },
  },
  { timestamps: true },
);

accountSchema.index({ bankId: 1, userId: 1, type: 1 }, { unique: true });

module.exports = model("Account", accountSchema);
