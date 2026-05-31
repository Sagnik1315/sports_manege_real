import { createCoach } from "@/firebase/database";
import { generateId } from "@/lib/utils";
import type { CoachRecord } from "@/types";

export async function submitCoachRegistration(data: Omit<CoachRecord, "coachId" | "createdAt" | "updatedAt" | "assignedAthletes" | "status">): Promise<string> {
  const coachId = generateId("COA");
  const now = new Date().toISOString();
  
  const record: CoachRecord = {
    ...data,
    coachId,
    assignedAthletes: [],
    status: "Submitted",
    createdAt: now,
    updatedAt: now,
  };

  await createCoach(coachId, record);
  return coachId;
}
