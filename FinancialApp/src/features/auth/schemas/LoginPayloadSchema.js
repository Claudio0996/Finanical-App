import { z } from "zod";

const LoginPayloadSchema = z.object({
  email: z.coerce.string().trim().email(),
  password: z.coerce.string().trim().min(6),
});
export default LoginPayloadSchema;
