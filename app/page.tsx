"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui";
import { BookOpen, MessageSquare, Calendar, ShieldCheck, Zap, Award, Globe, Mic } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

const GlobeHero = dynamic(() => import("@/components/GlobeHero"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 animate-pulse" />
    </div>
  ),
});

const FEATURES = [
  { title: "Interactive Lessons", desc: "Step-by-step guides with AI-powered quizzes after each module.", icon: <BookOpen className="w-7 h-7 text-blue-400" />, href: "/learn", color: "from-blue-500/20 to-blue-600/5" },
  { title: "Gemini AI Chat", desc: "Ask anything about elections — powered by Google Gemini AI.", icon: <MessageSquare className="w-7 h-7 text-purple-400" />, href: "/chat", color: "from-purple-500/20 to-purple-600/5" },
  { title: "Election Timeline", desc: "Track upcoming national and state election dates interactively.", icon: <Calendar className="w-7 h-7 text-cyan-400" />, href: "/timeline", color: "from-cyan-500/20 to-cyan-600/5" },
  { title: "Voter Awareness", desc: "Bust myths, know your rights, and become an informed voter.", icon: <ShieldCheck className="w-7 h-7 text-green-400" />, href: "/awareness", color: "from-green-500/20 to-green-600/5" },
  { title: "AI Quiz Generator", desc: "Auto-generated quizzes after every lesson to test your knowledge.", icon: <Zap className="w-7 h-7 text-yellow-400" />, href: "/learn", color: "from-yellow-500/20 to-yellow-600/5" },
  { title: "Badges & XP", desc: "Earn XP, unlock badges, and track your civic learning streak.", icon: <Award className="w-7 h-7 text-pink-400" />, href: "/dashboard", color: "from-pink-500/20 to-pink-600/5" },
  { title: "Simulated Voting", desc: "Experience a realistic mock election and see how votes are counted.", icon: <Globe className="w-7 h-7 text-indigo-400" />, href: "/vote-sim", color: "from-indigo-500/20 to-indigo-600/5" },
  { title: "Voice Assistant", desc: "Ask questions by voice and hear AI answers read aloud.", icon: <Mic className="w-7 h-7 text-red-400" />, href: "/chat", color: "from-red-500/20 to-red-600/5" },
];

const STATS = [
  { label: "Learning Modules", value: "5+" },
  { label: "AI Powered", value: "100%" },
  { label: "Quiz Questions", value: "20+" },
  { label: "Languages", value: "EN/HI" },
];

export default function Home() {
  return (
    <div className="relative flex flex-col items-center">
      <ParticleBackground />

      {/* ── Hero Section ──────────────────────────────────────────── */}
      <section className="relative z-10 w-full min-h-[90vh] flex flex-col lg:flex-row items-center justify-center gap-8 px-6 pt-8 pb-16 max-w-7xl mx-auto">
        {/* Text */}
        <div className="flex-1 text-center lg:text-left max-w-2xl">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Zap className="w-3 h-3" /> Powered by Google Gemini AI
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Democracy<br />
            <span className="text-gradient">Starts With</span><br />
            Knowledge
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-lg text-slate-400 mb-8 max-w-xl"
          >
            Your AI-powered election education platform. Learn, quiz yourself, and engage with democracy like never before.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link href="/learn">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base">
                <BookOpen className="w-5 h-5" /> Start Learning Free
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base">
                <MessageSquare className="w-5 h-5" /> Ask AI Assistant
              </Button>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start"
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3D Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
          className="flex-1 w-full max-w-lg h-[420px] relative"
        >
          {/* Glow behind globe */}
          <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-[80px] scale-75" />
          <GlobeHero />
        </motion.div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────────── */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-3">Everything You Need</h2>
          <p className="text-slate-400">A complete civic education platform with AI at the core.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              <Link href={f.href}>
                <div className={`glass-card p-6 rounded-2xl h-full cursor-pointer bg-gradient-to-br ${f.color} border border-white/5 hover:border-white/15 transition-all`}>
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center mb-5 border border-white/10">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────── */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card rounded-3xl p-10 text-center border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-purple-600/10"
        >
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Become an Informed Voter?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">Join thousands learning about democracy. Start your journey with our AI-powered curriculum today.</p>
          <Link href="/learn">
            <Button size="lg" className="gap-2">
              <Zap className="w-5 h-5" /> Start for Free — No signup needed
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
