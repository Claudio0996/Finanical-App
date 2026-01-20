import { z } from "zod";

import dataSchema from "./userDataSchema";

const LoginResponseSchema = z.object({
  success: z.boolean(),
  message: z.coerce.string().trim(),
  data: z.union([dataSchema, z.null()]),
});

export default LoginResponseSchema;
