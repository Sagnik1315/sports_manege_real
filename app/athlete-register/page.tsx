"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createUser, sendVerificationEmail,
  signOut, } from "@/firebase/auth";
import { createUserRecord } from "@/firebase/database";
import { generateId } from "@/lib/utils";
import { athleteRegisterSchema, type AthleteRegisterFormData } from "@/validations/auth";
import { ROUTES } from "@/constants/routes";

export default function AthleteRegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AthleteRegisterFormData>({
    resolver: zodResolver(athleteRegisterSchema),
  });

const onSubmit = async ({
  email,
  password,
  fullName,
}: AthleteRegisterFormData) => {
  try {
    const { user: fbUser } = await createUser(
      email,
      password
    );

    await createUserRecord(fbUser.uid, {
      uid: fbUser.uid,
      name: fullName,
      email,
      role: "athlete",
      createdAt: new Date().toISOString(),
    });

    await sendVerificationEmail(fbUser);

    await signOut();

    toast.success(
      "Verification email sent. Please verify your email before logging in."
    );

    router.push(ROUTES.LOGIN);
  } catch (err: unknown) {
    console.error("Registration error:", err);

    const msg =
      err instanceof Error ? err.message : String(err);

    if (msg.includes("email-already-in-use")) {
      toast.error("Email already registered.");
    } else {
      toast.error(`Registration failed: ${msg}`);
    }
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-600 mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Athlete Registration</h1>
          <p className="text-slate-400 mt-2">Register as an athlete</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-200 block mb-1.5">Full Name *</label>
              <input {...register("fullName")} placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200 block mb-1.5">Email *</label>
              <input {...register("email")} type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200 block mb-1.5">Password *</label>
              <div className="relative">
                <input {...register("password")} type={showPw ? "text" : "password"} placeholder="Min 8 chars, 1 uppercase, 1 number" className="w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"><Eye className="h-4 w-4" /></button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-slate-200 block mb-1.5">Confirm Password *</label>
              <input {...register("confirmPassword")} type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
          </form>
        </div>
        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{" "}
          <Link href={ROUTES.LOGIN} className="text-blue-400 hover:text-blue-300 font-medium">Login</Link>
        </p>
        <p className="text-center text-slate-500 text-sm mt-2">
          Are you a coach?{" "}
          <Link href={ROUTES.COACH_REGISTER} className="text-blue-400 hover:text-blue-300">Register as Coach</Link>
        </p>
      </motion.div>
    </div>
  );
}
