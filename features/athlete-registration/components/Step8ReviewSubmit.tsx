"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useRegistrationStore } from "@/store/registrationStore";
import { useAuthStore } from "@/store/authStore";
import { submitAthleteRegistration } from "../service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { cn, formatDate } from "@/lib/utils";

interface Props { onBack: () => void; }

export function Step8ReviewSubmit({ onBack }: Props) {
  const { formData, reset, athleteId, setSubmitting, submitting } = useRegistrationStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      // In a production app, we would use the authenticated user's UID
      // For this wizard, we'll assume the user is already logged in or we pass a dummy UID if not
      const finalData = {
        uid: user?.uid || "GUEST_USER",
        sportId: formData.sportId,
        sportName: formData.sportName,
        personalDetails: formData.personalDetails as any,
        guardianDetails: formData.guardianDetails as any,
        addressDetails: formData.addressDetails as any,
        clubDetails: formData.clubDetails as any,
        competitionDetails: formData.competitionDetails as any,
        documents: formData.documents as any,
      };

      await submitAthleteRegistration(finalData);
      toast.success("Application submitted successfully!");
      reset();
      router.push(ROUTES.ATHLETE_DASHBOARD);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const Section = ({ title, data }: { title: string; data: Record<string, any> }) => (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">{title}</h4>
      <dl className="grid grid-cols-2 gap-y-2 gap-x-4">
        {Object.entries(data).map(([key, val]) => {
          if (typeof val === 'object' || !val) return null;
          return (
            <div key={key}>
              <dt className="text-[10px] text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
              <dd className="text-sm font-medium text-slate-700 truncate">{val}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <div className="text-center px-4">
        <h3 className="text-xl font-bold text-slate-900">Review Your Application</h3>
        <p className="text-sm text-slate-500 mt-1">Please verify all details before final submission.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="Personal Details" data={formData.personalDetails} />
        <Section title="Guardian Details" data={formData.guardianDetails} />
        <Section title="Address" data={formData.addressDetails} />
        <Section title="Club / State" data={formData.clubDetails} />
        <Section title="Competition" data={formData.competitionDetails} />
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Sport & Documents</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-blue-600">{formData.sportName}</span>
              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Selected Sport</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(formData.documents).map(doc => (
                <span key={doc} className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> {doc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed font-medium">
          Once submitted, you cannot edit your application until it is reviewed by the administrator. 
          Please ensure all uploaded documents are legible.
        </p>
      </div>

      <div className="flex justify-between items-center pt-2">
        <button onClick={onBack} disabled={submitting} className="px-6 py-2.5 text-slate-600 font-medium hover:underline disabled:opacity-50">
          Wait, I need to fix something
        </button>
        <button 
          onClick={handleSubmit}
          disabled={submitting}
          className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-70"
        >
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </motion.div>
  );
}
