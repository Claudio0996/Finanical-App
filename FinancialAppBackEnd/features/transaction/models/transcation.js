const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    // installments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Installment",
    //   },
    // ],
    status: {
      type: String,
      enum: ["active", "finished"],
      default: "active",
      required: true,
    },
    isRecurring: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = model("Transaction", transactionSchema);
