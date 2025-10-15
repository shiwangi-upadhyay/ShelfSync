"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ForgotPassword from "../auth/ForgotPassword";
import OTP from "../auth/OTP";
import ResetPassword from "../auth/ResetPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const [showForgot, setShowForgot] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Invalid credentials");
      } else {
        // Optionally store JWT/token here (localStorage/cookie)
        // localStorage.setItem("token", data.token);
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <h2 className="text-lg font-semibold">Login</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit">Sign In</Button>
            <div className="flex justify-between mt-2 text-sm">
              <Button
                variant="link"
                type="button"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </Button>
              <Link href="/signup" className="underline">
                Sign Up
              </Link>
            </div>
          </form>
          {/* Conditionally rendered components */}
          {showForgot && (
            <ForgotPassword
              onOtpSent={() => {
                setShowForgot(false);
                setShowOtp(true);
              }}
              onClose={() => setShowForgot(false)}
            />
          )}
          {showOtp && (
            <OTP
              onVerified={() => {
                setShowOtp(false);
                setShowReset(true);
              }}
              onClose={() => setShowOtp(false)}
            />
          )}
          {showReset && (
            <ResetPassword
              onReset={() => setShowReset(false)}
              onClose={() => setShowReset(false)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}