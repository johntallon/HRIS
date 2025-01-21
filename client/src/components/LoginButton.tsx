import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { Button } from "./ui/button";

const LoginButton: React.FC = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect({
            ...loginRequest,
            prompt: 'select_account'
        }).catch((e) => {
            console.error(e);
        });
    };

    return (
        <Button onClick={handleLogin}>
            Sign in with Microsoft
        </Button>
    );
};

export default LoginButton;