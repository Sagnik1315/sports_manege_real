"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Trophy, Users, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/firebase/auth";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/constants/routes";

const navItems = [
  { href: ROUTES.COACH_DASHBOARD, label: "Dashboard", icon: Trophy },
  { href: ROUTES.COACH_ATHLETES, label: "My Athletes", icon: Users },
  { href: ROUTES.COACH_PROFILE, label: "Profile", icon: User },
];

export function CoachLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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
          <Link href={ROUTES.COACH_DASHBOARD} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Trophy className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900">SCM Platform</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname.startsWith(href)
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
