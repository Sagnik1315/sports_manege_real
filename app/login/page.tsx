"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Trophy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signIn, signOut } from "@/firebase/auth";
import { getUserRecord } from "@/firebase/database";
import { useAuthStore } from "@/store/authStore";
import { loginSchema, type LoginFormData } from "@/validations/auth";
import { ROUTES } from "@/constants/routes";
import type { AuthUser } from "@/types";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setUser } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

 const onSubmit = async ({ email, password }: LoginFormData) => {
  try {
    // Check hardcoded Admin credentials first
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (
      email === adminEmail &&
      password === adminPassword
    ) {
      const authUser: AuthUser = {
        uid: "admin",
        email: adminEmail ?? "",
        role: "admin",
        name: "Administrator",
        createdAt: new Date().toISOString(),
      };

      setUser(authUser);

      document.cookie =
    "scm-auth-token=admin-session; path=/; max-age=3600";

  document.cookie =
    "scm-user-role=admin; path=/; max-age=3600";

      toast.success("Welcome Admin!");

      router.push("/admin/dashboard");
      return;
    }

    // Firebase Login (Athlete / Coach)
    const { user: fbUser } = await signIn(
      email,
      password
    );

    // Check email verification
    await fbUser.reload();

    if (!fbUser.emailVerified) {
      await signOut();

      toast.error(
        "Please verify your email before logging in."
      );

      return;
    }

    const record = await getUserRecord(fbUser.uid);

    if (!record) {
      toast.error("User account not found.");
      return;
    }

    const authUser: AuthUser = {
      uid: fbUser.uid,
      email: fbUser.email ?? "",
      role: record.role,
      name: record.name,
      createdAt: record.createdAt,
    };

    setUser(authUser);

    const token = await fbUser.getIdToken();

    document.cookie = `scm-auth-token=${token}; path=/; max-age=3600`;
    document.cookie = `scm-user-role=${record.role}; path=/; max-age=3600`;

    toast.success(`Welcome back, ${record.name}!`);

    if (record.role === "coach") {
      router.push(ROUTES.COACH_DASHBOARD);
    } else {
      router.push(ROUTES.ATHLETE_DASHBOARD);
    }
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Login failed";

    if (
      msg.includes("user-not-found") ||
      msg.includes("wrong-password") ||
      msg.includes("invalid-credential")
    ) {
      toast.error("Invalid email or password.");
    } else {
      toast.error("Login failed. Please try again.");
    }
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-600 mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Welcome Back 👋</h1>
          <p className="text-slate-400 mt-2">Login to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-slate-200 block mb-1.5">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="name@mail.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-slate-200 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link href={ROUTES.FORGOT_PASSWORD} className="text-sm text-blue-400 hover:text-blue-300 transition">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Register links */}
        <p className="text-center text-slate-400 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.ATHLETE_REGISTER} className="text-blue-400 hover:text-blue-300 font-medium">Register as Athlete</Link>
          {" or "}
          <Link href={ROUTES.COACH_REGISTER} className="text-blue-400 hover:text-blue-300 font-medium">Coach</Link>
        </p>
      </motion.div>
    </div>
  );
}
