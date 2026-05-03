"use client";
import { useEffect, useRef } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recRef = useRef<unknown>(null);

  useEffect(() => {
    const supported = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    setIsSupported(supported);
  }, []);

  const startListening = (onResult: (text: string) => void) => {
    if (!isSupported) { toast.error("Voice not supported in this browser. Use Chrome."); return; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "en-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const text = e.results[0][0].transcript;
      onResult(text);
      setIsListening(false);
    };
    rec.onerror = (e: SpeechRecognitionErrorEvent) => {
      toast.error(`Voice error: ${e.error}`);
      setIsListening(false);
    };
    rec.onend = () => setIsListening(false);
    recRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  const stopListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (recRef.current as any)?.stop();
    setIsListening(false);
  };

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#`]/g, ""));
    utterance.lang = "en-IN";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  return { isListening, isSupported, startListening, stopListening, speak };
}

export function MicButton({ onResult }: { onResult: (text: string) => void }) {
  const { isListening, isSupported, startListening, stopListening } = useVoice();
  if (!isSupported) return null;
  return (
    <button
      type="button"
      onClick={() => isListening ? stopListening() : startListening(onResult)}
      className={`p-2.5 rounded-xl border transition-all ${isListening ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse" : "glass border-white/10 text-slate-400 hover:text-white"}`}
      title={isListening ? "Stop listening" : "Speak your question"}
    >
      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </button>
  );
}

export function SpeakButton({ text }: { text: string }) {
  const { speak } = useVoice();
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      className="p-1 rounded-lg text-slate-500 hover:text-blue-400 transition-colors"
      title="Listen to this response"
    >
      <Volume2 className="w-3.5 h-3.5" />
    </button>
  );
}
