import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { generateText, type CoreMessage } from "ai";

// ─── In-memory rate limiter ────────────────────────────────────────────────────
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 15;

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are VoteGuide AI, a helpful, neutral, and highly knowledgeable assistant designed to educate users about the election process.
Provide clear, beginner-friendly explanations about voter registration, campaign rules, voting procedures, and general democratic principles.
Do not show bias towards any political party, candidate, or ideology.
If asked for political opinions or who to vote for, politely decline and emphasize your role as an educational tool.
Keep your answers concise, well-structured, and easy to read. Use bullet points where helpful.
Always be encouraging and supportive of civic participation.`;

// ─── Keyword fallback answers (works without API key) ─────────────────────────
const FALLBACK_ANSWERS: Record<string, string> = {
  register:
    "**How to Register to Vote:**\n\n• Check your eligibility (age 18+, citizenship, residency)\n• Visit your state/country's official election website\n• Fill out the voter registration form with your ID details\n• Submit before the registration deadline\n• Verify your registration is confirmed via SMS/email\n\n📋 Carry a valid government ID and proof of address.",
  vote:
    "**What Happens on Voting Day:**\n\n• Find your assigned polling station (check your registration card)\n• Bring a valid photo ID\n• Sign the electoral roll at the booth\n• Receive your ballot paper\n• Mark your choice privately in the voting booth\n• Submit your ballot securely in the ballot box\n\n🕐 Polls are typically open from 7 AM to 6 PM.",
  count:
    "**How Votes Are Counted:**\n\n• Ballot boxes are sealed and transported to counting centres under guard\n• Party representatives and observers witness the count\n• Ballots are sorted, tallied, and verified\n• A recount is conducted if margins are very close\n• The Returning Officer officially declares the winner\n\n✅ The process is transparent and multi-party supervised.",
  campaign:
    '**How Political Campaigns Work:**\n\n• Candidates officially declare their candidacy\n• They campaign through rallies, debates, and media\n• A manifesto (policy document) is released to voters\n• Campaign spending is regulated by election laws\n• A "code of conduct" period begins close to election day\n\n🗳️ Voters are encouraged to research all candidates.',
  default:
    "I'm **VoteGuide AI** 🗳️ — your election education assistant!\n\nI can help you understand:\n• **Voter Registration** — how and when to register\n• **Campaigns** — how candidates compete for votes\n• **Voting Day** — what to expect at the polling station\n• **Vote Counting** — how results are verified\n• **Election Results** — how winners are declared\n\nTry asking: *\"How do I register to vote?\"* or *\"What happens on voting day?\"*",
};

function getFallbackResponse(message: string): string {
  const msg = message.toLowerCase();
  if (msg.includes("register") || msg.includes("sign up") || msg.includes("enroll"))
    return FALLBACK_ANSWERS.register;
  if (msg.includes("vote") || msg.includes("ballot") || msg.includes("polling") || msg.includes("booth"))
    return FALLBACK_ANSWERS.vote;
  if (msg.includes("count") || msg.includes("result") || msg.includes("tally") || msg.includes("winner"))
    return FALLBACK_ANSWERS.count;
  if (msg.includes("campaign") || msg.includes("candidate") || msg.includes("party") || msg.includes("manifesto"))
    return FALLBACK_ANSWERS.campaign;
  return FALLBACK_ANSWERS.default;
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const now = Date.now();
    const userLimit = rateLimit.get(ip);

    if (userLimit && now - userLimit.timestamp < RATE_LIMIT_WINDOW) {
      if (userLimit.count >= MAX_REQUESTS) {
        return NextResponse.json(
          { reply: "⚠️ Too many messages. Please wait a minute before trying again." },
          { status: 429 }
        );
      }
      userLimit.count++;
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    // 2. Parse request body
    const body: { messages?: { role: string; content: string }[]; message?: string } =
      await req.json();

    const rawMessages = body.messages ?? [];
    const lastUserMsg =
      rawMessages.filter((m) => m.role === "user").at(-1)?.content ??
      body.message ??
      "";

    if (!lastUserMsg.trim()) {
      return NextResponse.json({ reply: "Please type a question to get started!" });
    }

    // 3. Use Google Gemini if key is configured
    const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (geminiKey) {
      try {
        // Convert to CoreMessage format for the AI SDK
        const coreMessages: CoreMessage[] = rawMessages
          .slice(-10) // keep last 10 messages for context
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));

        // Ensure the last message is from the user
        if (coreMessages.length === 0 || coreMessages.at(-1)?.role !== "user") {
          coreMessages.push({ role: "user", content: lastUserMsg });
        }

        const { text } = await generateText({
          model: google("gemini-2.0-flash"),
          system: SYSTEM_PROMPT,
          messages: coreMessages,
          maxTokens: 800,
        });

        return NextResponse.json({ reply: text, role: "assistant" });
      } catch (geminiError) {
        const errMsg = geminiError instanceof Error ? geminiError.message : String(geminiError);
        console.error("Gemini API error:", errMsg);
        // Fall through to keyword fallback
      }
    }

    // 4. Keyword-based offline fallback
    const fallbackReply = getFallbackResponse(lastUserMsg);
    return NextResponse.json({ reply: fallbackReply, role: "assistant" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Chat API error:", errMsg);
    return NextResponse.json(
      { reply: "⚠️ Something went wrong on my end. Please try again." },
      { status: 500 }
    );
  }
}
