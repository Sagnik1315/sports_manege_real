"use client";
import { CoachWizardContainer } from "@/features/coach-registration/components/CoachWizardContainer";
import { CoachLayout } from "@/components/layout/CoachLayout";

export default function CoachRegisterWizardPage() {
  return (
    <CoachLayout>
      <CoachWizardContainer />
    </CoachLayout>
  );
}
