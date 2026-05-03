import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const firebaseId = searchParams.get("firebaseId");

    if (!firebaseId) {
      return NextResponse.json({ error: "firebaseId is required" }, { status: 400 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        completedLessons: 2,
        totalLessons: 5,
        badges: ["Registered Voter"],
      });
    }

    await connectToDatabase();
    const user = await User.findOne({ firebaseId });
    
    if (!user) {
      return NextResponse.json({
        completedLessons: 0,
        totalLessons: 5,
        badges: [],
      });
    }

    return NextResponse.json({
      completedLessons: user.progress.length,
      totalLessons: 5, // Ideally fetched from Lesson.countDocuments()
      badges: user.badges,
    });
  } catch (error) {
    console.error("Failed to fetch user progress:", error);
    return NextResponse.json({ error: "Failed to fetch user progress" }, { status: 500 });
  }
}
