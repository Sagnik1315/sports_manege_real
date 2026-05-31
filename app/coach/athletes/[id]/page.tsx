"use client";
import { useEffect, useState, use } from "react";
import { CoachLayout } from "@/components/layout/CoachLayout";
import { getAthlete, updateAthleteStatus, addStatusHistory } from "@/firebase/database";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useAuthStore } from "@/store/authStore";
import {
  Trophy, User, MapPin, FileText, ArrowLeft,
  CheckCircle, XCircle, Mail, Phone, Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AthleteRecord, RegistrationStatus } from "@/types";

export default function CoachAthleteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuthStore();
  const [athlete, setAthlete] = useState<AthleteRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getAthlete(id);
      if (data) setAthlete(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleUpdateStatus = async (status: RegistrationStatus) => {
    if (!athlete) return;
    try {
      await updateAthleteStatus(athlete.athleteId, status);
      await addStatusHistory(athlete.athleteId, {
        previousStatus: athlete.status,
        currentStatus: status,
        updatedBy: user?.name || "Coach",
        timestamp: new Date().toISOString(),
        notes: `Status updated by Coach ${user?.name}.`,
      });
      setAthlete({ ...athlete, status });
      toast.success(`Athlete application ${status.toLowerCase()} successfully!`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <CoachLayout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></CoachLayout>;
  if (!athlete) return <CoachLayout><div className="text-center py-20 text-slate-500">Athlete not found.</div></CoachLayout>;

  return (
    <CoachLayout>
      <div className="space-y-6">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 transition font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to My Athletes
        </button>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-3xl font-black">
              {athlete.personalDetails.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">{athlete.personalDetails.fullName}</h1>
                <StatusBadge status={athlete.status} />
              </div>
              <div className="flex gap-4 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1"><Trophy className="h-3 w-3" /> {athlete.sportName}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {athlete.personalDetails.age} Years</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => handleUpdateStatus("Rejected")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition"
            >
              <XCircle className="h-4 w-4" /> Reject
            </button>
            <button
              onClick={() => handleUpdateStatus("Approved")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
            >
              <CheckCircle className="h-4 w-4" /> Approve
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h3 className="text-sm font-black uppercase text-slate-400 mb-6 tracking-widest border-b border-slate-50 pb-2">Athlete Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <InfoItem label="Full Name" value={athlete.personalDetails.fullName} icon={User} />
                <InfoItem label="Gender" value={athlete.personalDetails.gender} />
                <InfoItem label="Blood Group" value={athlete.personalDetails.bloodGroup || "N/A"} />
                <InfoItem label="Aadhaar" value={athlete.personalDetails.aadhaarNumber || "N/A"} />
                <InfoItem label="Email" value={athlete.personalDetails.email} icon={Mail} />
                <InfoItem label="Mobile" value={athlete.personalDetails.mobile} icon={Phone} />
                <InfoItem label="City" value={athlete.addressDetails.city} icon={MapPin} />
                <InfoItem label="District" value={athlete.addressDetails.district} />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h3 className="text-sm font-black uppercase text-slate-400 mb-6 tracking-widest border-b border-slate-50 pb-2">Submitted Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(athlete.documents).map(([key, doc]) => (
                  <a
                    key={key}
                    href={doc.storageUrl}
                    target="_blank"
                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 hover:border-emerald-200 transition-all group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-500 transition-all">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{key}</p>
                      <p className="text-xs font-bold text-slate-700">View File</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
              <h4 className="font-bold mb-4">Coach Review Note</h4>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                "As the assigned coach, your approval signifies that you have verified the athlete's physical attributes and sport-specific eligibility."
              </p>
            </div>
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}

function InfoItem({ label, value, icon: Icon }: any) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0"><Icon className="h-4 w-4 text-slate-400" /></div>}
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
