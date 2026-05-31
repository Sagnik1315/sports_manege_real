"use client";
import { useEffect, useState } from "react";
import { CoachLayout } from "@/components/layout/CoachLayout";
import { useAuthStore } from "@/store/authStore";
import { getAthletesByCoachId } from "@/firebase/database";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import Link from "next/link";
import type { AthleteRecord } from "@/types";

export default function CoachAthletesPage() {
  const { user } = useAuthStore();
  const [athletes, setAthletes] = useState<AthleteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (user?.uid) {
        // In RTDB, athletes are usually stored by their ID, but they may have a coachId field
        const data = await getAthletesByCoachId(user.uid);
        setAthletes(data);
      }
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <CoachLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">My Assigned Athletes</h1>
          <p className="text-slate-500 text-sm">Review and manage athletes assigned to you by the administrator.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><LoadingSpinner /></div>
        ) : athletes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {athletes.map(a => (
              <div key={a.athleteId} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-slate-900">{a.personalDetails.fullName}</h3>
                    <p className="text-xs text-slate-400">ID: {a.athleteId}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Age: <span className="text-slate-800">{a.personalDetails.age}</span></div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Sport: <span className="text-slate-800">{a.sportName}</span></div>
                </div>
                <Link 
                  href={`/coach/athletes/${a.athleteId}`}
                  className="w-full py-2 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 text-xs font-bold rounded-lg transition block text-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
            <p className="text-slate-400 font-medium">No athletes assigned yet.</p>
          </div>
        )}
      </div>
    </CoachLayout>
  );
}
