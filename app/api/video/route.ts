import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { checkRateLimit } from "@/lib/rateLimit";


fal.config({
credentials: process.env.FAL_KEY,
});

export async function POST(req: Request) {
try {
const { userId } = await auth();
const body = await req.json();
const { messages } = body;

if (!userId) return new NextResponse("Unauthorized", { status: 401 });
const { allowed, remaining } = await checkRateLimit(userId, "video");
if (!allowed) {
return new NextResponse("Free limit reached", { status: 403 });
}

if (!process.env.FAL_KEY)
return new NextResponse("FAL API Key not configured", { status: 500 });

if (!messages || messages.length === 0)
return new NextResponse("Messages are required", { status: 400 });

const prompt = messages[messages.length - 1].content;

const result = await fal.subscribe("fal-ai/kling-video/v1/standard/text-to-video", {
input: { prompt },
});

const videoUrl = (result as any)?.video?.url 
?? (result as any)?.output?.video?.url
?? (result as any)?.data?.video?.url;

if (!videoUrl) {
throw new Error("Failed to generate video");
}

return NextResponse.json({
role: "assistant",
content: videoUrl,
});

} catch (error: any) {
console.log("[VIDEO_ERROR]", error);
return new NextResponse(
JSON.stringify({ error: error.message }),
{
status: 500,
headers: { "Content-Type": "application/json" },
}
);
}
}