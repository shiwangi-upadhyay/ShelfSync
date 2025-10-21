import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";

export function useCurrentUser() {
  const [user, setUser] = useState<{ _id: string; name?: string; email?: string; role?: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await apiFetch("/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data); // data._id is now present
      }
    }
    fetchUser();
  }, []);

  return user;
}