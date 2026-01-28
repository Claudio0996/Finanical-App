const zod = require("zod");

const multipleTransactionSchema = zod.object({
  description: zod.coerce.string().min(4),
  totalAmount: zod.coerce.number().positive(),
  installments: zod.coerce.number().int().min(2),
  firstDate: zod.coerce.date(),
  accountId: zod.coerce.string(),
  categoryId: zod.coerce.string(),
});

module.exports = { multipleTransactionSchema };
