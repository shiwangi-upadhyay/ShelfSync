import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/me")
      .then(res => res.ok ? res.json() : null)
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}