import { store } from "@/app/store";
import { updateToken } from "@/features/auth/authSlice";

const BASE_URL = "http://localhost:3000/";

let refreshPromise;

async function rawRequest(url, options) {
  return await fetch(url, options);
}

async function refreshFlow() {
  const finalUrl = `${BASE_URL}refresh`;
  const options = {
    credentials: "include",
  };

  try {
    const response = await rawRequest(finalUrl, options);
    if (!response.ok) {
      throw new Error("Não foi possível fazer a request");
    }

    const data = await response.json();
    const newAccessToken = data.data.token;

    store.dispatch(updateToken(newAccessToken));

    return newAccessToken;
  } catch (err) {
    throw err;
  }
}

async function request({ endpoint, method, queryString, body }) {
  let finalUrl = `${BASE_URL}${endpoint}`;

  if (queryString) {
    finalUrl += `?${queryString}`;
  }

  const token = store.getState().auth.token;

  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
    options.headers["Content-Type"] = "application/json";
  }

  const response = await rawRequest(finalUrl, options);

  if (response.status === 401) {
    if (!refreshPromise) {
      refreshPromise = refreshFlow()
        .catch(() => {
          throw {
            type: "SESSION_EXPIRED",
            status: 401,
            message: "Sessão expirada",
          };
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const newToken = await refreshPromise;

    const newOptions = {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      },
    };

    const newResponse = await rawRequest(finalUrl, newOptions);

    if (newResponse.status === 401) {
      throw {
        type: "SESSION_EXPIRED",
        status: 401,
        message: "Sessão expirada",
      };
    } else if (!newResponse.ok) {
      throw {
        type: "HTTP_ERROR",
        status: newResponse.status,
        message: "Erro na request",
      };
    }

    const formattedData = await newResponse.json();
    return formattedData;
  } else if (!response.ok) {
    throw {
      type: "HTTP_ERROR",
      status: response.status,
      message: "Erro na request",
    };
  }

  const formattedData = await response.json();
  return formattedData;
}

export const get = async (endpoint, query) => {
  let queryString;
  if (query && Object.keys(query).length > 0) {
    queryString = new URLSearchParams(query);
  }

  return request({ endpoint, method: "GET", queryString });
};
