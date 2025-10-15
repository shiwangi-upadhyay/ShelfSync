import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
// You may need to implement your own Modal component, or use a library like Radix UI or shadcn/ui's dialog.

type AuthStep = "login" | "signup" | "forgot" | "otp" | "reset";

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<AuthStep>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  // Replace these with API calls to your backend
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to login
    // If success, close modal or redirect
    // If error, setError("Invalid credentials");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to register
    // If success, setStep("login")
    // If error, setError("Signup failed");
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to send OTP to email
    setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API call to verify OTP
    setStep("reset");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // TODO: API call to reset password
    setStep("login");
  };

  return (
    open ? (
      // Replace with your modal/dialog implementation
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <h2 className="text-lg font-semibold">
              {step === "login" && "Login"}
              {step === "signup" && "Sign Up"}
              {step === "forgot" && "Forgot Password"}
              {step === "otp" && "Enter OTP"}
              {step === "reset" && "Reset Password"}
            </h2>
          </CardHeader>
          <CardContent>
            {step === "login" && (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button type="submit">Sign In</Button>
                <div className="flex justify-between mt-2 text-sm">
                  <Button variant="link" type="button" onClick={() => setStep("forgot")}>Forgot Password?</Button>
                  <Button variant="link" type="button" onClick={() => setStep("signup")}>Sign Up</Button>
                </div>
              </form>
            )}
            {step === "signup" && (
              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <Input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button type="submit">Sign Up</Button>
                <div className="mt-2 text-sm text-center">
                  <Button variant="link" type="button" onClick={() => setStep("login")}>Already have an account?</Button>
                </div>
              </form>
            )}
            {step === "forgot" && (
              <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
                <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button type="submit">Send OTP</Button>
                <div className="mt-2 text-sm text-center">
                  <Button variant="link" type="button" onClick={() => setStep("login")}>Back to Login</Button>
                </div>
              </form>
            )}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <Input type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} required />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button type="submit">Verify OTP</Button>
                <div className="mt-2 text-sm text-center">
                  <Button variant="link" type="button" onClick={() => setStep("forgot")}>Resend OTP</Button>
                </div>
              </form>
            )}
            {step === "reset" && (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <Input type="password" placeholder="New Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <Input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <Button type="submit">Reset Password</Button>
                <div className="mt-2 text-sm text-center">
                  <Button variant="link" type="button" onClick={() => setStep("login")}>Back to Login</Button>
                </div>
              </form>
            )}
          </CardContent>
          <Button variant="ghost" className="absolute top-2 right-2" onClick={onClose}>×</Button>
        </Card>
      </div>
    ) : null
  );
}