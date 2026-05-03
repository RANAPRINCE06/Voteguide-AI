"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, User as UserIcon, Bot, Sparkles } from "lucide-react";
import { Button, Input } from "@/components/ui";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MicButton, SpeakButton } from "@/hooks/useVoice";

interface Message { role: "user" | "assistant"; content: string; }

const SUGGESTED_QUESTIONS = [
  "How do I register to vote in India?",
  "What is NOTA and when can I use it?",
  "How are EVMs kept secure from hacking?",
  "What is the Model Code of Conduct?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMessage: Message = { role: "user", content: text };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "Sorry, I had trouble with that." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Connection error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-8 px-4 h-[calc(100vh-8rem)] flex flex-col">
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold text-gradient flex items-center justify-center gap-2">
            <Sparkles className="w-7 h-7 text-purple-500" /> AI Election Assistant
          </h1>
          <p className="text-slate-400 text-sm mt-1">Powered by Google Gemini • Ask anything about elections 🗳️</p>
        </div>

        <div className="flex-grow glass-card rounded-2xl flex flex-col overflow-hidden">
          <div className="flex-grow p-5 overflow-y-auto space-y-5">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center mb-5 border border-purple-500/30">
                  <Bot className="w-10 h-10 text-purple-400" />
                </div>
                <p className="text-slate-300 max-w-sm mb-7 text-base">Hello! I am VoteGuide AI. Ask me anything about elections, voting, or civic rights — by text or voice!</p>
                <div className="flex flex-wrap justify-center gap-2 max-w-xl">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button key={i} onClick={() => sendMessage(q)}
                      className="text-xs bg-slate-800/60 hover:bg-purple-600/20 border border-slate-700 hover:border-purple-500/60 text-slate-300 px-4 py-2 rounded-full transition-all hover:text-white">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-blue-600" : "bg-purple-600"}`}>
                  {msg.role === "user" ? <UserIcon className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={`max-w-[78%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap group ${
                  msg.role === "user" ? "bg-blue-600/20 border border-blue-500/30 text-white rounded-tr-sm" : "glass rounded-tl-sm text-slate-200"
                }`}>
                  {msg.content}
                  {msg.role === "assistant" && (
                    <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <SpeakButton text={msg.content} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div>
                <div className="glass p-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10 bg-slate-950/50">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about elections, voting, civic rights..." className="flex-grow bg-slate-800/60" disabled={isLoading} />
              <MicButton onResult={(text) => sendMessage(text)} />
              <Button type="submit" disabled={isLoading || !input.trim()} className="shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
