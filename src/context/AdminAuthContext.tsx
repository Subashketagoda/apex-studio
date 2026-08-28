"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

interface AdminAuthContextType {
  user: FirebaseUser | null;
  isPasscodeAuth: boolean;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithPasscode: (code: string) => { success: boolean; error?: string };
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isPasscodeAuth, setIsPasscodeAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage for passcode auth
    const saved = localStorage.getItem("apex_admin_auth");
    if (saved === "true") {
      setIsPasscodeAuth(true);
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      setUser(res.user);
      localStorage.setItem("apex_admin_auth", "true");
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Invalid Firebase administrator credentials.",
      };
    }
  };

  const loginWithPasscode = (code: string) => {
    if (code === "apexstudio2026" || code === "admin") {
      setIsPasscodeAuth(true);
      localStorage.setItem("apex_admin_auth", "true");
      return { success: true };
    }
    return { success: false, error: "Incorrect producer passcode. Try 'apexstudio2026'" };
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    localStorage.removeItem("apex_admin_auth");
    setIsPasscodeAuth(false);
    setUser(null);
  };

  const isAuthenticated = Boolean(user || isPasscodeAuth);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isPasscodeAuth,
        isAuthenticated,
        loading,
        loginWithEmail,
        loginWithPasscode,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
