import zod from "zod";

const transactionQuerySchema = zod.object({
  accountId: zod.string().min(1).optional(),
  categoryId: zod.string().min(1).optional(),
  type: zod.enum(["receita", "despesa"]).optional(),
  initialDate: zod.coerce.date().optional(),
  finalDate: zod.coerce.date().optional(),
});

export default transactionQuerySchema;
