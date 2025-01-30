import React from "react";
import { Button } from "./ui/button";

const LoginButton: React.FC = () => {
    const handleLogin = () => {
        window.location.href = '/api/auth/login';
    };

    return (
        <Button onClick={handleLogin}>
            Sign in with Microsoft
        </Button>
    );
};

export default LoginButton;