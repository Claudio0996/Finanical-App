//Falta montar objeto com dados sanitizados, serializar datas e e fechar retorno do service

import transactionQuerySchema from "./transactionQuerySchema";

const getTransactions = async (payloadFilters) => {
  let baseURL = "http://localhost:3000/transactions";

  if (payloadFilters) {
    const payloadValidation = transactionQuerySchema.safeParse(payloadFilters);

    if (payloadValidation.success) {
      const queryString = new URLSearchParams(payloadValidation.data);

      baseURL += `?${queryString}`;
    }
  }

  const fetchedData = await fetch(baseURL);
};
