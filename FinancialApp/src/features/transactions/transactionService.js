import transactionQuerySchema from "./transactionQuerySchema";
import apiClient from "../../shared/api/apiClient";

export const getTransactions = async (payloadFilters) => {
  const payloadValidation = transactionQuerySchema.safeParse(payloadFilters);

  if (!payloadValidation.success) {
    throw {
      type: "Validation",
      message: "Filtros selecionados não são permitidos",
    };
  }

  const queryData = payloadValidation.data ?? {};

  const response = await apiClient.get("/transactions", queryData);

  if (!response.success) {
    throw {
      type: "DOMAIN_ERROR",
      message: response.message,
    };
  }

  return response.data;
};
