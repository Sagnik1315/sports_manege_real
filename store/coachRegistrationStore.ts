"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CoachPersonalDetails, CoachClubInfo, CoachDocuments } from "@/types";

interface CoachWizardData {
  personalDetails: Partial<CoachPersonalDetails>;
  sportId: string;
  sportName: string;
  clubInfo: Partial<CoachClubInfo>;
  documents: Partial<CoachDocuments>;
}

interface CoachRegistrationState {
  currentStep: number;
  formData: CoachWizardData;
  coachId: string | null;
  submitting: boolean;
  setStep: (step: number) => void;
  setPersonalDetails: (data: Partial<CoachPersonalDetails>) => void;
  setSport: (sportId: string, sportName: string) => void;
  setClubInfo: (data: Partial<CoachClubInfo>) => void;
  setDocuments: (data: Partial<CoachDocuments>, merge?: boolean) => void;
  setCoachId: (id: string) => void;
  setSubmitting: (val: boolean) => void;
  reset: () => void;
}

const initialData: CoachWizardData = {
  personalDetails: {},
  sportId: "",
  sportName: "",
  clubInfo: {},
  documents: {},
};

export const useCoachRegistrationStore = create<CoachRegistrationState>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: initialData,
      coachId: null,
      submitting: false,
      setStep: (step) => set({ currentStep: step }),
      setPersonalDetails: (data) =>
        set((s) => ({ formData: { ...s.formData, personalDetails: { ...s.formData.personalDetails, ...data } } })),
      setSport: (sportId, sportName) =>
        set((s) => ({ formData: { ...s.formData, sportId, sportName } })),
      setClubInfo: (data) =>
        set((s) => ({ formData: { ...s.formData, clubInfo: { ...s.formData.clubInfo, ...data } } })),
      setDocuments: (data, merge = true) =>
        set((s) => ({ 
          formData: { 
            ...s.formData, 
            documents: merge ? { ...s.formData.documents, ...data } : data as CoachDocuments 
          } 
        })),
      setCoachId: (id) => set({ coachId: id }),
      setSubmitting: (val) => set({ submitting: val }),
      reset: () => set({ currentStep: 1, formData: initialData, coachId: null }),
    }),
    { name: "scm-coach-registration" }
  )
);
