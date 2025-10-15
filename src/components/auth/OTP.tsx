import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function OTP({ onVerified, onClose }: { onVerified: () => void; onClose: () => void }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: API call to verify OTP
    // if success:
    onVerified();
    // if error: setError("Invalid OTP");
    setLoading(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-lg font-semibold">Enter OTP</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleOtp} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</Button>
          <Button variant="link" type="button" onClick={onClose}>Resend OTP</Button>
        </form>
      </CardContent>
    </Card>
  );
}