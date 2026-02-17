import registerSchema from "./registerSchema";

export const refresh = async () => {
  const response = await fetch("/api/refresh", {
    credentials: include,
    method: "POST",
  });

  if (!response.ok) {
    throw {
      type: "HTTP_ERROR",
      message: "Não foi possível fazer a requisição",
    };
  }

  const resData = await response.json();

  if (!resData.success) {
    throw {
      type: "AUTH_ERROR",
      message: resData.message,
    };
  }

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

  const response = await fetch("/api/register", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(payloadValidated.data),
  });

  if (!response.ok) {
    throw {
      type: "HTTP_ERROR",
      status: response.status,
      message: "Erro na request ",
    };
  }

  const formattedData = await response.json();

  if (!formattedData.success) {
    throw {
      type: "AUTH_ERROR",
      message: formattedData.message,
    };
  }

  return formattedData.data;
};
