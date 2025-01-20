
import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { Button } from "./ui/button";

const LoginButton: React.FC = () => {
    const { instance } = useMsal();

    const handleLogin = () => {
        const authWindow = window.open('https://login.microsoftonline.com/90f9f222-ca81-4252-ab4a-a9974c8557b2/oauth2/v2.0/authorize?' + 
            new URLSearchParams({
                client_id: '1b1ffb5b-8849-45d7-98c0-630b7d83c647',
                response_type: 'code',
                redirect_uri: `https://${window.location.host}`,
                scope: 'User.Read'
            }).toString(),
            '_blank',
            'width=600,height=600'
        );

        window.addEventListener('message', function authComplete(e) {
            if (e.data === 'auth_complete') {
                window.removeEventListener('message', authComplete);
                authWindow?.close();
                window.location.reload();
            }
        });
    };

    return (
        <Button onClick={handleLogin}>
            Sign in with Microsoft
        </Button>
    );
};

export default LoginButton;
