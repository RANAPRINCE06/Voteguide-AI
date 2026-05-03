"use client";

import { AlertTriangle, CheckCircle } from "lucide-react";
import dynamic from "next/dynamic";

const MythFactCards = dynamic(() => import("@/components/MythFactCards"), {
  loading: () => <div className="h-64 flex items-center justify-center glass rounded-2xl animate-pulse">Loading cards...</div>,
  ssr: false
});

export default function AwarenessPage() {

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Voter Awareness</h1>
        <p className="text-slate-400">Know your rights, understand the rules, and bust common myths.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="glass-card p-8 rounded-2xl border-t-4 border-t-green-500">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl font-bold text-white">The Do's</h2>
          </div>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              Verify your name on the electoral roll before election day.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              Carry a valid photo ID to the polling station.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              Read the manifestos of candidates to make an informed choice.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              Report any suspicious activity or bribery attempts to officials.
            </li>
          </ul>
        </div>

        <div className="glass-card p-8 rounded-2xl border-t-4 border-t-red-500">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-bold text-white">The Don'ts</h2>
          </div>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              Do not accept money, gifts, or favors in exchange for your vote.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              Do not take photos or videos inside the polling booth.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              Do not vote if you are not eligible or if you have already voted.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-1">•</span>
              Do not campaign within 100 meters of the polling station on election day.
            </li>
          </ul>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-center text-white mb-8">Myths vs Facts</h2>
      <MythFactCards />
    </div>
  );
}
