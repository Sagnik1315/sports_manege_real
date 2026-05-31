"use client";
import { useEffect } from "react";
import { useRegistrationStore } from "@/store/registrationStore";
import { useAuthStore } from "@/store/authStore";
import { ProgressBar } from "./ProgressBar";
import { Step1PersonalDetails } from "./Step1PersonalDetails";
import { Step2GuardianDetails } from "./Step2GuardianDetails";
import { Step3AddressDetails } from "./Step3AddressDetails";
import { Step4SportSelection } from "./Step4SportSelection";
import { Step5ClubDetails } from "./Step5ClubDetails";
import { Step6CompetitionDetails } from "./Step6CompetitionDetails";
import { Step7DocumentUpload } from "./Step7DocumentUpload";
import { Step8ReviewSubmit } from "./Step8ReviewSubmit";
import { generateId } from "@/lib/utils";
import { Trophy } from "lucide-react";

const STEPS = [
  "Personal",
  "Guardian",
  "Address",
  "Sport",
  "Club",
  "Competition",
  "Documents",
  "Review",
];

export function WizardContainer() {
  const { currentStep, setStep, athleteId, setAthleteId } = useRegistrationStore();
  const { loading } = useAuthStore();

  // Initialize registration ID on first mount if it doesn't exist
  useEffect(() => {
    if (!athleteId) {
      setAthleteId(generateId("ATH"));
    }
  }, [athleteId, setAthleteId]);

  const next = () => setStep(currentStep + 1);
  const back = () => setStep(currentStep - 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1PersonalDetails onNext={next} />;
      case 2: return <Step2GuardianDetails onNext={next} onBack={back} />;
      case 3: return <Step3AddressDetails onNext={next} onBack={back} />;
      case 4: return <Step4SportSelection onNext={next} onBack={back} />;
      case 5: return <Step5ClubDetails onNext={next} onBack={back} />;
      case 6: return <Step6CompetitionDetails onNext={next} onBack={back} />;
      case 7: return <Step7DocumentUpload onNext={next} onBack={back} />;
      case 8: return <Step8ReviewSubmit onBack={back} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-8 py-8 md:py-10 text-white relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-blue-600 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Athlete Registration</h2>
              <p className="text-slate-400 text-sm mt-0.5">Please fill in the details accurately</p>
            </div>
          </div>
          
          <ProgressBar 
            currentStep={currentStep} 
            totalSteps={STEPS.length} 
            steps={STEPS} 
          />
          
          <div className="absolute top-8 right-8 hidden md:block">
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest text-right">Register ID</p>
            <p className="text-xs font-mono text-blue-400">{athleteId}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10">
          {renderStep()}
        </div>
      </div>
      
      <p className="text-center text-slate-400 text-xs mt-8">
        Need help? Contact support at <span className="text-blue-500 transition hover:underline cursor-pointer">help@sportsclub.com</span>
      </p>
    </div>
  );
}
