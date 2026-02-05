const zod = require("zod");

const singleTransactionSchema = zod.object({
  type: zod.enum(["receita", "despesa"]),
  amount: zod.coerce.number().positive(),
  date: zod.coerce.date(),
  accountId: zod.coerce.string(),
  categoryId: zod.coerce.string(),
  description: zod.coerce.string().min(4),
});

module.exports = { singleTransactionSchema };
