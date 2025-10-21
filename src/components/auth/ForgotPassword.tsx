import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ForgotPassword({
  onOtpSent,
  onClose,
}: {
  onOtpSent: () => void;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      // Replace with your real endpoint!
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not send OTP. Please try again.");
      } else {
        setSuccess("OTP sent to your email.");
        setTimeout(() => {
          onOtpSent();
        }, 1200); // Show success briefly before navigating away
      }
    } catch (err) {
      console.log(err);
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-lg font-semibold">Forgot Password</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleForgot} className="flex flex-col gap-4" autoComplete="off">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            disabled={loading}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          <Button type="submit" disabled={loading || !email}>
            {loading ? "Sending..." : "Send OTP"}
          </Button>
          <Button variant="link" type="button" onClick={onClose} disabled={loading}>
            &larr; Back to Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}