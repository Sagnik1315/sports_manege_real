"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRegistrationStore } from "@/store/registrationStore";
import { guardianDetailsSchema, type GuardianDetailsFormData } from "@/validations/athlete";

interface Props { onNext: () => void; onBack: () => void; }

export function Step2GuardianDetails({ onNext, onBack }: Props) {
  const { formData, setGuardianDetails } = useRegistrationStore();

  const { register, handleSubmit, formState: { errors } } = useForm<GuardianDetailsFormData>({
    resolver: zodResolver(guardianDetailsSchema),
    mode: "onBlur",
    defaultValues: formData.guardianDetails as GuardianDetailsFormData,
  });

  const onSubmit = (data: GuardianDetailsFormData) => {
    setGuardianDetails(data);
    onNext();
  };

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const errorClass = "text-red-500 text-xs mt-0.5";

  return (
    <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Father&apos;s Name *</label>
          <input {...register("fatherName")} placeholder="Father's full name" className={inputClass} />
          {errors.fatherName && <p className={errorClass}>{errors.fatherName.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Mother&apos;s Name *</label>
          <input {...register("motherName")} placeholder="Mother's full name" className={inputClass} />
          {errors.motherName && <p className={errorClass}>{errors.motherName.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Guardian Name</label>
          <input {...register("guardianName")} placeholder="Optional" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Guardian Mobile *</label>
          <input {...register("guardianMobile")} type="tel" placeholder="10-digit mobile" maxLength={10} className={inputClass} />
          {errors.guardianMobile && <p className={errorClass}>{errors.guardianMobile.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Guardian Occupation</label>
          <input {...register("guardianOccupation")} placeholder="e.g. Business, Service" className={inputClass} />
        </div>
      </div>
      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="px-5 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">
          ← Back
        </button>
        <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition">
          Next →
        </button>
      </div>
    </motion.form>
  );
}
