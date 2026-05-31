"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, Users, UserCheck, ShieldCheck, Upload, BarChart3, 
  ArrowRight, Star, Check, ChevronLeft, ChevronRight, Zap, 
  Target, Award, Sparkles, Mail, Phone, MapPin, Globe, CheckCircle2 
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

// Animated Counter Component
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTimestamp: number | null = null;
          const duration = 1500;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <div ref={elementRef} className="inline-block">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

// Background Grid Overlay
const GridBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
);

const testimonials = [
  {
    quote: "The dual-sports curriculum at Apex is revolutionary. My son trains in cricket and the athletic biomechanics analysis has elevated his game immensely. Outstanding mentors!",
    author: "Arvind Swamy",
    role: "Parent of U-16 Cricket Athlete",
    sport: "Cricket Academy",
    rating: 5,
  },
  {
    quote: "Apex is easily the most tech-forward academy. The soccer tactical simulator and real-time physical trackers have drastically improved my playmaking abilities on the turf.",
    author: "Kabir Mehta",
    role: "Midfielder, Elite Football Squad",
    sport: "Football Academy",
    rating: 5,
  },
  {
    quote: "The facility is spectacular. As a fast bowler, the automated video review, bowling sensor statistics, and professional turf wickets are exactly what I needed to make the state team.",
    author: "Rohan Das",
    role: "U-19 State Fast Bowler",
    sport: "Cricket Academy",
    rating: 5,
  },
  {
    quote: "Apex has set a benchmark for youth academies. The club's digital records, parent notifications, and elite recruitment network make it the complete development pathway.",
    author: "Jessica Martinez",
    role: "U-17 Girls Football Coach",
    sport: "Football Academy",
    rating: 5,
  }
];

