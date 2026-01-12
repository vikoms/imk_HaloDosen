import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { User, Lock, AlertCircle } from "lucide-react";
import type { UserRole } from "../App";
import axios from "axios";

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
        const response = await axios.post('/api/login', {
            email,
            password
        });
        
        const { user, token } = response.data.data;
        
        // Store token (normally you'd use a more secure storage or httpOnly cookie via Sanctum stateful)
        // For this implementation we will set the default header
        (window as any).axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('auth_token', token);

        onLogin(user.role as UserRole);

    } catch (err: any) {
        if (err.response && err.response.data && err.response.data.message) {
            setError(err.response.data.message);
        } else {
            setError("Login failed. Please check your connection.");
        }
    } finally {
        setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert("Password recovery link has been sent to your registered email.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-20 w-20 flex items-center justify-center">
              <img 
                src="/images/logo.png" 
                alt="HaloDosen Logo" 
                className="h-full w-full object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold text-indigo-900">HaloDosen</CardTitle>
          <CardDescription className="text-center">
            Sistem Informasi Pengajuan Dosen Pembimbing
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 px-6">
            {error && (
                <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                    required
                />
                </div>
            </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
            <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 mt-3"
                disabled={isLoading}
            >
                {isLoading ? "Logging in..." : "Login"}
            </Button>
            
            <button
                type="button"
                onClick={handleForgotPassword}
                className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors text-sm"
            >
                Forgot Password?
            </button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
