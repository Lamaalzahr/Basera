"use client";
import { Card } from "@/components/ui/card";
import { ArrowRight,
MessageSquare, 
Music, 
ImageIcon,
VideoIcon,
Code
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const tools = [
{
label: "Conversation",
icon: MessageSquare,
color: "text-violet-400",
bgColor: "bg-violet-400/15",
href: "/conversation"
},
{
label:"Music Generation",
icon: Music,
color: "text-emerald-400",
bgColor: "bg-emerald-400/10",
href: "/music"
},
{
label: "Image Generation",
icon:ImageIcon,
color:"text-pink-400",
bgColor: "bg-pink-400/10",
href: "/image"
},  
{
label:"Video Generation",
icon: VideoIcon,
href: "/video",
color:"text-orange-400",
bgColor: "bg-orange-400/10",
}, 
{
label:"Code Generation",
icon: Code,
href: "/Code",
color:"text-red-500",
bgColor: "bg-red-500/10",

},  

]

const DashboardPage = () => {
const router = useRouter();

return (
<div> 
<div className="mb-8 space-y-4">
<h2 className="text-2xl md:text-4xl font-bold text-center">
استكشف قوة الذكاء الاصطناعي
</h2>
<p className="text-muted-foreground font-light text-sm md:text-lg text-center">
تحدث مع أذكى ذكاء اصطناعي واكتشف إمكانياته
</p>

<div className="px-4 md:px-20 lg:px-32 space-y-4">
{tools.map((tool) =>(
<Card
onClick={() => router.push(tool.href)}
key={tool.href}
className="p-4 border-black/5 
flex items-center justify-between 
hover:shadow-md transtion cursor-pointer">

<div className="flex items-center gap-x-4">
<div className={cn("p-2 w-fit ronded-md", tool.bgColor)}>
<tool.icon className={cn("w-8 h-8", tool.color)} />
</div>
<div className="font-semibold">
{tool.label}
</div>
</div>

<ArrowRight className="w-5 h-5" />
</Card>
))}
</div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
</div>
</div>

)
}
export default DashboardPage;