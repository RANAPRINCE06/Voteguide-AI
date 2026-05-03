import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import { z } from "zod";

export const dynamic = "force-dynamic";

const progressSchema = z.object({
  firebaseId: z.string().min(1, "Firebase ID is required"),
  lessonId: z.string().min(1, "Lesson ID is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Zod Validation
    const validationResult = progressSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { firebaseId, lessonId } = validationResult.data;

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ success: true, message: "Progress updated (dummy)" });
    }

    await connectToDatabase();
    
    // Find user and update progress
    let user = await User.findOne({ firebaseId });
    if (!user) {
      // If user doesn't exist, create a new one
      user = new User({
        firebaseId,
        name: "User", // Normally we'd get this from auth context token
        email: "unknown@example.com", 
        progress: [lessonId],
        badges: []
      });
      await user.save();
    } else {
      if (!user.progress.includes(lessonId)) {
        user.progress.push(lessonId);
        
        // Simple badge logic
        if (user.progress.length === 1 && !user.badges.includes("First Step")) {
          user.badges.push("First Step");
        }
        if (user.progress.length === 5 && !user.badges.includes("Election Expert")) {
          user.badges.push("Election Expert");
        }
        
        await user.save();
      }
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Failed to update progress:", error);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
