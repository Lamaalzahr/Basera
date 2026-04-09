"use client";

import { useProModal } from "@/hooks/use-pro-modal";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Zap, MessageSquare, ImageIcon, VideoIcon, Code } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const features = [
{ icon: MessageSquare, 
label: "Conversation", 
color: "text-violet-400" },

{ icon: ImageIcon,     
label: "Image Generation", 
color: "text-pink-400" },

{ icon: VideoIcon,     
label: "Video Generation", 
color: "text-orange-400" },

{ icon: Code,          
label: "Code Generation",  
color: "text-green-700" },
];

export const ProModal = () => {
const { isOpen, onClose } = useProModal();

return (
<Dialog open={isOpen} onOpenChange={onClose}>
<DialogContent className="max-w-md">
<DialogHeader className="space-y-3">
<div className="flex items-center gap-2 justify-center">
<DialogTitle className="text-xl font-bold">Upgrade to Genius</DialogTitle>
<Badge className="bg-gradient-to-r from-violet-600 to-pink-600 text-white border-0 uppercase text-xs">
PRO
</Badge>
</div>
<DialogDescription className="text-center text-zinc-500">
لقد استنفذت محاولاتك المجانية. قم بالترقية للحصول على وصول غير محدود.
</DialogDescription>
</DialogHeader>

<div className="space-y-2 mt-2">
{features.map((f) => (
<div
key={f.label}
className="flex items-center justify-between p-3 rounded-lg border border-black/5 bg-white/5"
>
<div className="flex items-center gap-3">
<f.icon className={cn("h-5 w-5", f.color)} />
<span className="text-sm font-medium">{f.label}</span>
</div>
<Check className="h-5 w-5 text-violet-500" />
</div>
))}
</div>

<Link href="/settings" onClick={onClose}>
<Button className="w-full mt-4 bg-gradient-to-r from-violet-600 to-pink-600 hover:opacity-90 border-0 text-white">
Upgrade ⚡
</Button>
</Link>
</DialogContent>
</Dialog>
);
};