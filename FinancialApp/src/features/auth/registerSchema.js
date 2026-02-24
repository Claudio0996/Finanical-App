import zod from "zod";

const registerSchema = zod
  .object({
    name: zod.string().min(3, "Nome deve ter ao menos 3 caracteres"),
    email: zod.email("Por favor, insira um email válido"),
    password: zod.string().min(5, "Senha não pode ter menos de 5 dígitos"),
    passwordConfirmation: zod.string(),
  })
  .superRefine((obj, ctx) => {
    if (obj.password !== obj.passwordConfirmation) {
      ctx.addIssue({
        path: ["passwordConfirmation"],
        message: "Senha e confirmação de senha devem ser iguais",
      });
    }
  });

export default registerSchema;
