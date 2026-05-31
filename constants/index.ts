import type { RegistrationStatus } from "@/types";

export interface SportOption {
  sportId: string;
  name: string;
}

export const SPORTS: SportOption[] = [
  { sportId: "sport001", name: "Cricket" },
  { sportId: "sport002", name: "Football" },
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export const GENDER_OPTIONS = ["Male", "Female", "Other"];

export const AGE_GROUPS = ["U-10", "U-12", "U-14", "U-16", "U-18", "U-21", "Open"];

export const REGISTRATION_STATUSES: RegistrationStatus[] = [
  "Draft",
  "Submitted",
  "Under Review",
  "Approved",
  "Rejected",
];

export const STATUS_COLORS: Record<RegistrationStatus, string> = {
  Draft: "bg-gray-100 text-gray-700",
  Submitted: "bg-blue-100 text-blue-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh",
];