export default function HomePage() {
  const { user } = useAuthStore();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getDashboardRoute = () => {
    if (!user) return ROUTES.LOGIN;
    switch (user.role) {
      case "admin":
        return ROUTES.ADMIN_DASHBOARD;
      case "coach":
        return ROUTES.COACH_DASHBOARD;
      case "athlete":
        return ROUTES.ATHLETE_DASHBOARD;
      default:
        return ROUTES.LOGIN;
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success("Subscribed! Welcome to Apex Sports Elite network.", {
      description: "You've been added to our newsletter for academy alerts and scout schedules."
    });
    setNewsletterEmail("");
  };

  const roles = [
    {
      title: "Athlete Registry",
      desc: "Enroll in Cricket or Football. Complete your application profile, upload identity certificates, and track registration status.",
      href: ROUTES.ATHLETE_REGISTER,
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 hover:border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_35px_rgba(6,182,212,0.25)]",
      icon: Users,
      cta: "Start Application",
      badge: "Onboarding Open"
    },
    {
      title: "Coaching Staff",
      desc: "Register as an accredited coach. Manage rosters, log attendance, design training blocks, and write athlete feedback reports.",
      href: ROUTES.COACH_REGISTER,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 hover:border-emerald-400 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:shadow-[0_0_35px_rgba(16,185,129,0.25)]",
      icon: UserCheck,
      cta: "Register as Coach",
      badge: "Hiring Certified"
    },
    {
      title: "Control Panel",
      desc: "Dedicated owner terminal to manage applications, review documents, export excel datasets, and configure sports properties.",
      href: ROUTES.LOGIN,
      color: "from-purple-500/20 to-violet-500/20 border-purple-500/30 hover:border-purple-400 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_35px_rgba(168,85,247,0.25)]",
      icon: ShieldCheck,
      cta: "Admin Console",
      badge: "Secure Access"
    }
  ];

  return (
    <div className="min-h-screen bg-[#070b16] text-white font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Dynamic Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#070b16]/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Trophy className="h-5 w-5 text-black font-extrabold" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                APEX
              </span>
              <span className="text-xs block text-cyan-400 font-semibold tracking-widest uppercase">
                SPORTS ELITE
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-cyan-400 transition-colors">About Us</a>
            <a href="#programs" className="hover:text-cyan-400 transition-colors">Programs</a>
            <a href="#stats" className="hover:text-cyan-400 transition-colors">Achievements</a>
            <a href="#onboarding" className="hover:text-cyan-400 transition-colors">Register</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link
                href={getDashboardRoute()}
                className="px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-black rounded-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition duration-300"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  href="#onboarding"
                  className="hidden sm:inline-block px-5 py-2 text-sm font-semibold border border-cyan-500/40 rounded-lg text-cyan-400 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-300"
                >
                  Join Club
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden">
        <GridBackground />
        
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-cyan-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Apex Training Hub v1.2</span>
                </div>
                <h1 className="text-5xl sm:text-6xl font-black leading-[1.1] tracking-tight">
                  Dual-Elite Training in
                  <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                    Cricket & Football
                  </span>
                </h1>
                <p className="text-slate-400 text-lg max-w-xl">
                  Step onto smart turf and training zones engineered to craft legends. We blend real-time performance analytics, professional pitch simulations, and elite mentors to launch state and national champions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <a
                  href="#onboarding"
                  className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-300 flex items-center gap-2 group"
                >
                  Get Started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#about"
                  className="px-8 py-4 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  Explore Programs
                </a>
              </motion.div>

              {/* Mini Highlights */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5"
              >
                <div>
                  <h4 className="font-extrabold text-2xl text-white">2</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Core Sports</p>
                </div>
                <div>
                  <h4 className="font-extrabold text-2xl text-white">45+</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Pro Coaches</p>
                </div>
                <div>
                  <h4 className="font-extrabold text-2xl text-white">100%</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Tech Analytics</p>
                </div>
              </motion.div>
            </div>

            {/* Right Interactive Graphics Column */}
            <div className="lg:col-span-6 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-[500px] aspect-square flex items-center justify-center"
              >
                {/* Glowing ring backgrounds */}
                <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-8 rounded-full border border-emerald-500/10 animate-[spin_25s_linear_infinite_reverse]" />
                <div className="absolute inset-16 rounded-full border border-dashed border-white/10" />

                {/* Main Split Cards Container */}
                <div className="relative z-10 w-full grid grid-cols-2 gap-6 p-4">
                  
                  {/* Cricket Card (Left) */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-gradient-to-b from-[#1b1c30]/90 to-[#0e0f1e]/90 border border-amber-500/30 rounded-2xl p-6 shadow-[0_15px_30px_rgba(245,158,11,0.05)] relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
                    <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20 text-amber-400">
                      <Target className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-amber-500 font-semibold">Academy</span>
                    <h3 className="text-lg font-bold mt-1 text-white group-hover:text-amber-400 transition-colors">Apex Cricket</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Turf nets, bowling speed radar trackers, bat telemetry, and elite coaching clinics.
                    </p>
                    <div className="mt-4 flex items-center justify-between text-slate-500 text-[10px] border-t border-white/5 pt-3">
                      <span>Wickets: Clay & Grass</span>
                      <span className="text-amber-500 font-semibold">Enrolling</span>
                    </div>
                  </motion.div>

                  {/* Football Card (Right) */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-gradient-to-b from-[#122329]/90 to-[#0c1417]/90 border border-emerald-500/30 rounded-2xl p-6 shadow-[0_15px_30px_rgba(16,185,129,0.05)] relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 text-emerald-400">
                      <Zap className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-semibold">Academy</span>
                    <h3 className="text-lg font-bold mt-1 text-white group-hover:text-emerald-400 transition-colors">Apex Football</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Tactical simulation tables, GPS sensor vests, and agility-reflex light courses.
                    </p>
                    <div className="mt-4 flex items-center justify-between text-slate-500 text-[10px] border-t border-white/5 pt-3">
                      <span>Pitches: Smart FIFA Turf</span>
                      <span className="text-emerald-500 font-semibold">Enrolling</span>
                    </div>
                  </motion.div>

                </div>

                {/* Floating Metrics Bubble */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-6 left-6 z-20 bg-[#070b16]/95 border border-cyan-500/40 rounded-xl px-4 py-2.5 flex items-center gap-3 backdrop-blur shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                >
                  <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  <div className="text-[10px]">
                    <p className="text-slate-400 font-medium leading-none">Next Trial Sessions</p>
                    <p className="text-white font-bold mt-1">Starting Saturday 8 AM</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-6 right-6 z-20 bg-[#070b16]/95 border border-emerald-500/40 rounded-xl px-4 py-2.5 flex items-center gap-3 backdrop-blur shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                >
                  <Trophy className="h-4 w-4 text-emerald-400" />
                  <div className="text-[10px]">
                    <p className="text-slate-400 font-medium leading-none">Championship Record</p>
                    <p className="text-white font-bold mt-1">78 Cup Wins Total</p>
                  </div>
                </motion.div>

              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* About The Club Section */}
      <section id="about" className="relative py-24 bg-[#0a0f1f]/60 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">The Training Nexus</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold">Crafting The Future of Cricket & Football</h3>
            <p className="text-slate-400">
              Apex Sports Elite is a world-class training center that integrates scientific metrics, advanced infrastructure, and custom athlete onboarding nodes. We teach sports from base fundamentals to advanced professional drills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-cyan-500/40 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-300">
                <Target className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold mb-3 text-white">Smart Coaching Protocols</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Whether mastering the straight drive in cricket or analyzing high-pressing formations in soccer, our training utilizes IoT smart bats, sensor-embedded turf balls, and play simulators to optimize skills.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
                <Users className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold mb-3 text-white">Digital Portals & Document Review</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Seamless onboarding for athletes and coaches. Our secure Firebase architecture stores profile details, certificates, documents, and keeps parent/player log records up-to-date.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-purple-500/40 transition-all duration-300 group">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-500 group-hover:text-black transition-all duration-300">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold mb-3 text-white">National Scout Pipelines</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                We coordinate regular scout matches, select state league matches, and host sports trials. Selected players receive structured pathways, dedicated management, and direct scout profile referrals.
              </p>
            </div>

          </div>

          {/* Side-by-Side Arena Highlights */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Cricket Features Card */}
            <div className="bg-gradient-to-br from-[#121324] to-[#070b16] border border-white/5 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              <span className="text-xs uppercase tracking-widest text-amber-500 font-bold">Training Fields</span>
              <h4 className="text-2xl font-extrabold mt-2 mb-6">The Cricket Academy Spec</h4>
              <ul className="space-y-4">
                {[
                  "Clay & Indoor Synthetic pitches replicating match environments",
                  "Automated bowling machines with spin & swing programming",
                  "Wearable sensors for batter posture and wrist alignment review",
                  "Regular practice league fixtures and national academy scout trials"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-400">
                    <Check className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Football Features Card */}
            <div className="bg-gradient-to-br from-[#0c1619] to-[#070b16] border border-white/5 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <span className="text-xs uppercase tracking-widest text-emerald-500 font-bold">Smart Turf</span>
              <h4 className="text-2xl font-extrabold mt-2 mb-6">The Football Academy Spec</h4>
              <ul className="space-y-4">
                {[
                  "FIFA-grade artificial grass fields for all-weather practice sessions",
                  "GPS wearable vest monitoring max speed, stamina, and heart rates",
                  "Agility grid boards measuring response and visual reaction times",
                  "Position-specific training blocks for Goalkeepers, Midfielders, & Strikers"
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-400">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-20 bg-gradient-to-b from-[#070b16] to-[#0c1224] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mx-auto mb-4">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="font-black text-3xl sm:text-4xl text-white">
                <AnimatedCounter value={1200} suffix="+" />
              </h4>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-2">Active Athletes</p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                <UserCheck className="h-5 w-5" />
              </div>
              <h4 className="font-black text-3xl sm:text-4xl text-white">
                <AnimatedCounter value={45} suffix="+" />
              </h4>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-2">Certified Coaches</p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mx-auto mb-4">
                <Trophy className="h-5 w-5" />
              </div>
              <h4 className="font-black text-3xl sm:text-4xl text-white">
                <AnimatedCounter value={78} />
              </h4>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-2">Championship Cups</p>
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mx-auto mb-4">
                <Globe className="h-5 w-5" />
              </div>
              <h4 className="font-black text-3xl sm:text-4xl text-white">
                <AnimatedCounter value={4} />
              </h4>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mt-2">Smart Facilities</p>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 bg-[#0a0f1f]/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Elite Reviews</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold">Athlete & Parent Endorsements</h3>
            <p className="text-slate-400">Discover how Apex has impacted the athletic careers of hundreds of cricket and football candidates.</p>
          </div>

          <div className="relative max-w-4xl mx-auto min-h-[250px] flex items-center justify-center">
            
            {/* Navigation Arrows */}
            <button
              onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="absolute left-0 lg:-left-16 z-20 h-12 w-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
              className="absolute right-0 lg:-right-16 z-20 h-12 w-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 sm:p-12 text-center shadow-xl backdrop-blur relative"
              >
                <div className="absolute top-6 left-6 text-slate-700 text-6xl font-serif">“</div>
                
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                <p className="text-lg sm:text-xl text-slate-200 leading-relaxed italic mb-8 relative z-10">
                  {testimonials[activeTestimonial].quote}
                </p>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-white text-base">{testimonials[activeTestimonial].author}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{testimonials[activeTestimonial].role}</p>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] text-cyan-400 border border-white/10">
                    {testimonials[activeTestimonial].sport}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Testimonial Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  activeTestimonial === idx ? "w-8 bg-cyan-400" : "w-2.5 bg-slate-700"
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Select Role / Onboarding Section */}
      <section id="onboarding" className="relative py-24 bg-[#0a0f1f]/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Secure Gateways</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold">System Access & Onboarding</h3>
            <p className="text-slate-400">Select your destination from the secure nodes below to submit credentials or update rosters.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.title}
                  whileHover={{ y: -8 }}
                  className={`bg-gradient-to-b ${role.color} border rounded-2xl p-8 flex flex-col justify-between h-full transition-all group`}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-white group-hover:text-cyan-400 transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-400">
                        {role.badge}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-extrabold text-xl text-white">{role.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{role.desc}</p>
                    </div>
                  </div>

                  <div className="pt-8">
                    <Link
                      href={role.href}
                      className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-white group-hover:text-cyan-400 transition-colors"
                    >
                      <span>{role.cta}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>



      {/* Premium Footer */}
      <footer className="bg-[#05070f] border-t border-white/5 pt-20 pb-8 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          
          {/* Col 1 */}
          <div className="md:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center">
                <Trophy className="h-4.5 w-4.5 text-black font-extrabold" />
              </div>
              <span className="font-bold text-lg text-white">APEX SPORTS ELITE</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              World-class dual-academy club system integrating scientific data tracking, certified mentoring, and streamlined application pathways for aspiring Cricket & Football professionals.
            </p>
            <div className="flex gap-4 text-xs font-semibold text-white">
              <a href="#" className="hover:text-cyan-400 transition">Twitter</a>
              <a href="#" className="hover:text-cyan-400 transition">Instagram</a>
              <a href="#" className="hover:text-cyan-400 transition">YouTube</a>
            </div>
          </div>

          {/* Col 2 */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-widest text-cyan-400">Programs</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition">Cricket Academy</a></li>
              <li><a href="#" className="hover:text-white transition">Football Academy</a></li>
              <li><a href="#" className="hover:text-white transition">Fitness Conditioning</a></li>
              <li><a href="#" className="hover:text-white transition">Scouting Tryouts</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-widest text-cyan-400">Support</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition">Parent FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Safety Rules</a></li>
              <li><a href="#" className="hover:text-white transition">Club Policies</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Support</a></li>
            </ul>
          </div>

          {/* Col 4 - Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-widest text-cyan-400">Scout Network Alerts</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Stay updated on upcoming matches, trials, scout dates, and registration openings.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 w-full"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-black text-xs font-bold rounded-lg hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Legal Footer */}
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} Apex Sports Elite. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

