import { z } from "zod";

const mobileSchema = z
  .string()
  .length(10, "Mobile number must be exactly 10 digits")
  .regex(/^\d{10}$/, "Only digits allowed");

export const coachPersonalDetailsSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  mobile: mobileSchema,
  email: z.string().email("Valid email required"),
});

export const coachSportSelectionSchema = z.object({
  sportId: z.string().min(1, "Sport selection is required"),
  sportName: z.string().min(1, "Sport name is required"),
});

export const coachClubInfoSchema = z.object({
  clubName: z.string().min(2, "Club name is required"),
  experienceYears: z.number().min(0, "Must be 0 or more").max(50),
});

export type CoachPersonalDetailsFormData = z.infer<typeof coachPersonalDetailsSchema>;
export type CoachSportSelectionFormData = z.infer<typeof coachSportSelectionSchema>;
export type CoachClubInfoFormData = z.infer<typeof coachClubInfoSchema>;
