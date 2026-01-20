import { z } from "zod";

import userSchema from "./UserSchema";

const dataSchema = z.object({
  user: userSchema,
  token: z.coerce.string().trim(),
});

export default dataSchema;
