import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";

export const dynamic = "force-dynamic";

// Fallback data if database is not configured
const DUMMY_EVENTS = [
  { _id: "1", title: "National General Election", date: new Date("2024-11-05").toISOString(), type: "national", description: "Voting for the President, Senate, and House of Representatives." },
  { _id: "2", title: "State Assembly Elections", date: new Date("2024-05-15").toISOString(), type: "state", description: "Elections for the state legislative assembly." },
  { _id: "3", title: "Voter Registration Deadline", date: new Date("2024-10-07").toISOString(), type: "national", description: "Last day to register to vote in the upcoming general election." },
  { _id: "4", title: "Early Voting Begins", date: new Date("2024-10-21").toISOString(), type: "state", description: "In-person early voting opens at designated polling stations." },
];

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn("MONGODB_URI not set, returning dummy events");
      return NextResponse.json(DUMMY_EVENTS);
    }

    await connectToDatabase();
    const events = await Event.find({}).sort({ date: 1 });
    
    // If DB is empty, return dummy data for demonstration purposes
    if (events.length === 0) {
      return NextResponse.json(DUMMY_EVENTS);
    }
    
    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
