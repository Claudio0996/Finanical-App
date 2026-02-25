import registerSchema from "./registerSchema";
import loginSchema from "./loginSchema";

export const refresh = async () => {
  const response = await fetch("http://localhost:3000/refresh", {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    const error = await response.json();
    throw {
      type: "HTTP_ERROR",
      status: response.status,
      message: error.message,
    };
  }

  const resData = await response.json();

  return resData;
};

export const register = async (payload) => {
  const payloadValidated = registerSchema.safeParse(payload);

  if (!payloadValidated.success) {
    throw {
      type: "VALIDATION_ERROR",
      message: "Dados recebidos do formulário inválidos",
    };
  }

  const response = await fetch("http://localhost:3000/register", {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    method: "POST",
    body: JSON.stringify(payloadValidated.data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw {
      type: "HTTP_ERROR",
      status: response.status,
      message: error.message,
    };
  }

  const formattedData = await response.json();

  return formattedData.data;
};

export const login = async (payload) => {
  const payloadValidation = loginSchema.safeParse(payload);

  if (!payloadValidation.success) {
    throw {
      type: "VALIDATION_ERROR",
      message: "Dados recebidos do formulário inválidos",
    };
  }

  const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payloadValidation.data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw {
      type: "HTTP_ERROR",
      status: response.status,
      message: error.message,
    };
  }

  const formattedData = await response.json();

  return formattedData.data;
};
