"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui";
import { motion } from "framer-motion";
import { Vote, CheckCircle, User, Trophy, BarChart2 } from "lucide-react";

const CANDIDATES = [
  { id: "A", name: "Arjun Sharma", party: "People's Democratic Party", symbol: "🌳", color: "from-green-500 to-emerald-600", policy: "Focus on rural development, farmer welfare, and clean energy." },
  { id: "B", name: "Priya Mehta", party: "Progressive Alliance", symbol: "⭐", color: "from-blue-500 to-blue-600", policy: "Education reform, women empowerment, and digital India initiatives." },
  { id: "C", name: "Rajan Patel", party: "National Unity Front", symbol: "🏛️", color: "from-orange-500 to-red-500", policy: "Economic growth, infrastructure development, and national security." },
];

const VOTER_EDUCATION = [
  "You can only vote once per election.",
  "Your vote is completely secret — no one can see who you voted for.",
  "EVM machines are not connected to the internet and cannot be hacked remotely.",
  "You have the right to cast a NOTA (None of the Above) vote.",
];

export default function VoteSimPage() {
  const [voted, setVoted] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Simulated vote counts
  const BASE = { A: 4821, B: 3956, C: 2744 };
  const results = voted ? { ...BASE, [voted]: BASE[voted as keyof typeof BASE] + 1 } : BASE;
  const total = Object.values(results).reduce((a, b) => a + b, 0);

  const winner = Object.entries(results).sort((a, b) => b[1] - a[1])[0];
  const winnerCandidate = CANDIDATES.find((c) => c.id === winner[0])!;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gradient mb-3 flex items-center justify-center gap-3">
            <Vote className="w-10 h-10 text-blue-500" /> Simulated Election
          </h1>
          <p className="text-slate-400">Experience how a real election works. Cast your vote for a fictional candidate.</p>
          <div className="inline-flex items-center gap-2 mt-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs px-3 py-1.5 rounded-full">
            ⚠️ This is a simulation for educational purposes only
          </div>
        </motion.div>

        {!showResults ? (
          <>
            {/* Candidates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {CANDIDATES.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <button
                    onClick={() => !confirmed && setVoted(c.id)}
                    disabled={confirmed}
                    className={`w-full text-left glass-card rounded-2xl p-6 border-2 transition-all ${
                      voted === c.id ? "border-blue-500 bg-blue-500/10" : "border-white/10 hover:border-white/30"
                    } ${confirmed ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-3xl mb-4`}>
                      {c.symbol}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{c.name}</h3>
                    <p className="text-xs text-slate-400 mb-3 font-medium">{c.party}</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{c.policy}</p>
                    {voted === c.id && (
                      <div className="mt-3 flex items-center gap-1.5 text-blue-400 text-sm font-semibold">
                        <CheckCircle className="w-4 h-4" /> Selected
                      </div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Voting booth */}
            {voted && !confirmed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6 mb-6 border border-blue-500/30 text-center">
                <p className="text-slate-300 mb-4">
                  You are about to vote for <strong className="text-white">{CANDIDATES.find(c => c.id === voted)?.name}</strong>. This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => setVoted(null)} variant="outline" size="sm">Change Selection</Button>
                  <Button onClick={() => setConfirmed(true)} size="sm" className="gap-2">
                    <Vote className="w-4 h-4" /> Cast My Vote
                  </Button>
                </div>
              </motion.div>
            )}

            {confirmed && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="glass-card rounded-2xl p-8 text-center border border-green-500/30 mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Vote Cast Successfully! 🎉</h2>
                <p className="text-slate-400 mb-6">Your vote has been recorded securely. Thank you for participating in democracy!</p>
                <Button onClick={() => setShowResults(true)} className="gap-2">
                  <BarChart2 className="w-4 h-4" /> See Election Results
                </Button>
              </motion.div>
            )}

            {/* Education tips */}
            <div className="glass rounded-2xl p-5 border border-white/10">
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2"><User className="w-4 h-4 text-blue-400" /> Did You Know?</h3>
              <ul className="space-y-2">
                {VOTER_EDUCATION.map((tip, i) => (
                  <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>{tip}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          /* Results screen */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass-card rounded-3xl p-8 text-center border border-yellow-500/30">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Election Results</h2>
              <p className="text-slate-400">Winner: <strong className="text-white">{winnerCandidate.name}</strong> — {winnerCandidate.party}</p>
            </div>
            {CANDIDATES.map((c) => {
              const count = results[c.id as keyof typeof results];
              const pct = Math.round((count / total) * 100);
              return (
                <div key={c.id} className="glass-card rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="mr-2">{c.symbol}</span>
                      <span className="font-semibold text-white">{c.name}</span>
                      <span className="text-slate-400 text-sm ml-2">{c.party}</span>
                    </div>
                    <span className="font-bold text-white">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.2 }}
                      className={`h-3 rounded-full bg-gradient-to-r ${c.color}`}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{count.toLocaleString()} votes {voted === c.id && <span className="text-blue-400 ml-2">(including yours ✓)</span>}</p>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </ProtectedRoute>
  );
}
