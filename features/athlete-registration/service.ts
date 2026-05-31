import { createAthlete, addStatusHistory } from "@/firebase/database";
import { generateId } from "@/lib/utils";
import type { AthleteRecord, RegistrationStatus } from "@/types";

export async function submitAthleteRegistration(data: Omit<AthleteRecord, "athleteId" | "status" | "createdAt" | "updatedAt">): Promise<string> {
  const athleteId = generateId("ATH");
  const now = new Date().toISOString();
  
  const record: AthleteRecord = {
    ...data,
    athleteId,
    status: "Submitted",
    createdAt: now,
    updatedAt: now,
  };

  await createAthlete(athleteId, record);
  
  await addStatusHistory(athleteId, {
    previousStatus: "Draft" as RegistrationStatus,
    currentStatus: "Submitted",
    updatedBy: "System",
    timestamp: now,
    notes: "Initial application submitted.",
  });

  return athleteId;
}
