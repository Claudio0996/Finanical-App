const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["receita", "despesa"],
    },
    amount: {
      type: Number,
      required: true,
    },
    installmentGroupId: {
      type: String,
    },
    installmentNumber: {
      type: Number,
    },
    totalInstallments: {
      type: Number,
    },
    date: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = model("Transaction", transactionSchema);
