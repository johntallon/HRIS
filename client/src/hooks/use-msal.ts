
import { useMsal as useOriginalMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

export function useMsal() {
  const { instance, accounts, inProgress } = useOriginalMsal();

  const login = async () => {
    try {
      await instance.loginPopup({
        ...loginRequest,
        prompt: "select_account",
      });
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const logout = async () => {
    try {
      await instance.logoutPopup();
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const getToken = async () => {
    try {
      if (accounts[0]) {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });
        return response.accessToken;
      }
    } catch (error) {
      console.error("Token acquisition failed:", error);
      return null;
    }
  };

  return {
    instance,
    accounts,
    inProgress,
    login,
    logout,
    getToken,
  };
}
