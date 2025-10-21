import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function OTP({
  email,
  onVerified,
  onClose,
}: {
  email: string;
  onVerified: () => void;
  onClose: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // Replace with your real endpoint!
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid OTP. Please try again.");
      } else {
        setSuccess("OTP verified! Redirecting...");
        setTimeout(() => {
          onVerified();
        }, 1200); // Show success briefly before navigating away
      }
    } catch (err) {
      console.log(err);
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");
    setResending(true);
    try {
      // Replace with your real endpoint!
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not resend OTP.");
      } else {
        setSuccess("OTP resent to your email.");
      }
    } catch (err) {
      console.log(err);
      setError("Network error. Please try again.");
    }
    setResending(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-lg font-semibold">Enter OTP</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleOtp} className="flex flex-col gap-4" autoComplete="off">
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
            maxLength={6}
            disabled={loading}
            autoFocus
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <Button type="submit" disabled={loading || !otp}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
          <Button
            variant="link"
            type="button"
            onClick={handleResendOtp}
            disabled={loading || resending}
          >
            {resending ? "Resending..." : "Resend OTP"}
          </Button>
          <Button
            variant="link"
            type="button"
            onClick={onClose}
            disabled={loading || resending}
          >
            &larr; Back to Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}