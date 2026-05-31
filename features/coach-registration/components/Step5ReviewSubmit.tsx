"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useCoachRegistrationStore } from "@/store/coachRegistrationStore";
import { useAuthStore } from "@/store/authStore";
import { submitCoachRegistration } from "../service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

interface Props { onBack: () => void; }

export function Step5ReviewSubmit({ onBack }: Props) {
  const { formData, reset, coachId, submitting, setSubmitting } = useCoachRegistrationStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const finalData = {
        uid: user?.uid || "GUEST_USER",
        sportId: formData.sportId,
        sportName: formData.sportName,
        personalDetails: formData.personalDetails as any,
        clubInfo: formData.clubInfo as any,
        documents: formData.documents as any,
      };
      await submitCoachRegistration(finalData);
      toast.success("Coach registration successful!");
      reset();
      router.push(ROUTES.COACH_DASHBOARD);
    } catch { toast.error("Failed to submit"); } finally { setSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase">Coach Info</p>
          <p className="text-sm font-semibold">{formData.personalDetails.fullName} • {formData.personalDetails.mobile}</p>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase">Sport & Club</p>
          <p className="text-sm font-semibold">{formData.sportName} • {formData.clubInfo.clubName} ({formData.clubInfo.experienceYears} Years Exp)</p>
        </div>
        <div className="flex gap-2">
          {Object.keys(formData.documents).map(d => (
            <span key={d} className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">✓ {d}</span>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button onClick={onBack} disabled={submitting} className="text-slate-500 text-sm hover:underline">Back to edit</button>
        <button onClick={handleSubmit} disabled={submitting} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg flex items-center gap-2">
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
          {submitting ? "Submitting..." : "Complete Registration"}
        </button>
      </div>
    </motion.div>
  );
}
