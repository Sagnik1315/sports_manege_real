"use client";
import { motion } from "framer-motion";
import { useRegistrationStore } from "@/store/registrationStore";
import { SPORTS } from "@/constants";
import { cn } from "@/lib/utils";

interface Props { onNext: () => void; onBack: () => void; }

export function Step4SportSelection({ onNext, onBack }: Props) {
  const { formData, setSport } = useRegistrationStore();

  const handleSelect = (sportId: string, sportName: string) => {
    setSport(sportId, sportName);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <p className="text-slate-600 text-sm">Select the sport you want to register for.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SPORTS.map(({ sportId, name }) => {
          const selected = formData.sportId === sportId;
          const emoji = sportId === "sport001" ? "🏏" : "⚽";
          return (
            <button
              key={sportId}
              type="button"
              onClick={() => handleSelect(sportId, name)}
              className={cn(
                "p-6 rounded-2xl border-2 text-left transition-all cursor-pointer",
                selected
                  ? "border-blue-600 bg-blue-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
              )}
            >
              <span className="text-4xl block mb-3">{emoji}</span>
              <p className={cn("font-semibold text-lg", selected ? "text-blue-700" : "text-slate-800")}>{name}</p>
              <p className="text-sm text-slate-500 mt-1">Sport ID: {sportId}</p>
              {selected && (
                <span className="mt-3 inline-block px-2.5 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
                  ✓ Selected
                </span>
              )}
            </button>
          );
        })}
      </div>
      {!formData.sportId && (
        <p className="text-red-500 text-sm">Please select a sport to continue.</p>
      )}
      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="px-5 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition">← Back</button>
        <button
          type="button"
          disabled={!formData.sportId}
          onClick={onNext}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
        >
          Next →
        </button>
      </div>
    </motion.div>
  );
}
