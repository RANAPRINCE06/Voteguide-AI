"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const MYTHS = [
  {
    myth: "My vote doesn't make a difference.",
    fact: "Every vote counts! Many local and state elections have been decided by a handful of votes. Your voice shapes your community.",
  },
  {
    myth: "I can't vote if I'm a college student living away from home.",
    fact: "You can usually choose to register either at your college address or your permanent home address, depending on state laws.",
  },
  {
    myth: "Electronic voting machines are easily hacked.",
    fact: "Modern EVMs are standalone machines not connected to the internet, making them highly secure against remote hacking attempts.",
  }
];

export default function MythFactCards() {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {MYTHS.map((item, idx) => (
        <div 
          key={idx}
          className="perspective-1000 h-64 cursor-pointer"
          onMouseEnter={() => setFlippedIndex(idx)}
          onMouseLeave={() => setFlippedIndex(null)}
        >
          <motion.div
            initial={false}
            animate={{ rotateY: flippedIndex === idx ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full relative preserve-3d"
          >
            {/* Front - Myth */}
            <div className="absolute w-full h-full backface-hidden glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-red-500/20">
              <div className="bg-red-500/20 px-3 py-1 rounded-full text-red-400 text-sm font-semibold mb-4 uppercase tracking-wider">Myth</div>
              <p className="text-lg text-slate-200 font-medium">{item.myth}</p>
              <p className="text-sm text-slate-500 mt-4">Hover to reveal fact</p>
            </div>

            {/* Back - Fact */}
            <div 
              className="absolute w-full h-full backface-hidden glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-green-500/30"
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="bg-green-500/20 px-3 py-1 rounded-full text-green-400 text-sm font-semibold mb-4 uppercase tracking-wider">Fact</div>
              <p className="text-md text-slate-200 leading-relaxed">{item.fact}</p>
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
