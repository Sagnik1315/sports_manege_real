"use client";
import { useEffect, useState } from "react";
import { AthleteLayout } from "@/components/layout/AthleteLayout";
import { useAuthStore } from "@/store/authStore";
import { getAthleteByUid } from "@/firebase/database";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Trophy, Calendar, MapPin, FileText, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import type { AthleteRecord } from "@/types";

export default function AthleteDashboardPage() {
  const { user } = useAuthStore();
  const [athlete, setAthlete] = useState<AthleteRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (user?.uid) {
        const data = await getAthleteByUid(user.uid);
        if (data) setAthlete(data);
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  if (loading) return <AthleteLayout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></AthleteLayout>;

  return (
    <AthleteLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {user?.name}!</h1>
            <p className="text-slate-500">Track and manage your sports club application.</p>
          </div>
          {!athlete && (
            <Link 
              href={ROUTES.ATHLETE_REGISTER_WIZARD}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center gap-2 transition-all w-fit"
            >
              Start Registration <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {athlete ? (
          <div className="space-y-8">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Applied Sport</p>
                  <p className="text-xl font-black text-slate-900">{athlete.sportName}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <UserCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Application Status</p>
                  <StatusBadge status={athlete.status} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Age Group</p>
                  <p className="text-lg font-bold text-slate-900">{athlete.competitionDetails.ageGroup}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Details Section */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-50">
                    <h2 className="text-lg font-bold">Application Details</h2>
                  </div>
                  <div className="p-8 grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-4">
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase mb-1">Coach Name</p>
                      <p className="text-sm font-bold text-slate-900">{athlete.clubDetails.coachName || "Not Assigned"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase mb-1">Club/Academy</p>
                      <p className="text-sm font-bold text-slate-900">{athlete.clubDetails.clubName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase mb-1">Competition</p>
                      <p className="text-sm font-bold text-slate-900">{athlete.competitionDetails.competitionApplied}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase mb-1">Category</p>
                      <p className="text-sm font-bold text-slate-900">{athlete.competitionDetails.category || "General"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase mb-1">Weight Category</p>
                      <p className="text-sm font-bold text-slate-900">{athlete.competitionDetails.weightCategory || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase mb-1">Applied Date</p>
                      <p className="text-sm font-bold text-slate-900">{new Date(athlete.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Documents section */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                   <h2 className="text-lg font-bold mb-4">Submitted Documents</h2>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {Object.entries(athlete.documents).map(([key, doc]) => (
                       <div key={key} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center group cursor-pointer hover:border-blue-200 transition-all">
                         <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <FileText className="h-5 w-5 text-blue-500" />
                         </div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter truncate">{key}</p>
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                 <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Trophy className="h-24 w-24" />
                   </div>
                   <h3 className="text-xl font-bold mb-4 relative z-10">Next Steps</h3>
                   <div className="space-y-4 relative z-10">
                     <div className="flex items-start gap-3">
                       <div className="h-6 w-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono">1</div>
                       <p className="text-sm text-slate-300">Admin reviews your documents and details.</p>
                     </div>
                     <div className="flex items-start gap-3">
                       <div className="h-6 w-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center shrink-0 text-xs font-bold font-mono">2</div>
                       <p className="text-sm text-slate-500">Upon approval, you get access to schedules.</p>
                     </div>
                   </div>
                   <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-xs text-slate-400 mb-1">Current Task</p>
                      <p className="text-sm font-bold flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                        {athlete.status} 
                      </p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
             <div className="h-20 w-20 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-10 w-10 text-blue-600" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900">No Application Found</h2>
             <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-8">
               It looks like you haven&apos;t started your sports club registration yet. Start now to join our competition!
             </p>
             <Link 
              href={ROUTES.ATHLETE_REGISTER_WIZARD}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-100"
            >
              Apply Now
            </Link>
          </div>
        )}
      </div>
    </AthleteLayout>
  );
}
