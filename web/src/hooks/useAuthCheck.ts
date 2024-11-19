import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export function useAuthCheck() {
  const router = useRouter();
  const token = useAuth((state) => state.token);
  useEffect(() => {
    token ? console.log("redirecting") : router.push("/auth");
    if (!token) {
      router.push("/auth");
    }
  }, [token, router]);

  return !!token;
}
