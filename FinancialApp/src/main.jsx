import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import { ThemeProvider } from "@emotion/react";

import { theme } from "./themes/index.jsx";
import store from "./app/store.jsx";

import "./index.css";
import AuthInitializer from "./app/AuthInitializer.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AuthInitializer />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
