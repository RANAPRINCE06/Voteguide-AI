"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";

interface Event {
  _id: string;
  title: string;
  date: string;
  type: "national" | "state";
  description: string;
}

export default function TimelinePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<"all" | "national" | "state">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => filter === "all" ? true : e.type === filter);

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Election Timeline</h1>
          <p className="text-slate-400">Stay updated with upcoming national and state elections.</p>
        </div>

        <div className="flex justify-center gap-4 mb-12">
          <Button 
            variant={filter === "all" ? "primary" : "outline"} 
            onClick={() => setFilter("all")}
            size="sm"
          >
            All Events
          </Button>
          <Button 
            variant={filter === "national" ? "primary" : "outline"} 
            onClick={() => setFilter("national")}
            size="sm"
          >
            National
          </Button>
          <Button 
            variant={filter === "state" ? "primary" : "outline"} 
            onClick={() => setFilter("state")}
            size="sm"
          >
            State
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative border-l border-slate-700 ml-4 md:mx-auto md:w-full md:max-w-3xl">
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="mb-10 ml-6 relative"
              >
                <span className="absolute -left-[35px] flex items-center justify-center w-8 h-8 rounded-full bg-[#0f172a] border border-blue-500">
                  {event.type === "national" ? (
                    <MapPin className="w-4 h-4 text-blue-400" />
                  ) : (
                    <CalendarIcon className="w-4 h-4 text-purple-400" />
                  )}
                </span>
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                      event.type === "national" ? "bg-blue-500/20 text-blue-300" : "bg-purple-500/20 text-purple-300"
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  <time className="block mb-3 text-sm font-normal leading-none text-slate-400">
                    {new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                  <p className="text-slate-300 text-sm">{event.description}</p>
                </div>
              </motion.div>
            ))}
            
            {filteredEvents.length === 0 && (
              <div className="text-center text-slate-400 py-10">
                No events found for this filter.
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
