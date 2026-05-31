"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, UserCheck, LogOut, Settings,
  Trophy, TrendingUp, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { signOut } from "@/firebase/auth";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";

const navItems = [
  { href: ROUTES.ADMIN_DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.ADMIN_ATHLETES, label: "Athletes", icon: Users },
  { href: ROUTES.ADMIN_COACHES, label: "Coaches", icon: UserCheck },
  { href: ROUTES.ADMIN_SETTINGS, label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await signOut();
      clearUser();
      document.cookie = "scm-auth-token=; Max-Age=0; path=/";
      document.cookie = "scm-user-role=; Max-Age=0; path=/";
      router.push(ROUTES.LOGIN);
    } catch {
      toast.error("Failed to log out");
    }
  };

  return (
    <aside className="flex flex-col h-full w-[var(--sidebar-width)] bg-slate-900 text-white overflow-hidden">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-sm leading-none">SCM Platform</p>
          <p className="text-xs text-slate-400 mt-0.5">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="h-3 w-3 ml-auto" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium truncate">{user?.name ?? "Admin"}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
