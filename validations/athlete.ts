import { z } from "zod";

const mobileSchema = z
  .string()
  .length(10, "Mobile number must be exactly 10 digits")
  .regex(/^\d{10}$/, "Only digits allowed");

const pincodeSchema = z
  .string()
  .length(6, "Pincode must be 6 digits")
  .regex(/^\d{6}$/, "Only digits allowed");

// Step 1: Personal Details
export const personalDetailsSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  gender: z.string().min(1, "Gender is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required").refine(
    (val) => new Date(val) <= new Date(),
    "Date of birth cannot be in the future"
  ),
  age: z.number().min(0).optional(),
  bloodGroup: z.string().optional(),
  mobile: mobileSchema,
  alternateMobile: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{10}$/.test(v), "Must be 10 digits"),
  email: z.string().email("Valid email required"),
  aadhaarNumber: z.string().optional(),
  passportNumber: z.string().optional(),
});

// Step 2: Guardian Details
export const guardianDetailsSchema = z.object({
  fatherName: z.string().min(2, "Father's name is required"),
  motherName: z.string().min(2, "Mother's name is required"),
  guardianName: z.string().optional(),
  guardianMobile: mobileSchema,
  guardianOccupation: z.string().optional(),
});

// Step 3: Address Details
export const addressDetailsSchema = z.object({
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  pincode: pincodeSchema,
  country: z.string(),
});

// Step 4: Sport Selection
export const sportSelectionSchema = z.object({
  sportId: z.string().min(1, "Sport selection is required"),
  sportName: z.string().min(1, "Sport name is required"),
});

// Step 5: Club Details
export const clubDetailsSchema = z.object({
  clubName: z.string().min(2, "Club name is required"),
  coachName: z.string().min(2, "Coach name is required"),
  coachId: z.string().optional(),
  stateAssociation: z.string().min(2, "State association is required"),
  districtAssociation: z.string().optional(),
  yearsOfExperience: z.number().min(0).optional(),
});

// Step 6: Competition Details
export const competitionDetailsSchema = z.object({
  competitionApplied: z.string().min(2, "Competition name is required"),
  ageGroup: z.string().min(1, "Age group is required"),
  weightCategory: z.string().optional(),
  category: z.string().optional(),
  preferredEvent: z.string().optional(),
});

export type PersonalDetailsFormData = z.infer<typeof personalDetailsSchema>;
export type GuardianDetailsFormData = z.infer<typeof guardianDetailsSchema>;
export type AddressDetailsFormData = z.infer<typeof addressDetailsSchema>;
export type SportSelectionFormData = z.infer<typeof sportSelectionSchema>;
export type ClubDetailsFormData = z.infer<typeof clubDetailsSchema>;
export type CompetitionDetailsFormData = z.infer<typeof competitionDetailsSchema>;
