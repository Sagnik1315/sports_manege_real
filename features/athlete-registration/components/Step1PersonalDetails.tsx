"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRegistrationStore } from "@/store/registrationStore";
import { personalDetailsSchema, type PersonalDetailsFormData } from "@/validations/athlete";
import { calculateAge } from "@/lib/utils";
import { BLOOD_GROUPS, GENDER_OPTIONS } from "@/constants";

interface Props { onNext: () => void; }

export function Step1PersonalDetails({ onNext }: Props) {
  const { formData, setPersonalDetails } = useRegistrationStore();

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PersonalDetailsFormData>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: formData.personalDetails as PersonalDetailsFormData,
  });

  const dob = watch("dateOfBirth");
  useEffect(() => {
    if (dob) setValue("age", calculateAge(dob));
  }, [dob, setValue]);

  const onSubmit = (data: PersonalDetailsFormData) => {
    setPersonalDetails(data);
    onNext();
  };

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const errorClass = "text-red-500 text-xs mt-0.5";

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Full Name *</label>
          <input {...register("fullName")} placeholder="John Doe" className={inputClass} />
          {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Gender *</label>
          <select {...register("gender")} className={inputClass}>
            <option value="">Select gender</option>
            {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Blood Group</label>
          <select {...register("bloodGroup")} className={inputClass}>
            <option value="">Select</option>
            {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Date of Birth *</label>
          <input {...register("dateOfBirth")} type="date" className={inputClass} max={new Date().toISOString().split("T")[0]} />
          {errors.dateOfBirth && <p className={errorClass}>{errors.dateOfBirth.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Age (Auto Calculated)</label>
          <input {...register("age", { valueAsNumber: true })} type="number" readOnly className={`${inputClass} bg-slate-50 cursor-not-allowed`} />
        </div>
        <div>
          <label className={labelClass}>Mobile Number *</label>
          <input {...register("mobile")} type="tel" placeholder="10-digit mobile" maxLength={10} className={inputClass} />
          {errors.mobile && <p className={errorClass}>{errors.mobile.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Alternate Mobile</label>
          <input {...register("alternateMobile")} type="tel" placeholder="Optional" maxLength={10} className={inputClass} />
          {errors.alternateMobile && <p className={errorClass}>{errors.alternateMobile.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Email Address *</label>
          <input {...register("email")} type="email" placeholder="you@example.com" className={inputClass} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Aadhaar Number</label>
          <input {...register("aadhaarNumber")} placeholder="Optional" maxLength={12} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Passport Number</label>
          <input {...register("passportNumber")} placeholder="Optional" className={inputClass} />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition">
          Next →
        </button>
      </div>
    </motion.form>
  );
}
