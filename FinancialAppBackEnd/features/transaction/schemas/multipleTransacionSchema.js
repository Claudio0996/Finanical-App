const zod = require("zod");

const multipleTransactionSchema = zod.object({
  description: zod.string().min(4),
  amount: zod.number().positive(),
  installments: zod.number().int().min(2),
  date: zod.coerce.date(),
  accountId: zod.string(),
  categoryId: zod.string(),
  type: zod.enum(["receita", "despesa"]),
});

module.exports = { multipleTransactionSchema };
