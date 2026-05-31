"use client";
import { useEffect } from "react";
import { useCoachRegistrationStore } from "@/store/coachRegistrationStore";
import { ProgressBar } from "@/features/athlete-registration/components/ProgressBar";
import { Step1PersonalDetails } from "./Step1PersonalDetails";
import { Step2SportSelection } from "./Step2SportSelection";
import { Step3ClubInfo } from "./Step3ClubInfo";
import { Step4DocumentUpload } from "./Step4DocumentUpload";
import { Step5ReviewSubmit } from "./Step5ReviewSubmit";
import { generateId } from "@/lib/utils";
import { Trophy } from "lucide-react";

const STEPS = ["Personal", "Sport", "Club", "Documents", "Review"];

export function CoachWizardContainer() {
  const { currentStep, setStep, coachId, setCoachId } = useCoachRegistrationStore();

  useEffect(() => { if (!coachId) setCoachId(generateId("COA")); }, [coachId, setCoachId]);

  const next = () => setStep(currentStep + 1);
  const back = () => setStep(currentStep - 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1PersonalDetails onNext={next} />;
      case 2: return <Step2SportSelection onNext={next} onBack={back} />;
      case 3: return <Step3ClubInfo onNext={next} onBack={back} />;
      case 4: return <Step4DocumentUpload onNext={next} onBack={back} />;
      case 5: return <Step5ReviewSubmit onBack={back} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-emerald-900 px-8 py-10 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-emerald-600 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Coach Registration</h2>
              <p className="text-emerald-300 text-sm">Join our platform as a professional coach</p>
            </div>
          </div>
          <ProgressBar currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />
        </div>
        <div className="p-8 md:p-10">{renderStep()}</div>
      </div>
    </div>
  );
}
