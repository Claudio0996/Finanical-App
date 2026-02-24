const zod = require("zod");
const { validatePassword } = require("../../../util/validatePassword");

const User = zod
  .object({
    name: zod.coerce.string().trim(),
    email: zod.coerce.string().trim().lowercase().email(),
    password: zod.coerce.string(),
    passwordConfirmation: zod.coerce.string(),
  })
  .superRefine((obj, ctx) => {
    const testedPassword = validatePassword(obj.password);

    if (testedPassword.errors.length > 0) {
      testedPassword.errors.forEach((error) =>
        ctx.addIssue({
          path: ["password"],
          message: error,
        }),
      );
    }

    if (obj.password !== obj.passwordConfirmation) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords don't match",
      });
    }
  });

const loginSchema = User.pick({
  email: true,
  password: true,
}).superRefine((obj, ctx) => {
  const testedPassword = validatePassword(obj.password);

  if (testedPassword.errors.length > 0) {
    testedPassword.errors.forEach((error) =>
      ctx.addIssue({
        path: ["password"],
        message: error,
      }),
    );
  }
});

module.exports = { User, loginSchema };
