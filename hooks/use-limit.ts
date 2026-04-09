"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const PAGES = ["conversation", "image", "video", "code"];
const MAX_PER_PAGE = 4;
const TOTAL_MAX = MAX_PER_PAGE * PAGES.length;
const WARNING_THRESHOLD = 3;

export const useLimit = () => {
const pathname = usePathname();
const [totalUsed, setTotalUsed] = useState(0);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchUsage = async () => {
const results = await Promise.all(
PAGES.map((page) =>
fetch(`/api/limit?page=${page}`, { credentials: "include" }).then((r) => r.json())
)
);
const used = results.reduce((sum, r) => sum + (r.count ?? 0), 0);
setTotalUsed(Math.min(used, TOTAL_MAX));
setLoading(false);
};
fetchUsage();
}, [pathname]);

const remaining = Math.max(0, TOTAL_MAX - totalUsed);
const percentage = (totalUsed / TOTAL_MAX) * 100;
const isWarning = remaining <= WARNING_THRESHOLD && remaining > 0;
const isLimitReached = remaining === 0;

return { totalUsed, totalMax: TOTAL_MAX, remaining, percentage, isWarning, isLimitReached, loading };
};