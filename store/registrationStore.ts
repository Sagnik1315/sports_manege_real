"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PersonalDetails,
  GuardianDetails,
  AddressDetails,
  ClubDetails,
  CompetitionDetails,
  AthleteDocuments,
} from "@/types";

interface WizardFormData {
  personalDetails: Partial<PersonalDetails>;
  guardianDetails: Partial<GuardianDetails>;
  addressDetails: Partial<AddressDetails>;
  sportId: string;
  sportName: string;
  clubDetails: Partial<ClubDetails>;
  competitionDetails: Partial<CompetitionDetails>;
  documents: Partial<AthleteDocuments>;
}

interface RegistrationState {
  currentStep: number;
  formData: WizardFormData;
  isDraft: boolean;
  athleteId: string | null;
  submitting: boolean;
  setStep: (step: number) => void;
  setPersonalDetails: (data: Partial<PersonalDetails>) => void;
  setGuardianDetails: (data: Partial<GuardianDetails>) => void;
  setAddressDetails: (data: Partial<AddressDetails>) => void;
  setSport: (sportId: string, sportName: string) => void;
  setClubDetails: (data: Partial<ClubDetails>) => void;
  setCompetitionDetails: (data: Partial<CompetitionDetails>) => void;
  setDocuments: (data: Partial<AthleteDocuments>, merge?: boolean) => void;
  setAthleteId: (id: string) => void;
  setSubmitting: (val: boolean) => void;
  setDraft: (val: boolean) => void;
  reset: () => void;
}

const initialFormData: WizardFormData = {
  personalDetails: {},
  guardianDetails: {},
  addressDetails: {},
  sportId: "",
  sportName: "",
  clubDetails: {},
  competitionDetails: {},
  documents: {},
};

export const useRegistrationStore = create<RegistrationState>()(
  persist(
    (set) => ({
      currentStep: 1,
      formData: initialFormData,
      isDraft: false,
      athleteId: null,
      submitting: false,
      setStep: (step) => set({ currentStep: step }),
      setPersonalDetails: (data) =>
        set((s) => ({ formData: { ...s.formData, personalDetails: { ...s.formData.personalDetails, ...data } } })),
      setGuardianDetails: (data) =>
        set((s) => ({ formData: { ...s.formData, guardianDetails: { ...s.formData.guardianDetails, ...data } } })),
      setAddressDetails: (data) =>
        set((s) => ({ formData: { ...s.formData, addressDetails: { ...s.formData.addressDetails, ...data } } })),
      setSport: (sportId, sportName) =>
        set((s) => ({ formData: { ...s.formData, sportId, sportName } })),
      setClubDetails: (data) =>
        set((s) => ({ formData: { ...s.formData, clubDetails: { ...s.formData.clubDetails, ...data } } })),
      setCompetitionDetails: (data) =>
        set((s) => ({ formData: { ...s.formData, competitionDetails: { ...s.formData.competitionDetails, ...data } } })),
      setDocuments: (data, merge = true) =>
        set((s) => ({ 
          formData: { 
            ...s.formData, 
            documents: merge ? { ...s.formData.documents, ...data } : data as AthleteDocuments 
          } 
        })),
      setAthleteId: (id) => set({ athleteId: id }),
      setSubmitting: (val) => set({ submitting: val }),
      setDraft: (val) => set({ isDraft: val }),
      reset: () => set({ currentStep: 1, formData: initialFormData, isDraft: false, athleteId: null }),
    }),
    { name: "scm-athlete-registration" }
  )
);
