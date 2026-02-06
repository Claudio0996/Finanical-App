const zod = require("zod");

const singleTransactionSchema = zod.object({
  type: zod.enum(["receita", "despesa"]),
  amount: zod.number().positive(),
  date: zod.coerce.date(),
  accountId: zod.string(),
  categoryId: zod.string(),
  description: zod.string().min(4),
});

module.exports = { singleTransactionSchema };
