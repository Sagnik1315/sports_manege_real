"use client";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getDashboardStats, getAllAthletes } from "@/firebase/database";
import { Trophy, Users, UserCheck, Clock, FileText, ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { AthleteRecord } from "@/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recent, setRecent] = useState<AthleteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [s, athletes] = await Promise.all([getDashboardStats(), getAllAthletes()]);
      setStats(s);
      
      // Sort athletes by createdAt descending for recent list
      const sorted = [...athletes].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRecent(sorted.slice(0, 5));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></AdminLayout>;

  const chartData = [
    { name: "Cricket", value: stats?.cricketAthletes || 0, color: "#2563eb" },
    { name: "Football", value: stats?.footballAthletes || 0, color: "#10b981" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Overview</h1>
          <p className="text-slate-500">Real-time metrics and application status monitoring.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {[
            { label: "Total Athletes", val: stats?.totalAthletes || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Pending Review", val: stats?.pendingReviews || 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Approved", val: stats?.approved || 0, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Rejected", val: stats?.rejected || 0, icon: FileText, color: "text-rose-600", bg: "bg-rose-50" },
            { label: "Total Coaches", val: stats?.totalCoaches || 0, icon: Trophy, color: "text-indigo-600", bg: "bg-indigo-50" },
          ].map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", s.bg, s.color)}>
                <s.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.label}</p>
                <p className="text-2xl font-black text-slate-900">{s.val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-lg font-bold mb-6">Participation by Sport</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60}>
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Apps */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 overflow-hidden">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-bold">Recent Applications</h2>
               <Link href={ROUTES.ADMIN_ATHLETES} className="text-blue-600 text-xs font-bold hover:underline">View All</Link>
             </div>
             <div className="space-y-4">
               {recent.length > 0 ? recent.map(r => (
                 <div key={r.athleteId} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold uppercase text-xs">
                        {r.personalDetails.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{r.personalDetails.fullName}</p>
                        <p className="text-[10px] text-slate-400">{r.sportName}</p>
                      </div>
                    </div>
                    <StatusBadge status={r.status} className="text-[10px] px-1.5 py-0.5" />
                 </div>
               )) : (
                 <div className="py-20 text-center text-slate-400 text-sm">No recent applications</div>
               )}
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
