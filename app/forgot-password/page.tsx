"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createUser } from "@/firebase/auth";
import { createUserRecord, initializeSports } from "@/firebase/database";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/validations/auth";
import { resetPassword } from "@/firebase/auth";
import { ROUTES } from "@/constants/routes";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async ({ email }: ForgotPasswordFormData) => {
    try {
      await resetPassword(email);
      toast.success("Password reset email sent! Check your inbox.");
    } catch {
      toast.error("Failed to send reset email. Please check the email address.");
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-600 mb-4">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-400 mt-2">Check your email for a reset link</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
          {isSubmitSuccessful ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📬</div>
              <p className="text-white font-medium">Email Sent!</p>
              <p className="text-slate-400 text-sm mt-1">Check your inbox and follow the link to reset your password.</p>
              <Link href={ROUTES.LOGIN} className="mt-4 inline-block text-blue-400 hover:text-blue-300 text-sm">← Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-slate-200 block mb-1.5">Email Address</label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Send Reset Link
              </button>
              <Link href={ROUTES.LOGIN} className="flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-white transition">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
