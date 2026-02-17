import zod from "zod";

const registerSchema = zod
  .object({
    name: zod.string().min(3),
    email: zod.email(),
    password: zod.string().min(5),
    confirmPassword: zod.string(),
  })
  .superRefine((obj, ctx) => {
    if (obj.password !== obj.confirmPassword) {
      ctx.addIssue({
        path: ["auth"],
        message: "Senhas são diferentes",
      });
    }
  });

export default registerSchema;
