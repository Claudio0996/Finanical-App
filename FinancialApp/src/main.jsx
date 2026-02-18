import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRoot } from "./app/AppRoot";
import { ThemeProvider } from "@mui/material";

import { theme } from "./themes/index";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AppRoot />
    </ThemeProvider>
  </StrictMode>,
);
