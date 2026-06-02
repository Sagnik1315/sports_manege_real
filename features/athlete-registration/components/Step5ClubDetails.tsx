"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRegistrationStore } from "@/store/registrationStore";
import { clubDetailsSchema, type ClubDetailsFormData } from "@/validations/athlete";

interface Props { onNext: () => void; onBack: () => void; }

export function Step5ClubDetails({ onNext, onBack }: Props) {
  const { formData, setClubDetails } = useRegistrationStore();
  const { register, handleSubmit, formState: { errors } } = useForm<ClubDetailsFormData>({
    resolver: zodResolver(clubDetailsSchema),
    mode: "onBlur",
    defaultValues: formData.clubDetails as ClubDetailsFormData,
  });

  const onSubmit = (data: ClubDetailsFormData) => { setClubDetails(data); onNext(); };

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const errorClass = "text-red-500 text-xs mt-0.5";

  return (
    <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Club Name *</label>
          <input {...register("clubName")} placeholder="ABC Sports Club" className={inputClass} />
          {errors.clubName && <p className={errorClass}>{errors.clubName.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Coach Name *</label>
          <input {...register("coachName")} placeholder="Coach full name" className={inputClass} />
          {errors.coachName && <p className={errorClass}>{errors.coachName.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Coach ID</label>
          <input {...register("coachId")} placeholder="Optional" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>State Association *</label>
          <input {...register("stateAssociation")} placeholder="Maharashtra Cricket Association" className={inputClass} />
          {errors.stateAssociation && <p className={errorClass}>{errors.stateAssociation.message}</p>}
        </div>
        <div>
          <label className={labelClass}>District Association</label>
          <input {...register("districtAssociation")} placeholder="Optional" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Years of Experience</label>
          <input {...register("yearsOfExperience", { valueAsNumber: true })} type="number" min={0} placeholder="0" className={inputClass} />
        </div>
      </div>
      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="px-5 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">← Back</button>
        <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition">Next →</button>
      </div>
    </motion.form>
  );
}
