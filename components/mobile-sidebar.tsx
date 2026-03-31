"use client";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";
import { useEffect, useState } from "react";

const MobileSidebar = () => {

// في حال طلع لي ايرور في الموقع عشان الترطيب
const [isMounted, setIsmounted] = useState(false);
useEffect(() =>{
setIsmounted(true);
}, []);
if (!isMounted){
return null;
}
//

return(
<Sheet>
<SheetTrigger asChild> 
<Button variant="ghost" size="icon" className="md:hidden">

<Menu/>
</Button>
</SheetTrigger>  
<SheetContent side="left" className="p-8 bg-[#2e4e8e]">
    
<Sidebar/>
</SheetContent>
</Sheet>
);
}  
export default MobileSidebar;