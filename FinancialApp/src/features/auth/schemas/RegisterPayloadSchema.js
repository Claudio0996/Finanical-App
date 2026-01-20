import { z } from "zod";

import validatePassword from "../../../shared/validatePassword";

const RegisterPayloadSchema = z
  .object({
    name: z.coerce.string().min(3).trim(),
    email: z.coerce.string().trim().email(),
    password: z.coerce.string().trim().min(6),
    confirmPassword: z.coerce.string(),
  })
  .superRefine((obj, ctx) => {
    const passwordValidated = validatePassword(obj.password);

    if (passwordValidated.length > 0) {
      passwordValidated.forEach((error) => {
        ctx.addIssue({
          path: ["password"],
          code: "custom",
          message: error.message,
        });
      });
    }

    if (obj.password !== obj.confirmPassword) {
      ctx.addIssue({
        path: "confirmPassword",
        code: "custom",
        message: "Senhas não são iguais",
      });
    }
  });

export default RegisterPayloadSchema;
