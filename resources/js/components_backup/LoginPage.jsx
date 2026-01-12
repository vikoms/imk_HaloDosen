import React, { useState } from "react";
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import { Label } from "./ui/label.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card.jsx";
import { Alert, AlertDescription } from "./ui/alert.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.jsx";
import { LogIn, User, Lock, AlertCircle } from "lucide-react";

export function LoginPage({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("student");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    setTimeout(() => {
      if (!userId || !password) {
        setError("Please enter both username/ID and password");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Invalid credentials. Please try again.");
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onLogin(activeTab);
    }, 1000);
  };

  const handleForgotPassword = () => {
    alert("Password recovery link has been sent to your registered email.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center">
              <LogIn className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)} className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="lecturer">Lecturer</TabsTrigger>
            <TabsTrigger value="head">Head</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 px-0">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="userId-student">Username / Student ID / National ID</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="userId-student"
                      type="text"
                      placeholder="Enter your ID"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-student">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password-student"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 px-0">
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login as Student"}
                </Button>
                
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="lecturer">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 px-0">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="userId-lecturer">Lecturer ID / NIDN</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="userId-lecturer"
                      type="text"
                      placeholder="Enter your NIDN"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-lecturer">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password-lecturer"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 px-0">
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login as Lecturer"}
                </Button>
                
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="head">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 px-0">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="userId-head">Admin ID / Staff ID</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="userId-head"
                      type="text"
                      placeholder="Enter your Admin ID"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-head">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password-head"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 px-0">
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login as Head"}
                </Button>
                
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
