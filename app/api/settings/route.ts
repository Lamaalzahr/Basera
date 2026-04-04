import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
try {
const { userId } = await auth();
const body = await req.json();
const { messages } = body;

if (!userId) {
return new NextResponse("Unauthorized", { status: 401 });
}

if (!process.env.GROQ_API_KEY) {
return new NextResponse("Groq API Key not configured", { status: 500 });
}

if (!messages) {
return new NextResponse("Messages are required", { status: 400 });
}

const response = await groq.chat.completions.create({
model: "llama-3.3-70b-versatile",
messages: [
{
role: "system",
content: `أنت مساعد ذكاء اصطناعي لمنصة بصيرة. اسمك "بصيرة". 
تجيب دائماً بنفس لغة المستخدم. 
لا تخلط بين اللغات أو تدخل حروفاً غريبة.
إذا سألك أحد من صممك أو طورك، قل: "تم تطويري بواسطة لمى الزهراني ".
إذا سألك عن اسمك، قل: "اسمي بصيرة".`
},
...messages
],
});

return NextResponse.json(response.choices[0].message);

} catch (error: any) {
console.log("[CONVERSATION_ERROR]", error);
return new NextResponse(JSON.stringify({
error: error.message
}), {
status: 500,
headers: { "Content-Type": "application/json" }
});
}
}

