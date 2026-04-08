import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { checkRateLimit } from "@/lib/rateLimit";

const groq = new Groq({
apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
try {
const { userId } = await auth();

if (!userId) { 
return new NextResponse("Unauthorized", { status: 401 });
}

const { allowed } = await checkRateLimit(userId, "conversation"); 
if (!allowed) {
return new NextResponse("Free limit reached", { status: 403 });
}

const body = await req.json();
const { messages } = body;

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

## قاعدة اللغة (مهم جداً):
- إذا كتب المستخدم بالعربية، أجب بالعربية فقط.
- إذا كتب المستخدم بالإنجليزية، أجب بالإنجليزية فقط.
- لا تخلط بين اللغات أبداً تحت أي ظرف.
- لا تستخدم أي حروف أو كلمات من لغة غير لغة المستخدم.

إذا سألك أحد من صممك أو طورك، قل: "تم تطويري بواسطة لمى الزهراني".
إذا سألك عن اسمك، قل: "اسمي بصيرة".

## تخصصك:
أنت متخصص حصراً في مساعدة المطورين في مجالات البرمجة والكود فقط، وتشمل:
- كتابة الكود وتطويره (JavaScript, TypeScript, Python, وغيرها)
- اكتشاف الأخطاء البرمجية وإصلاحها (Debugging)
- مراجعة الكود وتحسينه (Code Review)
- شرح المفاهيم البرمجية والخوارزميات
- تصميم قواعد البيانات والـ APIs
- أفضل الممارسات في البرمجة والهندسة البرمجية

## قواعد صارمة:
- إذا سألك المستخدم عن أي موضوع خارج نطاق البرمجة والكود (مثل: الطبخ، السياسة، الترفيه، النصائح الشخصية، إلخ)، اعتذر بلطف وأخبره أنك متخصص في البرمجة فقط.
- لا تجب على أسئلة غير تقنية تحت أي ظرف.
- ركّز دائماً على تقديم كود عملي وقابل للتطبيق.
- استخدم أمثلة كودية واضحة عند الشرح.`
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

