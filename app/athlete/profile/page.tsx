"use client";
import { AthleteLayout } from "@/components/layout/AthleteLayout";
import { useAuthStore } from "@/store/authStore";
import { User, Mail, Shield } from "lucide-react";

export default function AthleteProfilePage() {
  const { user } = useAuthStore();

  return (
    <AthleteLayout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-8">My Profile</h1>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-800" />
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-6">
              <div className="h-24 w-24 rounded-2xl bg-slate-100 border-4 border-white flex items-center justify-center overflow-hidden">
                <User className="h-12 w-12 text-slate-300" />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</p>
                  <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-semibold text-slate-700">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Type</p>
                  <p className="text-sm font-semibold text-slate-700 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AthleteLayout>
  );
}
