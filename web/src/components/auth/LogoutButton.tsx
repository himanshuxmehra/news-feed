"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";
import { API_URL } from "@/lib/constants";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const clearAuth = useAuth((state) => state.clearAuth);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      // Clear auth state from Zustand
      clearAuth();

      toast({
        title: "Success",
        description: "Logged out successfully",
      });

      // Redirect to login page
      router.push("/auth");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
