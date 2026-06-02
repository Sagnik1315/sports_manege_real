"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRegistrationStore } from "@/store/registrationStore";
import { addressDetailsSchema, type AddressDetailsFormData } from "@/validations/athlete";
import { INDIAN_STATES } from "@/constants";

interface Props { onNext: () => void; onBack: () => void; }

export function Step3AddressDetails({ onNext, onBack }: Props) {
  const { formData, setAddressDetails } = useRegistrationStore();

  const { register, handleSubmit, formState: { errors } } = useForm<AddressDetailsFormData>({
    resolver: zodResolver(addressDetailsSchema),
    mode: "onBlur",
    defaultValues: { country: "India", ...formData.addressDetails } as AddressDetailsFormData,
  });

  const onSubmit = (data: AddressDetailsFormData) => {
    setAddressDetails(data);
    onNext();
  };

  const inputClass = "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const errorClass = "text-red-500 text-xs mt-0.5";

  return (
    <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Address Line 1 *</label>
          <input {...register("addressLine1")} placeholder="House/Flat no., Street" className={inputClass} />
          {errors.addressLine1 && <p className={errorClass}>{errors.addressLine1.message}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Address Line 2</label>
          <input {...register("addressLine2")} placeholder="Landmark, Area (Optional)" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>City *</label>
          <input {...register("city")} placeholder="Mumbai" className={inputClass} />
          {errors.city && <p className={errorClass}>{errors.city.message}</p>}
        </div>
        <div>
          <label className={labelClass}>District *</label>
          <input {...register("district")} placeholder="Mumbai Suburban" className={inputClass} />
          {errors.district && <p className={errorClass}>{errors.district.message}</p>}
        </div>
        <div>
          <label className={labelClass}>State *</label>
          <select {...register("state")} className={inputClass}>
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className={errorClass}>{errors.state.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Pincode *</label>
          <input {...register("pincode")} placeholder="400001" maxLength={6} className={inputClass} />
          {errors.pincode && <p className={errorClass}>{errors.pincode.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <input {...register("country")} className={`${inputClass} bg-slate-50`} />
        </div>
      </div>
      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="px-5 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">← Back</button>
        <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition">Next →</button>
      </div>
    </motion.form>
  );
}
