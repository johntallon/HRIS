
import { Configuration, PublicClientApplication } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "1b1ffb5b-8849-45d7-98c0-630b7d83c647",
    authority: "https://login.microsoftonline.com/90f9f222-ca81-4252-ab4a-a9974c8557b2",
    redirectUri: `https://${window.location.host}`,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  }
};

export const loginRequest = {
  scopes: ["User.Read"]
};

export const msalInstance = new PublicClientApplication(msalConfig);
