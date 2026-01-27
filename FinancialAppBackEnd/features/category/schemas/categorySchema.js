const zod = require("zod");

const CategorySchema = zod.object({
  name: z.string().gte(4),
  type: z.enum(["income", "expense"]),
  color: z.string(),
});

module.exports = { CategorySchema };
