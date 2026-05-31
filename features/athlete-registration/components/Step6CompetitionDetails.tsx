"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRegistrationStore } from "@/store/registrationStore";
import { competitionDetailsSchema, type CompetitionDetailsFormData } from "@/validations/athlete";
import { AGE_GROUPS } from "@/constants";

interface Props { onNext: () => void; onBack: () => void; }

export function Step6CompetitionDetails({ onNext, onBack }: Props) {
  const { formData, setCompetitionDetails } = useRegistrationStore();
  const { register, handleSubmit, formState: { errors } } = useForm<CompetitionDetailsFormData>({
    resolver: zodResolver(competitionDetailsSchema),
    defaultValues: formData.competitionDetails as CompetitionDetailsFormData,
  });

  const onSubmit = (data: CompetitionDetailsFormData) => { setCompetitionDetails(data); onNext(); };

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const errorClass = "text-red-500 text-xs mt-0.5";

  return (
    <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Competition Applied *</label>
          <input {...register("competitionApplied")} placeholder="e.g. State Championship 2025" className={inputClass} />
          {errors.competitionApplied && <p className={errorClass}>{errors.competitionApplied.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Age Group *</label>
          <select {...register("ageGroup")} className={inputClass}>
            <option value="">Select age group</option>
            {AGE_GROUPS.map((ag) => <option key={ag} value={ag}>{ag}</option>)}
          </select>
          {errors.ageGroup && <p className={errorClass}>{errors.ageGroup.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Weight Category</label>
          <input {...register("weightCategory")} placeholder="e.g. 45–50 Kg" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <input {...register("category")} placeholder="e.g. Badminton Singles" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Preferred Event</label>
          <input {...register("preferredEvent")} placeholder="Optional" className={inputClass} />
        </div>
      </div>
      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="px-5 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">← Back</button>
        <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition">Next →</button>
      </div>
    </motion.form>
  );
}
