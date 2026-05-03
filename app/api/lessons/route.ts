import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Lesson from "@/models/Lesson";

export const dynamic = "force-dynamic";

const DUMMY_LESSONS = [
  { _id: "1", title: "Voter Registration", description: "Learn how to register.", order: 1, icon: "UserPlus" },
  { _id: "2", title: "Campaigns", description: "Understand political campaigns.", order: 2, icon: "Megaphone" },
];

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(DUMMY_LESSONS);
    }
    
    await connectToDatabase();
    const lessons = await Lesson.find({}).sort({ order: 1 });
    
    if (lessons.length === 0) {
      return NextResponse.json(DUMMY_LESSONS);
    }
    
    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Failed to fetch lessons:", error);
    return NextResponse.json({ error: "Failed to fetch lessons" }, { status: 500 });
  }
}
