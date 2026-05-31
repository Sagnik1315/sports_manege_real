"use client";
import { useEffect, useState } from "react";
import { CoachLayout } from "@/components/layout/CoachLayout";
import { useAuthStore } from "@/store/authStore";
import { getCoachByUid, getAthletesByCoachId } from "@/firebase/database";
import { Trophy, Users, Star, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { CoachRecord, AthleteRecord } from "@/types";

export default function CoachDashboardPage() {
  const { user } = useAuthStore();
  const [coach, setCoach] = useState<CoachRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user?.uid) {
        const data = await getCoachByUid(user.uid);
        if (data) setCoach(data);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  if (loading) return <CoachLayout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></CoachLayout>;

  return (
    <CoachLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Coach Dashboard</h1>
            <p className="text-slate-500">Welcome back, Coach {coach?.personalDetails.fullName || user?.name}</p>
          </div>
          {!coach && (
            <Link href={ROUTES.COACH_REGISTER_WIZARD} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2">
              Complete Profile <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {coach ? (
          coach.status === "Approved" ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">My Athletes</p>
                    <p className="text-2xl font-black text-slate-900">{coach?.assignedAthletes?.length || 0}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Assigned Sport</p>
                    <p className="text-lg font-bold text-slate-900">{coach?.sportName || "None"}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                   <div className="h-12 w-12 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Experience</p>
                    <p className="text-lg font-bold text-slate-900">{coach?.clubInfo.experienceYears || 0} Years</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Recent Athletes</h2>
                  <Link href={ROUTES.COACH_ATHLETES} className="text-emerald-600 font-semibold text-sm hover:underline">View All</Link>
                </div>
                <div className="p-6">
                  {(coach?.assignedAthletes?.length || 0) > 0 ? (
                    <div className="flex flex-col items-center py-10 text-center">
                      <UserCheck className="h-12 w-12 text-slate-200 mb-4" />
                      <p className="text-slate-400 font-medium max-w-xs">You don&apos;t have any assigned athletes yet.</p>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No athletes assigned yet. Admin will assign athletes once reviewed.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Status View for Pending Coaches */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Application Status</p>
                    <StatusBadge status={coach.status} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Applied For</p>
                    <p className="text-lg font-bold text-slate-900">{coach.sportName}</p>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                    <Star className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase">Exp. Claimed</p>
                    <p className="text-lg font-bold text-slate-900">{coach.clubInfo.experienceYears} Years</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Trophy className="h-32 w-32" />
                </div>
                <div className="relative z-10 max-w-2xl">
                  <h3 className="text-2xl font-bold mb-4">Application Under Review</h3>
                  <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                    Thank you for applying to join our coaching staff! Our administrators are currently verifying 
                    your sports certification and experience credentials.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                       <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                       <span className="text-sm font-medium">Currently: Verifying Sports Certificate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
             <div className="h-20 w-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-10 w-10 text-emerald-600" />
             </div>
             <h2 className="text-2xl font-bold text-slate-900">Coach Profile Not Found</h2>
             <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-8">
               Complete your professional coaching profile to start managing your athletes and competitions.
             </p>
             <Link 
              href={ROUTES.COACH_REGISTER_WIZARD}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-100 inline-flex items-center gap-2"
            >
              Start Application <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </CoachLayout>
  );
}
