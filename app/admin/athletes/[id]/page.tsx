"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  getAthlete, getStatusHistory,
  updateAthleteStatus, addStatusHistory
} from "@/firebase/database";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useAuthStore } from "@/store/authStore";
import {
  Trophy, User, Users, MapPin, School, FileText,
  History, ArrowLeft, ExternalLink, Mail, Phone, Calendar,
  CheckCircle, XCircle, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import type { AthleteRecord, StatusHistoryEntry, RegistrationStatus } from "@/types";

export default function AdminAthleteProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [athlete, setAthlete] = useState<AthleteRecord | null>(null);
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    async function load() {
      if (typeof id === "string") {
        const [a, h] = await Promise.all([getAthlete(id), getStatusHistory(id)]);
        if (a) setAthlete(a);
        setHistory(h || []);
      }
      setLoading(false);
    }
    load();
  }, [id]);

 const handleUpdateStatus = async (
  status: RegistrationStatus
) => {
  if (!athlete) return;

  try {
    await updateAthleteStatus(
      athlete.athleteId,
      status
    );

    await addStatusHistory(
      athlete.athleteId,
      {
        previousStatus: athlete.status,
        currentStatus: status,
        updatedBy: user?.name || "Admin",
        timestamp: new Date().toISOString(),
        notes: `Status updated to ${status} by Admin.`,
      }
    );

    // Send email
    await fetch("/api/send-status-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: athlete.personalDetails.email,
        athleteName:
          athlete.personalDetails.fullName,
        status,
      }),
    });

    setAthlete({
      ...athlete,
      status,
    });

    toast.success(
      `Athlete ${status.toLowerCase()} successfully!`
    );
  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to update athlete status"
    );
  }
};

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><LoadingSpinner /></div></AdminLayout>;
  if (!athlete) return <AdminLayout><div className="text-center py-20 text-slate-500">Athlete not found.</div></AdminLayout>;

  const Tab = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all",
        activeTab === id ? "border-blue-600 text-blue-600 bg-blue-50/30" : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition group font-medium">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to List
        </button>

        {/* Header Profile */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-600 text-4xl font-black">
              {athlete.personalDetails.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-slate-900">{athlete.personalDetails.fullName}</h1>
                <StatusBadge status={athlete.status} />
              </div>
              <p className="text-slate-400 text-sm font-medium mb-3">Registration ID: <span className="font-mono">{athlete.athleteId}</span></p>
              <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                  <Trophy className="h-3 w-3" /> {athlete.sportName}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                  <Calendar className="h-3 w-3" /> Age: {athlete.personalDetails.age}
                </span>
                <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                  <MapPin className="h-3 w-3" /> {athlete.addressDetails.city}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => handleUpdateStatus("Rejected")}
              className="flex items-center gap-2 px-6 py-2.5 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition shadow-sm"
            >
              <XCircle className="h-4 w-4" /> Reject
            </button>
            <button
              onClick={() => handleUpdateStatus("Approved")}
              className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
            >
              <CheckCircle className="h-4 w-4" /> Approve Athlete
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
          <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
            <Tab id="personal" label="Full Details" icon={User} />
            <Tab id="documents" label="Documents" icon={FileText} />
            <Tab id="history" label="Status History" icon={History} />
          </div>

          <div className="p-8">
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <section>
                  <h3 className="text-xs font-black uppercase text-blue-600 mb-4 tracking-widest">Personal Info</h3>
                  <div className="space-y-4">
                    <DataRow label="Gender" val={athlete.personalDetails.gender} />
                    <DataRow label="Blood Group" val={athlete.personalDetails.bloodGroup} />
                    <DataRow label="Mobile" val={athlete.personalDetails.mobile} icon={Phone} />
                    <DataRow label="Email" val={athlete.personalDetails.email} icon={Mail} />
                    <DataRow label="Aadhaar" val={athlete.personalDetails.aadhaarNumber || "N/A"} />
                  </div>
                </section>
                <section>
                  <h3 className="text-xs font-black uppercase text-emerald-600 mb-4 tracking-widest">Guardian Details</h3>
                  <div className="space-y-4">
                    <DataRow label="Father" val={athlete.guardianDetails.fatherName} />
                    <DataRow label="Mother" val={athlete.guardianDetails.motherName} />
                    <DataRow label="G. Mobile" val={athlete.guardianDetails.guardianMobile} />
                  </div>
                </section>
                <section>
                  <h3 className="text-xs font-black uppercase text-indigo-600 mb-4 tracking-widest">Sport / Club</h3>
                  <div className="space-y-4">
                    <DataRow label="Club Name" val={athlete.clubDetails.clubName} icon={School} />
                    <DataRow label="Coach" val={athlete.clubDetails.coachName} />
                    <DataRow label="Assoc." val={athlete.clubDetails.stateAssociation} />
                  </div>
                </section>
                <section>
                  <h3 className="text-xs font-black uppercase text-violet-600 mb-4 tracking-widest">Address</h3>
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      {athlete.addressDetails.addressLine1},<br />
                      {athlete.addressDetails.addressLine2 && <>{athlete.addressDetails.addressLine2},<br /></>}
                      {athlete.addressDetails.city}, {athlete.addressDetails.district},<br />
                      {athlete.addressDetails.state} - {athlete.addressDetails.pincode}
                    </p>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "documents" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in-95 duration-300">
                {Object.entries(athlete.documents).map(([key, doc]) => (
                  <div key={key} className="p-5 border border-slate-200 rounded-2xl flex items-center justify-between hover:border-blue-500 hover:shadow-md transition group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400">{key}</p>
                        <p className="text-xs font-medium text-slate-700 truncate max-w-[120px]">{doc.fileName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          try {
                            const resp = await fetch('/api/admin/download', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ athleteId: athlete.athleteId, docKey: key }),
                            });
                            if (!resp.ok) {
                              const err = await resp.json().catch(() => ({ message: 'Download failed' }));
                              toast.error(err.message || 'Unauthorized or file not found');
                              return;
                            }
                            const json = await resp.json();
                            const url = json.url || json.storageUrl;
                            if (!url) {
                              toast.error('File URL not available');
                              return;
                            }
                            window.open(url, '_blank');
                          } catch (e) {
                            console.error(e);
                            toast.error('Failed to download document');
                          }
                        }}
                        className="p-2 bg-white rounded-md border text-slate-600 hover:bg-slate-50"
                      >
                        <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                {history.length > 0 ? history.map((entry, i) => (
                  <div key={i} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[1px] before:bg-slate-200 last:before:hidden">
                    <div className={cn("absolute left-[-4px] top-1 h-2 w-2 rounded-full border-2 border-white", i === 0 ? "bg-blue-600 scale-125" : "bg-slate-300")} />
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={entry.currentStatus} className="text-[10px] px-1.5 py-0.5" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase">from {entry.previousStatus}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{formatDate(entry.timestamp)}</span>
                      </div>
                      <p className="text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-50">{entry.notes}</p>
                      <p className="text-[10px] mt-2 text-slate-400 italic">Updated by: {entry.updatedBy}</p>
                    </div>
                  </div>
                )) : <div className="text-center py-20 text-slate-400 text-sm">No status history found.</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function DataRow({ label, val, icon: Icon }: any) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-400 font-medium">{label}:</span>
      <span className="text-slate-900 font-bold flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-blue-400" />} {val}
      </span>
    </div>
  );
}
