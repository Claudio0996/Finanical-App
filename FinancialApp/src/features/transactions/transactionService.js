import transactionQuerySchema from "@/features/transactions/transactionQuerySchema";
import apiClient from "@/shared/api/appClient";

const getTransactions = async (payloadFilters) => {
  const payloadValidation = transactionQuerySchema.safeParse(payloadFilters);

  const data = await apiClient.get("/transactions", payloadValidation.data);
};
