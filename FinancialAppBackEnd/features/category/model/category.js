const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["receita", "despesa"],
    },
    color: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true },
);

categorySchema.index({ userId: 1, type: 1, name: 1 }, { unique: true });

module.exports = model("Category", categorySchema);
