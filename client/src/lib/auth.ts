
import { Configuration, PublicClientApplication } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "1b1ffb5b-8849-45d7-98c0-630b7d83c647",
    authority: "https://login.microsoftonline.com/90f9f222-ca81-4252-ab4a-a9974c8557b2",
    redirectUri: `https://${window.location.host}`,
    protocolMode: "AAD"
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    allowNativeBroker: false,
    windowHashTimeout: 60000,
    iframeHashTimeout: 6000,
    loadFrameTimeout: 0,
    pkce: {
      challengeMethod: "S256"
    }
  }
};

export const loginRequest = {
  scopes: ["User.Read"]
};

export const msalInstance = new PublicClientApplication(msalConfig);
