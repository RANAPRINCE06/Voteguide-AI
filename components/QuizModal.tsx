"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui";
import { toast } from "sonner";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizModalProps {
  lessonTitle: string;
  lessonId: string;
  onClose: () => void;
  onXPEarned: (xp: number) => void;
}

export default function QuizModal({ lessonTitle, onClose, onXPEarned }: QuizModalProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  // Fetch quiz questions on mount
  useEffect(() => {
    fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: lessonTitle }),
    })
      .then((r) => r.json())
      .then((d) => {
        setQuestions(d.questions ?? []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Could not load quiz");
        onClose();
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonTitle]);

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === questions[current].correct;

    setTimeout(() => {
      const newAnswers = [...answers, correct];
      if (current + 1 >= questions.length) {
        setAnswers(newAnswers);
        setDone(true);
        const xp = newAnswers.filter(Boolean).length * 20;
        onXPEarned(xp);
      } else {
        setAnswers(newAnswers);
        setCurrent(current + 1);
        setSelected(null);
      }
    }, 1200);
  };

  const score = answers.filter(Boolean).length;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card rounded-3xl p-8 max-w-2xl w-full relative border border-white/10 shadow-2xl"
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-300">Generating quiz with AI...</p>
            </div>
          ) : done ? (
            <div className="text-center py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
              <p className="text-5xl font-black text-gradient mb-4">
                {score}/{questions.length}
              </p>
              <p className="text-slate-300 mb-2">+{score * 20} XP Earned! 🎉</p>
              <div className="flex gap-3 justify-center mt-6">
                <Button onClick={onClose}>Continue Learning</Button>
              </div>
            </div>
          ) : questions.length > 0 ? (
            <>
              {/* Progress dots */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-slate-400">
                  Question {current + 1} of {questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < current
                          ? "bg-green-500"
                          : i === current
                          ? "bg-blue-500"
                          : "bg-slate-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-6">
                {questions[current].question}
              </h3>

              <div className="space-y-3">
                {questions[current].options.map((opt, i) => {
                  let cls =
                    "glass border border-white/10 text-slate-200 hover:bg-white/10 cursor-pointer";
                  if (selected !== null) {
                    if (i === questions[current].correct)
                      cls = "bg-green-500/20 border-green-500 text-green-300";
                    else if (i === selected)
                      cls = "bg-red-500/20 border-red-500 text-red-300";
                    else cls = "opacity-40 border-white/5 text-slate-500";
                  }
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className={`w-full text-left px-5 py-3.5 rounded-xl border transition-all flex items-center gap-3 ${cls}`}
                    >
                      {selected !== null && i === questions[current].correct && (
                        <CheckCircle className="w-4 h-4 shrink-0 text-green-400" />
                      )}
                      {selected !== null &&
                        i === selected &&
                        i !== questions[current].correct && (
                          <XCircle className="w-4 h-4 shrink-0 text-red-400" />
                        )}
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-sm text-slate-300 glass rounded-xl px-4 py-3"
                >
                  💡 {questions[current].explanation}
                </motion.p>
              )}
            </>
          ) : (
            <p className="text-center text-slate-400 py-8">No questions available.</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
