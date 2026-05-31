"use client";
import { useState, useEffect, use } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { getCoachByUid, updateCoachStatus } from "@/firebase/database";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { FileText, CheckCircle, XCircle, Trophy, User, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { CoachRecord, RegistrationStatus } from "@/types";

export default function AdminCoachDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [coach, setCoach] = useState<CoachRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // In this system, id is the coach's UID
      const data = await getCoachByUid(id);
      setCoach(data);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleUpdateStatus = async (status: RegistrationStatus) => {
    if (!coach) return;
    try {
      await updateCoachStatus(coach.coachId, status);
      setCoach({ ...coach, status });
      toast.success(`Coach application ${status.toLowerCase()} successfully!`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <AdminLayout><div className="py-20 flex justify-center"><LoadingSpinner /></div></AdminLayout>;
  if (!coach) return <AdminLayout><div className="py-20 text-center">Coach not found</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader title="Coach Application Review" subtitle={`Reviewing ${coach.personalDetails.fullName}'s credentials.`} />
          <div className="flex gap-3">
            <button
              onClick={() => handleUpdateStatus("Rejected")}
              className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition shadow-sm"
            >
              <XCircle className="h-4 w-4" /> Reject
            </button>
            <button
              onClick={() => handleUpdateStatus("Approved")}
              className="flex items-center gap-2 px-8 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
            >
              <CheckCircle className="h-4 w-4" /> Approve Coach
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Main Info */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-50">
                <div className="h-20 w-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-3xl">
                  {coach.personalDetails.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{coach.personalDetails.fullName}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <StatusBadge status={coach.status} />
                    <span className="text-slate-400 text-sm font-medium">Applied on {new Date(coach.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-8">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <Trophy className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Sport Specialization</p>
                    <p className="font-bold text-slate-800">{coach.sportName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Total Experience</p>
                    <p className="font-bold text-slate-800">{coach.clubInfo.experienceYears} Years</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Email Address</p>
                    <p className="font-bold text-slate-800">{coach.personalDetails.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Phone Number</p>
                    <p className="font-bold text-slate-800">{coach.personalDetails.mobile}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 px-2">Verification Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(coach.documents).map(([key, doc]) => (
                  <a
                    key={key}
                    href={doc.storageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter group-hover:text-emerald-400 transition-all">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-sm font-bold text-slate-700">View Document</p>
                      </div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <ArrowRight className="h-4 w-4 text-emerald-600" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <User className="h-32 w-32" />
              </div>
              <h4 className="text-xl font-bold mb-6">Review Checklist</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded bg-emerald-500/20 flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                  </div>
                  <p className="text-sm text-slate-300 italic">Verify Sports Certificate authenticity.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded bg-emerald-500/20 flex items-center justify-center mt-0.5">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                  </div>
                  <p className="text-sm text-slate-300 italic">Confirm Identity Proof matches Name.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded bg-white/5 flex items-center justify-center mt-0.5" />
                  <p className="text-sm text-slate-500">Check Years of Experience vs Details.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Quick Actions</h4>
              <div className="space-y-3">
                <button className="w-full py-2.5 text-xs font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition">Email Verification Link</button>
                <button className="w-full py-2.5 text-xs font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition">Request Resubmission</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Subcomponent or Icon if missing
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  );
}
