const zod = require("zod");

const CategorySchema = zod.object({
  name: zod.string().min(4),
  type: zod.enum(["receita", "despesa"]),
  color: zod.string(),
});

module.exports = { CategorySchema };
