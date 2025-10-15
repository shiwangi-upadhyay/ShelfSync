import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ForgotPassword({ onOtpSent, onClose }: { onOtpSent: () => void; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: API call to send OTP to email
    // if success:
    onOtpSent();
    // if error: setError("Could not send OTP");
    setLoading(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-lg font-semibold">Forgot Password</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleForgot} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" disabled={loading}>{loading ? "Sending..." : "Send OTP"}</Button>
          <Button variant="link" type="button" onClick={onClose}>Back to Login</Button>
        </form>
      </CardContent>
    </Card>
  );
}