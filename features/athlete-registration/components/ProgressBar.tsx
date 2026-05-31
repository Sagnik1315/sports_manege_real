"use client";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  return (
    <div className="w-full">
      {/* Step labels — visible on md+ */}
      <div className="hidden md:flex items-center justify-between mb-3">
        {steps.map((label, i) => {
          const step = i + 1;
          const done = step < currentStep;
          const active = step === currentStep;
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all",
                  done && "bg-blue-600 border-blue-600 text-white",
                  active && "bg-white border-blue-600 text-blue-600",
                  !done && !active && "bg-slate-100 border-slate-300 text-slate-400"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : step}
              </div>
              <span
                className={cn(
                  "mt-1.5 text-[10px] font-medium text-center leading-tight max-w-[70px]",
                  active ? "text-blue-600" : done ? "text-blue-500" : "text-slate-400"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>

      {/* Mobile: step count */}
      <div className="flex md:hidden items-center justify-between mt-2">
        <span className="text-xs text-slate-500">Step {currentStep} of {totalSteps}</span>
        <span className="text-xs font-medium text-blue-600">{steps[currentStep - 1]}</span>
      </div>
    </div>
  );
}
