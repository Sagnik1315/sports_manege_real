"use client";
import { CoachLayout } from "@/components/layout/CoachLayout";
import { useAuthStore } from "@/store/authStore";
import { User, Mail, School, Clipboard } from "lucide-react";

export default function CoachProfilePage() {
  const { user } = useAuthStore();

  return (
    <CoachLayout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-8">Coach Profile</h1>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-800" />
          <div className="px-8 pb-8">
            <div className="relative -mt-12 mb-6">
              <div className="h-24 w-24 rounded-2xl bg-slate-100 border-4 border-white flex items-center justify-center overflow-hidden shadow-sm">
                <User className="h-12 w-12 text-slate-300" />
              </div>
            </div>
            
            <div className="space-y-4">
               {[
                 { icon: User, label: "Full Name", val: user?.name },
                 { icon: Mail, label: "Email Address", val: user?.email },
                 { icon: Clipboard, label: "Role", val: "Registered Coach" },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-white">
                   <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                     <item.icon className="h-5 w-5" />
                   </div>
                   <div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.label}</p>
                     <p className="text-sm font-semibold text-slate-700">{item.val}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}
