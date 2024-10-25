import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";



// Import PrimeReact stylesheets
import 'primereact/resources/themes/saga-blue/theme.css'; // Or your chosen theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import "./index.css";

// Import Material UI theme setup
import { createTheme, ThemeProvider } from "@mui/material/styles";

// **Import PrimeReactProvider from 'primereact/api'**
import { PrimeReactProvider } from 'primereact/api';

// Custom MUI theme if needed
const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          fontFamily: "Inter",
          textTransform: "none",
          backgroundColor: "#A26AD2",
          "&:hover": {
            backgroundColor: "#8a43c6",
            boxShadow: "none",
          },
          borderRadius: "32px",
          boxShadow: "none",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrap ThemeProvider inside PrimeReactProvider */}
    <ThemeProvider theme={theme}>
      <PrimeReactProvider value ={{ripple: true}}>
        <App />
      </PrimeReactProvider>
    </ThemeProvider>
  </React.StrictMode>
);
