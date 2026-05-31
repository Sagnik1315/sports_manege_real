"use client";
import { AdminSidebar } from "@/components/navigation/AdminSidebar";
import { cn } from "@/lib/utils";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-screen-2xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
