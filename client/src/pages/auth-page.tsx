import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 bg-white">
        <video className="w-full h-full object-cover" autoPlay muted playsInline>
          <source
            src="https://www.steripack.com/wp-content/uploads/SteriPack-Cubes.webm"
            type="video/webm"
          />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="flex-1 flex items-center justify-center bg-white">
        <Card className="w-full max-w-md mx-8">
          <CardHeader>
            <CardTitle className="text-center">HR Information System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">
              Please log in using your organizational account.
            </p>
            <Button onClick={handleLogin} className="w-full">
              Login with Entra ID
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}