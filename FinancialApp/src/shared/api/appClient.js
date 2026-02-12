import { store } from "@/app/store";
import { logout } from "@/features/auth/authSlice";

const BASE_URL = "http://localhost:3000/";

let isRefreshing = false;
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

async function request(endpoint, queryString) {
  let finalUrl = `${BASE_URL}${endpoint}`;

  if (queryString) {
    finalUrl += `?${queryString}`;
  }

  const token = store.getState().auth.token;

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await rawRequest(finalUrl, options);

  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshFlow().finally(() => {
        isRefreshing = false;
      });
    }

    const newToken = await refreshPromise;

    const newOptions = {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    };

    const newResponse = await rawRequest(finalUrl, newOptions);

    if (newResponse.status === 401) {
      store.dispatch(logout());
      throw new Error("Sessão expirada");
    }
    const formattedData = await newResponse.json();
    return formattedData;
  }

  const data = await response.json();

  return data;
}

export const get = async (endpoint, query) => {
  let queryString;
  if (query && Object.keys(query).length > 0) {
    queryString = new URLSearchParams(query);
  }

  request(endpoint, queryString);
};
