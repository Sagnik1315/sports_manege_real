export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  ATHLETE_REGISTER: "/athlete-register",
  COACH_REGISTER: "/coach-register",

  ATHLETE_DASHBOARD: "/athlete/dashboard",
  ATHLETE_PROFILE: "/athlete/profile",
  ATHLETE_REGISTER_WIZARD: "/athlete/register",

  COACH_DASHBOARD: "/coach/dashboard",
  COACH_PROFILE: "/coach/profile",
  COACH_ATHLETES: "/coach/athletes",
  COACH_REGISTER_WIZARD: "/coach/register",

  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_ATHLETES: "/admin/athletes",
  ADMIN_COACHES: "/admin/coaches",
  ADMIN_SETTINGS: "/admin/settings",
} as const;
