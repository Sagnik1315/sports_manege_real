"use client";
import { create } from "zustand";
import type { AthleteRecord, CoachRecord, DashboardStats, RegistrationStatus } from "@/types";

interface AdminFilters {
  search: string;
  sport: string;
  status: RegistrationStatus | "All";
}

interface AdminState {
  athletes: AthleteRecord[];
  coaches: CoachRecord[];
  stats: DashboardStats | null;
  filters: AdminFilters;
  pageIndex: number;
  pageSize: number;
  loading: boolean;
  setAthletes: (athletes: AthleteRecord[]) => void;
  setCoaches: (coaches: CoachRecord[]) => void;
  setStats: (stats: DashboardStats) => void;
  setFilters: (filters: Partial<AdminFilters>) => void;
  setPage: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAdminStore = create<AdminState>()((set) => ({
  athletes: [],
  coaches: [],
  stats: null,
  filters: { search: "", sport: "All", status: "All" },
  pageIndex: 0,
  pageSize: 10,
  loading: false,
  setAthletes: (athletes) => set({ athletes }),
  setCoaches: (coaches) => set({ coaches }),
  setStats: (stats) => set({ stats }),
  setFilters: (filters) =>
    set((s) => ({ filters: { ...s.filters, ...filters }, pageIndex: 0 })),
  setPage: (pageIndex) => set({ pageIndex }),
  setPageSize: (pageSize) => set({ pageSize }),
  setLoading: (loading) => set({ loading }),
  reset: () =>
    set({
      athletes: [],
      coaches: [],
      stats: null,
      filters: { search: "", sport: "All", status: "All" },
      pageIndex: 0,
    }),
}));
