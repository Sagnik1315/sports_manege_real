"use client";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAuthStore } from "@/store/authStore";
import { User, Mail, Shield, Settings } from "lucide-react";

export default function AdminProfilePage() {
  const { user } = useAuthStore();

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-8">System Profile</h1>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-32 bg-slate-900" />
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-6 text-center">
              <div className="inline-flex h-24 w-24 rounded-2xl bg-white border-4 border-white flex items-center justify-center overflow-hidden shadow-lg shadow-slate-200">
                <Shield className="h-12 w-12 text-slate-800" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-white">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Name</p>
                  <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-white">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-sm border border-slate-100">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Admin Email</p>
                  <p className="text-sm font-semibold text-slate-700">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-white">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Permissions</p>
                  <p className="text-sm font-bold text-blue-600 uppercase">System Owner (Phase 1)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
