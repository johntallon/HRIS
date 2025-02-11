
import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
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
          <source src="https://www.steripack.com/wp-content/uploads/SteriPack-Cubes.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Login Section */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <Card className="w-full max-w-md mx-8">
          <CardHeader>
            <CardTitle className="text-center">HR Information System</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
