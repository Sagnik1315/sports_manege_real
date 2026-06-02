"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useCoachRegistrationStore } from "@/store/coachRegistrationStore";
import { coachPersonalDetailsSchema, type CoachPersonalDetailsFormData } from "@/validations/coach";

interface Props { onNext: () => void; }

export function Step1PersonalDetails({ onNext }: Props) {
  const { formData, setPersonalDetails } = useCoachRegistrationStore();
  const { register, handleSubmit, formState: { errors } } = useForm<CoachPersonalDetailsFormData>({
    resolver: zodResolver(coachPersonalDetailsSchema),
    mode: "onBlur",
    defaultValues: formData.personalDetails as CoachPersonalDetailsFormData,
  });

  const onSubmit = (data: CoachPersonalDetailsFormData) => { setPersonalDetails(data); onNext(); };

  return (
    <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
        <input {...register("fullName")} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Mobile *</label>
        <input {...register("mobile")} type="tel" maxLength={10} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
        {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
        <input {...register("email")} type="email" placeholder="name@mail.com" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div className="flex justify-end pt-4">
        <button type="submit" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition">Next →</button>
      </div>
    </motion.form>
  );
}
