import {
  ref,
  set,
  get,
  push,
  update,
  remove,
  query,
  orderByChild,
  equalTo,
  onValue,
  off,
  DatabaseReference,
  DataSnapshot,
} from "firebase/database";
import { database } from "./config";
import type {
  AthleteRecord,
  CoachRecord,
  UserRecord,
  RegistrationStatus,
  SportRecord,
  StatusHistoryEntry,
} from "@/types";

// ─── Users ───────────────────────────────────────────────────────────────────

export async function createUserRecord(
  uid: string,
  data: UserRecord
): Promise<void> {
  await set(ref(database, `users/${uid}`), data);
}

export async function getUserRecord(uid: string): Promise<UserRecord | null> {
  const snap = await get(ref(database, `users/${uid}`));
  return snap.exists() ? (snap.val() as UserRecord) : null;
}

// ─── Sports ──────────────────────────────────────────────────────────────────

export async function getSports(): Promise<SportRecord[]> {
  const snap = await get(ref(database, "sports"));
  if (!snap.exists()) return [];
  const data = snap.val() as Record<string, Omit<SportRecord, "sportId">>;
  return Object.entries(data).map(([sportId, val]) => ({ sportId, ...val }));
}

export async function initializeSports(): Promise<void> {
  const snap = await get(ref(database, "sports"));
  if (!snap.exists()) {
    await set(ref(database, "sports"), {
      sport001: { name: "Cricket", active: true },
      sport002: { name: "Football", active: true },
    });
  }
}

// ─── Athletes ─────────────────────────────────────────────────────────────────

export async function createAthlete(
  athleteId: string,
  data: AthleteRecord
): Promise<void> {
  await set(ref(database, `athletes/${athleteId}`), data);
}

export async function updateAthlete(
  athleteId: string,
  data: Partial<AthleteRecord>
): Promise<void> {
  await update(ref(database, `athletes/${athleteId}`), data);
}

export async function getAthlete(
  athleteId: string
): Promise<AthleteRecord | null> {
  const snap = await get(ref(database, `athletes/${athleteId}`));
  return snap.exists() ? (snap.val() as AthleteRecord) : null;
}

export async function getAllAthletes(): Promise<AthleteRecord[]> {
  const snap = await get(ref(database, "athletes"));
  if (!snap.exists()) return [];
  const data = snap.val() as Record<string, AthleteRecord>;
  return Object.values(data);
}

export async function getAthleteByUid(uid: string): Promise<AthleteRecord | null> {
  const athletes = await getAllAthletes();
  return athletes.find(a => a.uid === uid) || null;
}

export async function updateAthleteStatus(
  athleteId: string,
  status: string
): Promise<void> {
  await update(ref(database, `athletes/${athleteId}`), { status });
}

// ─── Status History ────────────────────────────────────────────────────────

export async function addStatusHistory(
  athleteId: string,
  entry: StatusHistoryEntry
): Promise<void> {
  await push(ref(database, `statusHistory/${athleteId}/logs`), entry);
}

export async function getStatusHistory(
  athleteId: string
): Promise<StatusHistoryEntry[]> {
  const snap = await get(ref(database, `statusHistory/${athleteId}/logs`));
  if (!snap.exists()) return [];
  const data = snap.val() as Record<string, StatusHistoryEntry>;
  return Object.values(data).sort((a, b) =>
    a.timestamp > b.timestamp ? -1 : 1
  );
}

// ─── Coaches ──────────────────────────────────────────────────────────────────

export async function createCoach(
  coachId: string,
  data: CoachRecord
): Promise<void> {
  await set(ref(database, `coaches/${coachId}`), data);
}

export async function updateCoach(
  coachId: string,
  data: Partial<CoachRecord>
): Promise<void> {
  await update(ref(database, `coaches/${coachId}`), data);
}

export async function getCoach(coachId: string): Promise<CoachRecord | null> {
  const snap = await get(ref(database, `coaches/${coachId}`));
  return snap.exists() ? (snap.val() as CoachRecord) : null;
}

export async function getAllCoaches(): Promise<CoachRecord[]> {
  const snap = await get(ref(database, "coaches"));
  if (!snap.exists()) return [];
  const data = snap.val() as Record<string, CoachRecord>;
  return Object.values(data);
}

export async function getCoachByUid(uid: string): Promise<CoachRecord | null> {
  const coaches = await getAllCoaches();
  return coaches.find(c => c.uid === uid) || null;
}

export async function updateCoachStatus(
  coachId: string,
  status: RegistrationStatus
): Promise<void> {
  const coachRef = ref(database, `coaches/${coachId}`);
  await update(coachRef, { 
    status,
    updatedAt: new Date().toISOString()
  });
}

export async function assignAthleteToCoach(
  coachId: string,
  athleteId: string
): Promise<void> {
  const coach = await getCoach(coachId);
  if (!coach) return;
  const assigned = coach.assignedAthletes ?? [];
  if (!assigned.includes(athleteId)) {
    await update(ref(database, `coaches/${coachId}`), {
      assignedAthletes: [...assigned, athleteId],
    });
  }
}

export async function getAthletesByCoachId(
  coachId: string
): Promise<AthleteRecord[]> {
  const athletes = await getAllAthletes();
  return athletes.filter((a) => a.coachId === coachId);
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [athletes, coaches] = await Promise.all([
    getAllAthletes(),
    getAllCoaches(),
  ]);
  return {
    totalAthletes: athletes.length,
    totalCoaches: coaches.length,
    cricketAthletes: athletes.filter((a) => a.sportId === "sport001").length,
    footballAthletes: athletes.filter((a) => a.sportId === "sport002").length,
    pendingReviews: athletes.filter(
      (a) => a.status === "Submitted" || a.status === "Under Review"
    ).length,
    approved: athletes.filter((a) => a.status === "Approved").length,
    rejected: athletes.filter((a) => a.status === "Rejected").length,
  };
}
