"use client";
import { motion } from "framer-motion";
import { useCoachRegistrationStore } from "@/store/coachRegistrationStore";
import { SPORTS } from "@/constants";
import { cn } from "@/lib/utils";

interface Props { onNext: () => void; onBack: () => void; }

export function Step2SportSelection({ onNext, onBack }: Props) {
  const { formData, setSport } = useCoachRegistrationStore();

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SPORTS.map(({ sportId, name }) => {
          const selected = formData.sportId === sportId;
          return (
            <button
              key={sportId}
              type="button"
              onClick={() => setSport(sportId, name)}
              className={cn(
                "p-6 rounded-2xl border-2 text-left transition-all",
                selected ? "border-emerald-600 bg-emerald-50 shadow-md" : "border-slate-200 bg-white hover:border-emerald-300"
              )}
            >
              <span className="text-4xl block mb-3">{sportId === "sport001" ? "🏏" : "⚽"}</span>
              <p className={cn("font-semibold text-lg", selected ? "text-emerald-700" : "text-slate-800")}>{name}</p>
              {selected && <span className="mt-3 inline-block px-2.5 py-0.5 bg-emerald-600 text-white text-xs rounded-full">Selected</span>}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="px-5 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50">← Back</button>
        <button type="button" disabled={!formData.sportId} onClick={onNext} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium rounded-lg transition">Next →</button>
      </div>
    </motion.div>
  );
}
