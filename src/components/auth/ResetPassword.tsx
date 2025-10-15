import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function ResetPassword({ onReset, onClose }: { onReset: () => void; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    // TODO: API call to reset password
    // if success:
    onReset();
    setLoading(false);
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <h2 className="text-lg font-semibold">Reset Password</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <Input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</Button>
          <Button variant="link" type="button" onClick={onClose}>Back to Login</Button>
        </form>
      </CardContent>
    </Card>
  );
}