"use client";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getAllCoaches } from "@/firebase/database";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Search, UserPlus, Trophy } from "lucide-react";
import Link from "next/link";
import type { CoachRecord } from "@/types";

export default function AdminCoachesPage() {
  const [data, setData] = useState<CoachRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const coaches = await getAllCoaches();
      setData(coaches);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = data.filter(c => 
    c.personalDetails.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.sportName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader title="Coach Management" subtitle="Manage registered coaches and their visibility." />
        </div>

        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
           <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
             <input 
               value={search}
               onChange={e => setSearch(e.target.value)}
               placeholder="Search coaches..." 
               className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
             />
           </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><LoadingSpinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(coach => (
              <div key={coach.coachId} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                    {coach.personalDetails.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition">{coach.personalDetails.fullName}</h3>
                    <p className="text-xs text-slate-400">ID: {coach.coachId}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                   <div className="flex justify-between text-xs font-medium">
                     <span className="text-slate-400">Sport:</span>
                     <span className="text-slate-800">{coach.sportName}</span>
                   </div>
                   <div className="flex justify-between text-xs font-medium">
                     <span className="text-slate-400">Coaching Experience:</span>
                     <span className="text-slate-800">{coach.clubInfo.experienceYears} Years</span>
                   </div>
                   <div className="flex justify-between text-xs font-medium">
                     <span className="text-slate-400">Athletes Assigned:</span>
                     <span className="text-slate-800">{coach.assignedAthletes?.length || 0}</span>
                   </div>
                </div>
                <Link 
                  href={`/admin/coaches/${coach.uid}`}
                  className="w-full py-2.5 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 text-xs font-bold rounded-xl transition-all block text-center"
                >
                  Manage Coach
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
