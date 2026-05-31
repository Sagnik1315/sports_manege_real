"use client";
import { useEffect } from "react";
import { subscribeToAuth } from "@/firebase/auth";
import { getUserRecord } from "@/firebase/database";
import { useAuthStore } from "@/store/authStore";
import type { AuthUser } from "@/types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setLoading, clearUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = subscribeToAuth(async (firebaseUser) => {
      if (!firebaseUser) {
        clearUser();
        return;
      }
      try {

        await firebaseUser.reload();

if (!firebaseUser.emailVerified) {
  clearUser();
  return;
}
        const record = await getUserRecord(firebaseUser.uid);
        if (record) {
          const authUser: AuthUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? "",
            role: record.role,
            name: record.name,
            createdAt: record.createdAt,
          };
          setUser(authUser);
        } else {
          clearUser();
        }
      } catch {
        clearUser();
      }
    });
    return () => unsubscribe();
  }, [setUser, clearUser]);

  return <>{children}</>;
}
