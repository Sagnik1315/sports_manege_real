// ─── Auth Types ──────────────────────────────────────────────────────────────

export type UserRole = "admin" | "coach" | "athlete";

export interface AuthUser {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  createdAt: string;
}

export interface UserRecord {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// ─── Sport Types ──────────────────────────────────────────────────────────────

export interface SportRecord {
  sportId: string;
  name: string;
  active: boolean;
}

// ─── Status Types ─────────────────────────────────────────────────────────────

export type RegistrationStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected";

export interface StatusHistoryEntry {
  previousStatus: RegistrationStatus;
  currentStatus: RegistrationStatus;
  updatedBy: string;
  timestamp: string;
  notes?: string;
}

// ─── Document Types ───────────────────────────────────────────────────────────

export interface DocumentRecord {
  fileName: string;
  fileType: string;
  storageUrl: string;
  uploadedAt: string;
}

export interface AthleteDocuments {
  photo?: DocumentRecord;
  aadhaar?: DocumentRecord;
  birthCertificate?: DocumentRecord;
  passport?: DocumentRecord;
  medicalCertificate?: DocumentRecord;
  previousCertificate?: DocumentRecord;
}

// ─── Athlete Types ────────────────────────────────────────────────────────────

export interface PersonalDetails {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  bloodGroup?: string;
  mobile: string;
  alternateMobile?: string;
  email: string;
  aadhaarNumber?: string;
  passportNumber?: string;
}

export interface GuardianDetails {
  fatherName: string;
  motherName: string;
  guardianName?: string;
  guardianMobile: string;
  guardianOccupation?: string;
}

export interface AddressDetails {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface ClubDetails {
  clubName: string;
  coachName: string;
  coachId?: string;
  stateAssociation: string;
  districtAssociation?: string;
  yearsOfExperience?: number;
}

export interface CompetitionDetails {
  competitionApplied: string;
  ageGroup: string;
  weightCategory?: string;
  category?: string;
  preferredEvent?: string;
}

export interface AthleteRecord {
  athleteId: string;
  uid: string;
  sportId: string;
  sportName: string;
  personalDetails: PersonalDetails;
  guardianDetails: GuardianDetails;
  addressDetails: AddressDetails;
  clubDetails: ClubDetails;
  competitionDetails: CompetitionDetails;
  documents: AthleteDocuments;
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
  coachId?: string;
  assignedAt?: string;
}

// ─── Coach Types ───────────────────────────────────────────────────────────────

export interface CoachPersonalDetails {
  fullName: string;
  mobile: string;
  email: string;
}

export interface CoachClubInfo {
  clubName: string;
  experienceYears: number;
}

export interface CoachDocuments {
  photo?: DocumentRecord;
  identityProof?: DocumentRecord;
  sportsCertificate?: DocumentRecord;
}

export interface CoachRecord {
  coachId: string;
  uid: string;
  sportId: string;
  sportName: string;
  personalDetails: CoachPersonalDetails;
  clubInfo: CoachClubInfo;
  documents: CoachDocuments;
  assignedAthletes: string[];
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Table / Pagination Types ─────────────────────────────────────────────────

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface DashboardStats {
  totalAthletes: number;
  totalCoaches: number;
  cricketAthletes: number;
  footballAthletes: number;
  pendingReviews: number;
  approved: number;
  rejected: number;
}
