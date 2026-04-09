import { prisma } from "./prismadb";

const MAX_VISITS = 16;

export async function checkRateLimit(
identifier: string,
page: string
): Promise<{ allowed: boolean; remaining: number }> {

const record = await prisma.rateLimit.upsert({
where: {
identifier_page: { identifier, page },
},
update: {
count: { increment: 1 },
},
create: {
identifier,
page,
count: 1,
},
});

const allowed = record.count <= MAX_VISITS;
const remaining = Math.max(0, MAX_VISITS - record.count);

return { allowed, remaining };
}