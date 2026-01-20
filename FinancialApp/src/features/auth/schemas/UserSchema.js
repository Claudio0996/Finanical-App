import { z } from "zod";

const userSchema = z.object({
  email: z.coerce.string().trim().email(),
  name: z.coerce.string().trim(),
  _id: z.coerce.string().trim(),
});

export default userSchema;
