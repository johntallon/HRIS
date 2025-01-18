import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import "./index.css";
import '@syncfusion/ej2-base/styles/material.css';
import '@syncfusion/ej2-react-diagrams/styles/material.css';
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

import { msalConfig } from "./authConfig";



const msalInstance = new PublicClientApplication(msalConfig);

createRoot(document.getElementById("root")!).render(
  <MsalProvider instance={msalInstance}>
      <StrictMode>
        <App/>
      </StrictMode>
    </MsalProvider>,
);
