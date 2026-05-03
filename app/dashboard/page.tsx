"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Award, BookOpen, Activity, LogOut, Link2 } from "lucide-react";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import Link from "next/link";

interface Progress {
  completedLessons: number;
  totalLessons: number;
  badges: string[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching progress — replace with real /api/user-progress call
    const timer = setTimeout(() => {
      setProgress({
        completedLessons: 2,
        totalLessons: 5,
        badges: ["Registered Voter", "Early Learner"],
      });
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  const completionPercentage = progress
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0;

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-12 px-4">

        {/* ── Profile Card ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6"
        >
          {/* Profile picture */}
          <div className="relative shrink-0">
            {user?.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName ?? "Profile"}
                width={88}
                height={88}
                className="rounded-full ring-4 ring-blue-500/40"
              />
            ) : (
              <div className="w-22 h-22 w-[88px] h-[88px] rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-blue-500/40">
                {user?.displayName?.charAt(0)?.toUpperCase() ??
                  user?.email?.charAt(0)?.toUpperCase() ??
                  "U"}
              </div>
            )}
            {/* Online indicator */}
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0f172a]" />
          </div>

          {/* User info */}
          <div className="flex-grow text-center sm:text-left">
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, {user?.displayName?.split(" ")[0] ?? "Voter"}! 👋
            </h1>
            <p className="text-slate-400 text-sm mb-1">{user?.email}</p>
            <p className="text-slate-500 text-xs">Track your learning progress and achievements.</p>
          </div>

          {/* Sign out button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="shrink-0 gap-2 text-red-400 border-red-500/30 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </motion.div>

        {/* ── Stats Cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Lessons Completed</p>
                <h3 className="text-2xl font-bold text-white">
                  {progress?.completedLessons} / {progress?.totalLessons}
                </h3>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-gradient-to-r from-blue-500 to-blue-400 h-2.5 rounded-full"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">{completionPercentage}% complete</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-2xl flex items-center gap-4"
          >
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Badges Earned</p>
              <h3 className="text-2xl font-bold text-white">{progress?.badges.length ?? 0}</h3>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-2xl flex items-center gap-4"
          >
            <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-400">Status</p>
              <h3 className="text-xl font-bold text-white">Active Learner</h3>
            </div>
          </motion.div>
        </div>

        {/* ── Quick Actions ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href="/learn">
            <Button size="sm" className="gap-2">
              <BookOpen className="w-4 h-4" /> Continue Learning
            </Button>
          </Link>
          <Link href="/chat">
            <Button size="sm" variant="outline" className="gap-2">
              <Link2 className="w-4 h-4" /> Ask AI Assistant
            </Button>
          </Link>
        </div>

        {/* ── Badges ────────────────────────────────────────────────── */}
        <h2 className="text-2xl font-bold text-white mb-6">Your Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {progress?.badges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx }}
              className="glass p-4 rounded-xl flex flex-col items-center justify-center text-center gap-3 border border-purple-500/30 hover:border-purple-500/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-blue-500/30 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <span className="font-medium text-sm text-slate-200">{badge}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
