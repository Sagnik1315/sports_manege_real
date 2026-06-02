"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useCoachRegistrationStore } from "@/store/coachRegistrationStore";
import { coachClubInfoSchema, type CoachClubInfoFormData } from "@/validations/coach";

interface Props { onNext: () => void; onBack: () => void; }

export function Step3ClubInfo({ onNext, onBack }: Props) {
  const { formData, setClubInfo } = useCoachRegistrationStore();
  const { register, handleSubmit, formState: { errors } } = useForm<CoachClubInfoFormData>({
    resolver: zodResolver(coachClubInfoSchema),
    mode: "onBlur",
    defaultValues: formData.clubInfo as CoachClubInfoFormData,
  });

  const onSubmit = (data: CoachClubInfoFormData) => { setClubInfo(data); onNext(); };

  return (
    <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Club/Academy Name *</label>
        <input {...register("clubName")} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
        {errors.clubName && <p className="text-red-500 text-xs mt-1">{errors.clubName.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Years of Coaching Experience *</label>
        <input {...register("experienceYears", { valueAsNumber: true })} type="number" min={0} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
        {errors.experienceYears && <p className="text-red-500 text-xs mt-1">{errors.experienceYears.message}</p>}
      </div>
      <div className="flex justify-between pt-4">
        <button type="button" onClick={onBack} className="px-5 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50">← Back</button>
        <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-50 text-white font-medium rounded-lg transition">Next →</button>
      </div>
    </motion.form>
  );
}
