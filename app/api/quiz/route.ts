import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();
    if (!topic) return NextResponse.json({ error: "Topic required" }, { status: 400 });

    const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!geminiKey) {
      // Fallback quiz
      return NextResponse.json({ questions: getFallbackQuiz(topic) });
    }

    const prompt = `Generate exactly 4 multiple-choice quiz questions about "${topic}" in the context of the election process and civic education.

Return ONLY a valid JSON array with this exact structure (no markdown, no explanation, just JSON):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Brief explanation of the correct answer."
  }
]

Rules:
- correct is the 0-based index of the correct option
- Make questions beginner-friendly
- Focus on Indian/general election process
- Options should be plausible but only one correct`;

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      prompt,
      maxTokens: 1200,
    });

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    
    const questions = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json({ questions: getFallbackQuiz("elections") });
  }
}

function getFallbackQuiz(topic: string) {
  return [
    {
      question: `What is the minimum voting age in most democracies, including India?`,
      options: ["16 years", "18 years", "21 years", "25 years"],
      correct: 1,
      explanation: "In India, the minimum voting age is 18 years, established by the 61st Constitutional Amendment in 1989.",
    },
    {
      question: `Which body conducts general elections in India?`,
      options: ["Supreme Court", "Parliament", "Election Commission of India", "President's Office"],
      correct: 2,
      explanation: "The Election Commission of India (ECI) is an autonomous constitutional authority responsible for administering elections.",
    },
    {
      question: `What does EVM stand for in Indian elections?`,
      options: ["Electronic Voting Machine", "Election Verification Method", "Electoral Vote Monitor", "Electronic Voter Module"],
      correct: 0,
      explanation: "EVM stands for Electronic Voting Machine, used in Indian elections since the 1990s for secure, efficient voting.",
    },
    {
      question: `How often are general elections held in India?`,
      options: ["Every 3 years", "Every 4 years", "Every 5 years", "Every 6 years"],
      correct: 2,
      explanation: `India holds general elections every 5 years to elect members of the Lok Sabha, the lower house of Parliament. The topic "${topic}" relates to this democratic cycle.`,
    },
  ];
}
