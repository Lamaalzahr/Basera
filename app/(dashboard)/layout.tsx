"use client";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useProModal } from "@/hooks/use-pro-modal";

const DashboardLayout = ({
children
}: {
children: React.ReactNode;
}) => {
const { isOpen } = useProModal();

return (
<div className="h-full relative">
<div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-[#7552ff]">
<Sidebar />
</div>

<main className={`md:pl-72 transition-all duration-300 ${isOpen ? "blur-sm pointer-events-none" : ""}`}>
<Navbar />
{children}
</main>
</div>
);
}

export default DashboardLayout;