"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui";
import { CheckCircle, ChevronRight, UserPlus, Megaphone, CheckSquare, BarChart, Trophy } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "sonner";

const STEPS = [
  {
    id: "registration",
    title: "Voter Registration",
    icon: <UserPlus className="w-6 h-6" />,
    content: "The first step in the election process is registering to vote. You must meet eligibility criteria such as age and citizenship. Once registered, you will be added to the electoral roll.",
  },
  {
    id: "campaign",
    title: "Political Campaigns",
    icon: <Megaphone className="w-6 h-6" />,
    content: "Candidates and political parties campaign to win the support of voters. This phase includes rallies, debates, manifestos, and advertisements to convey their vision and promises.",
  },
  {
    id: "voting",
    title: "Voting Day",
    icon: <CheckSquare className="w-6 h-6" />,
    content: "On election day, registered voters go to polling stations to cast their ballots securely. Electronic Voting Machines (EVMs) or paper ballots are typically used to record votes confidentially.",
  },
  {
    id: "counting",
    title: "Vote Counting",
    icon: <BarChart className="w-6 h-6" />,
    content: "After voting concludes, the ballots are securely transported and counted under strict supervision. Representatives from political parties often oversee the process to ensure transparency.",
  },
  {
    id: "results",
    title: "Declaration of Results",
    icon: <Trophy className="w-6 h-6" />,
    content: "Once counting is complete, the election commission officially declares the results. The candidate or party with the most votes wins and forms the government or takes the designated office.",
  }
];

export default function LearnPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const handleNext = () => {
    const currentStepId = STEPS[currentStepIndex].id;
    if (!completedSteps.includes(currentStepId)) {
      setCompletedSteps([...completedSteps, currentStepId]);
      toast.success(`Completed: ${STEPS[currentStepIndex].title}`, {
        description: "Your progress has been saved.",
      });
      // In a real app, send a POST request to /api/progress here
    }
    
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      toast.success("Module Completed!", {
        description: "You've finished the election process guide.",
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">The Election Process</h1>
          <p className="text-slate-400">Step-by-step guide to understanding how elections work.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar / Progress */}
          <div className="w-full md:w-1/3 space-y-2">
            {STEPS.map((step, idx) => {
              const isCompleted = completedSteps.includes(step.id);
              const isActive = idx === currentStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-colors ${
                    isActive ? "bg-blue-600/20 border border-blue-500/50 text-white" : 
                    isCompleted ? "glass text-slate-300" : "glass opacity-60 text-slate-500"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? "bg-blue-600" : "bg-[#121c33]"}`}>
                    {step.icon}
                  </div>
                  <span className="font-medium flex-grow">{step.title}</span>
                  {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                </button>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-card p-8 rounded-2xl min-h-[400px] flex flex-col"
              >
                <div className="bg-blue-600/20 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
                  {STEPS[currentStepIndex].icon}
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  {STEPS[currentStepIndex].title}
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed flex-grow">
                  {STEPS[currentStepIndex].content}
                </p>
                
                <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/10">
                  <div className="text-sm text-slate-400">
                    Step {currentStepIndex + 1} of {STEPS.length}
                  </div>
                  <Button onClick={handleNext} className="gap-2">
                    {currentStepIndex === STEPS.length - 1 ? "Finish Module" : "Continue"}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
