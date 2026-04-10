"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import { LayoutDashboard, 
MessageSquare, 
ImageIcon, 
VideoIcon, 
Code,
Settings
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLimit } from "@/hooks/use-limit";
import { useProModal } from "@/hooks/use-pro-modal";


const montserrat= Montserrat({
weight: "600",
subsets:["latin"]
});


const routes = [
{
label:"Dashboard",
icon:LayoutDashboard,
href: "/dashboard",
color:"text-sky-400",
},  
{
label:"Conversation",
icon:MessageSquare,
href: "/conversation",
color:"text-violet-400",
},  
{
label:"Image Generation",
icon:ImageIcon,
href: "/image",
color:"text-pink-400",
},  
{
label:"Video Generation",
icon: VideoIcon,
href: "/video",
color:"text-orange-400",
}, 
{
label:"Code Generation",
icon: Code,
href: "/code",
color:"text-green-700",
},  
{
label:"Settings",
icon: Settings,
href: "/settings",
color:"text-gray-400",
},  
];

const PAGES = ["conversation", "image", "video", "code"];
const MAX = 1;

const Sidebar = () => {
const pathname = usePathname();
const [totalUsed, setTotalUsed] = useState(0);

useEffect(() => {
const fetchUsage = async () => {
const results = await Promise.all(
PAGES.map((page) =>
fetch(`/api/limit?page=${page}`, {
credentials: "include", 

}).then((r) => r.json())
)
);

const used = results.reduce((sum, r) => sum + (r.count ?? 0), 0);
setTotalUsed(Math.min(used, MAX * PAGES.length));
};
fetchUsage();
}, [pathname]);

const totalMax = MAX * PAGES.length;
const percentage = (totalUsed / totalMax) * 100;

const Sidebar = () => {
const pathname = usePathname();
const { totalUsed, totalMax, remaining, percentage, isWarning } = useLimit();
const { onOpen } = useProModal();
}
return (
<div className="flex flex-col h-full py-4 text-white bg-[#2e4e8e]">
<div className="px-3 py-2 flex-1 overflow-y-auto">
<Link href="/dashboard" className="flex items-center pl-3 mb-14">

<div className="relative w-20 h-20 mr-1">
<Image fill alt="logo" src="/Basera.Logo.png"/>

</div>
<h1 className= {cn("text-2xl font-bold" , montserrat.
className)}>
Basera
</h1>
</Link>

<div className="space-y-1">
{routes.map((route) => (
<Link
href={route.href}
key={route.href}
className={cn(
"text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
pathname === route.href ? "text-white bg-white/10":
"text-zinc-400"
)}
>
<div className="flex items-center flex-1">

<route.icon className={cn("h-5 w-5 mr-3", route.color)} />
{route.label}
</div>
</Link>
))}

</div>
</div>

<div className="px-3 pb-4 mt-auto">
<div className="bg-white/10 rounded-lg p-3 space-y-2">
<p className="text-xs text-center text-zinc-200">
{totalUsed} / {totalMax} Free Generations
</p>
<div className="w-full bg-white/20 rounded-full h-2">
<div
className="bg-gradient-to-r from-violet-500 to-pink-500 h-2 rounded-full transition-all"
style={{ width: `${percentage}%` }}
/>
</div>
<Link
href="/settings"
className="w-full flex items-center justify-center bg-gradient-to-r from-violet-600 to-pink-600 rounded-lg py-2 text-sm font-medium hover:opacity-90 transition"
>
Upgrade ⚡
</Link>
</div>
</div>
</div>

);
}
export default Sidebar;