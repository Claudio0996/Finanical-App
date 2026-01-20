import LoginResponseSchema from "../schemas/LoginResponseSchema";
import LoginPayloadSchema from "../schemas/LoginPayloadSchema";

import checkResponseError from "../../../shared/checkResponseError";

export default async function Login(email, password) {
  try {
    const payloadValidation = LoginPayloadSchema.safeParse({ email, password });

    if (!payloadValidation.success) {
      throw new Error("Dados de envio inválidos");
    }

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const errorResponse = await checkResponseError(response);

    const result = errorResponse ?? response;

    const resData = await result.json();

    const parsedData = LoginResponseSchema.safeParse(resData);

    if (!parsedData.success) {
      throw new Error("Payload da API inválido");
    }

    if (!parsedData.data.success) {
      throw new Error(parsedData.data.message);
    }

    return parsedData.data;
  } catch (err) {
    throw err;
  }
}
