import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

const MAX_VISITS = 5;

export async function GET(req: Request) {
try {
const { userId } = await auth();

if (!userId) {
return new NextResponse("Unauthorized", { status: 401 });
}

const { searchParams } = new URL(req.url);
const page = searchParams.get("page");

if (!page) {
return new NextResponse("Page is required", { status: 400 });
}

const record = await prisma.rateLimit.findUnique({
where: {
identifier_page: { identifier: userId, page },
},
});

const count = record?.count ?? 0;
const remaining = Math.max(0, MAX_VISITS - count);

return NextResponse.json({ count, remaining, max: MAX_VISITS });

} catch (error) {
console.log("[LIMIT_ERROR]", error);
return new NextResponse("Internal Error", { status: 500 });
}
}