"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/auth";

export function Header({ user }: { user: User }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(" Logout error:", error);
    }
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Simple Orders App</h1>
          <p className="text-sm text-muted-foreground">Welcome, {user.name}</p>
        </div>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
    </header>
  );
}
