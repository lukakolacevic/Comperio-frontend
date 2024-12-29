import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";



import 'primereact/resources/themes/lara-light-blue/theme.css'; // Theme
import 'primereact/resources/primereact.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // PrimeIcons CSS


import "./index.css";

// Import Material UI theme setup
//import { createTheme, ThemeProvider } from "@mui/material/styles";

// **Import PrimeReactProvider from 'primereact/api'**
//import { PrimeReactProvider } from 'primereact/api';

// Custom MUI theme if needed
{/*
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
});*/}

import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrap the app in GoogleOAuthProvider */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
