import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/authSlice";
import { AppDispatch } from "../redux/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import custom glass styles
import "../styles/glassStyles.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("eve.holt@reqres.in");
  const [password, setPassword] = useState("cityslicka");
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const result = await dispatch(login({ email, password }));

      if (login.fulfilled.match(result)) {
        navigate("/users");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.log(err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card border border-white/20 shadow-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-geist-mono text-center text-white">
            User Management Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert
                variant="destructive"
                className="bg-red-500/30 border border-red-500/50 text-white"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <label htmlFor="email" className="block mb-2 text-white/80">
                Email
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="glass-input text-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-white/80">
                Password
              </label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="glass-input text-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full glass-button-primary mt-6"
              disabled={!email || !password}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
