// src/pages/auth-page.tsx

import React, { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function AuthPage() {
  const { instance, accounts } = useMsal();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (accounts.length > 0) {
      // If the user is already logged in, redirect to the home page
      navigate("/");
    }
  }, [accounts, navigate]);

  const handleLogin = () => {
    instance
      .loginRedirect(loginRequest)
      .catch((e) => {
        console.error("Login Redirect Error: ", e);
      });
  };

  return (
    <div className="min-h-screen flex">
      {/* Video Section */}
      <div className="flex-1 bg-white">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        >
          <source
            src="https://www.steripack.com/wp-content/uploads/SteriPack-Cubes.webm"
            type="video/webm"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Login Section */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <Card className="w-full max-w-md mx-8">
          <CardHeader>
            <CardTitle className="text-center">HR Information System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">Please log in using your organizational account.</p>
            <Button onClick={handleLogin} className="w-full">
              Login with Entra ID
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
