import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";


export async function POST(req: Request) {
try {
const { userId } = await auth();
const body = await req.json();
const { messages, amount = 1, resolution = "512x512" } = body;

if (!userId) {
return new NextResponse("Unauthorized", { status: 401 });
}

const { allowed } = await checkRateLimit(userId, "conversation"); 
if (!allowed) {
return new NextResponse("Free limit reached", { status: 403 });
}

if (!process.env.HUGGINGFACE_API_KEY) {
return new NextResponse("Hugging Face API Key not configured", { status: 500 });
}

if (!messages) {
return new NextResponse("Messages are required", { status: 400 });
}

const prompt = messages[messages.length - 1].content;

const response = await fetch(
"https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
{
method: "POST",
headers: {
Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
"Content-Type": "application/json",
},
body: JSON.stringify({ inputs: prompt }),
}
);

if (!response.ok) {
const error = await response.text();
throw new Error(error);
}

const imageBlob = await response.arrayBuffer();
const base64 = Buffer.from(imageBlob).toString("base64");
const imageUrl = `data:image/png;base64,${base64}`;

return NextResponse.json({ role: "assistant", content: imageUrl });

} catch (error: any) {
console.log("[IMAGE_ERROR]", error);
return new NextResponse(JSON.stringify({
error: error.message
}), {
status: 500,
headers: { "Content-Type": "application/json" }
});
}
}