import { createTheme } from "@mui/material/styles";

const baseTheme = createTheme();

export const theme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    primary: {
      main: "#2563EB",
      light: "#60A5FA",
      dark: "#1E3A8A",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#1E40AF",
      light: "#60A5FA",
      dark: "#1E3A8A",
      contrastText: "#FFFFFF",
    },
    background: {
      ...baseTheme.palette.background,
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    text: {
      ...baseTheme.palette.text,
      primary: "#0F172A",
      secondary: "#1E293B",
    },
  },
  typography: {
    ...baseTheme.typography,
    fontFamily: "Inter, Roboto, sans-serif",
  },
});
