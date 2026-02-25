import zod from "zod";

const loginSchema = zod.object({
  email: zod.email("Por favor, insira um email válido"),
  password: zod.string().min(1, "Senha não pode ser vazia"),
});

export default loginSchema;
