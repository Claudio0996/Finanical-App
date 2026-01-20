import RegisterPayloadSchema from "../schemas/RegisterPayloadSchema";
import RegisterResponseSchema from "../schemas/RegisterResponsePayload";

import checkResponseError from "../../../shared/checkResponseError";

export default async function Register(name, email, password, confirmPassword) {
  try {
    const validationData = RegisterPayloadSchema.safeParse({ name, email, password, confirmPassword });

    if (!validationData.success) {
      const formatted = validationData.error.issues.map((issue) => ({
        message: issue.message,
      }));

      throw {
        type: "validation",
        errors: formatted,
      };
    }

    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    const errorResponse = await checkResponseError(response);
    const result = errorResponse ?? response;

    const resData = await result.json();

    const parsedData = RegisterResponseSchema.safeParse(resData);

    if (!parsedData.success) {
      throw new Error("Payload da API inválido");
    }

    if (!parsedData.data.success) {
      throw new Error(parsedData.data.message);
    }
    return parsedData;
  } catch (err) {
    throw err;
  }
}
