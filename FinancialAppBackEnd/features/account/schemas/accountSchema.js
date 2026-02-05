const zod = require("zod");

const accountSchema = zod.object({
  name: zod.string().trim().min(4),
  bankId: zod.number(),
  type: zod.enum(["poupança", "corrente", "investimento"]),
  initialBalance: zod.number().nonnegative(),
  currency: zod.enum(["BRL", "USD"]),
});

module.exports = { accountSchema };
