"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";

interface User {
  id: string;
  email: string;
  name: string;
}

interface Session {
  user: User | null;
  session: any;
}

interface AuthContextType {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: session } = await authClient.getSession();
        setSession(session);
        setStatus(session ? "authenticated" : "unauthenticated");
      } catch (error) {
        console.error("Failed to get session:", error);
        setStatus("unauthenticated");
      }
    };
    
    getSession();
  }, []);

  return (
    <AuthContext.Provider value={{ session, status }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useBetterAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useBetterAuth must be used within a AuthProvider");
  }
  return context;
}