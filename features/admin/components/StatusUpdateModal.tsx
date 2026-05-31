"use client";
import { useState } from "react";
import { updateAthleteStatus, addStatusHistory } from "@/firebase/database";
import { REGISTRATION_STATUSES } from "@/constants";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { RegistrationStatus } from "@/types";

interface Props {
  athleteId: string;
  currentStatus: RegistrationStatus;
  updatedBy: string;
  onSuccess?: () => void;
}

export function StatusUpdateModal({ athleteId, currentStatus, updatedBy, onSuccess }: Props) {
  const [status, setStatus] = useState<RegistrationStatus>(currentStatus);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateAthleteStatus(athleteId, status);
      await addStatusHistory(athleteId, {
        previousStatus: currentStatus,
        currentStatus: status,
        updatedBy,
        timestamp: new Date().toISOString(),
        notes: notes || "Status updated by administrator.",
      });
      toast.success("Status updated successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-1">
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block tracking-widest">Update Status</label>
        <select 
          value={status} 
          onChange={e => setStatus(e.target.value as RegistrationStatus)}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500"
        >
          {REGISTRATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-400 uppercase mb-1.5 block tracking-widest">Remarks</label>
        <textarea 
          placeholder="Add reason for status change (optional)..." 
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm h-24 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button 
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <LoadingSpinner size="sm" />}
        Update Application
      </button>
    </div>
  );
}
