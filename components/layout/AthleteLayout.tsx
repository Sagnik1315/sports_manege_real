"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, LogOut } from "lucide-react";
import { signOut } from "@/firebase/auth";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";

export function AthleteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
    clearUser();
    document.cookie = "scm-auth-token=; Max-Age=0; path=/";
    document.cookie = "scm-user-role=; Max-Age=0; path=/";
    router.push(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href={ROUTES.ATHLETE_DASHBOARD} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">SCM Platform</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:block">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
