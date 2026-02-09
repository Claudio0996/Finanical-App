const zod = require("zod");

const TransactionQuerySchema = zod
  .object({
    accountId: zod.string().optional(),
    categoryId: zod.string().optional(),
    type: zod.enum(["receita", "despesa"]).optional(),
    initialDate: zod.coerce.date().optional(),
    finalDate: zod.coerce.date().optional(),
  })
  .superRefine((obj, ctx) => {
    if (obj.finalDate && obj.initialDate) {
      if (obj.initialDate > obj.finalDate) {
        ctx.addIssue({
          path: ["transaction"],
          message: "Data inicial é maior que data final",
        });
      }
    }
  });

module.exports = { TransactionQuerySchema };
