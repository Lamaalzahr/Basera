"use client";
import * as z from "zod"; 
import { VideoIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Heading } from "@/components/heading";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader } from "@/components/loader";
import { useProModal } from "@/hooks/use-pro-modal";


const VideoPage = () => {
const router = useRouter();
const [videoUrl, setVideoUrl] = useState<string>();
const [isLoading, setIsLoading] = useState(false);
const { onOpen } = useProModal(); 

const form = useForm<z.infer<typeof formSchema>>({
resolver: zodResolver(formSchema),
defaultValues: {
prompt: ""
}
});

const onSubmit = async (values: z.infer<typeof formSchema>) => {
setIsLoading(true);
try {
const response = await fetch("/api/video", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ messages: [{ role: "user", content: values.prompt }] })
});

if (response.status === 403) { 
onOpen();
return;
}

if (!response.ok) {
const errorText = await response.text();
throw new Error(errorText);
}

const data = await response.json();

// تخزين رابط الفيديو في الحالة
setVideoUrl(data.content);
form.reset();
} catch (error: any) {
console.log("[VIDEO_PAGE_ERROR]", error);
} finally {
setIsLoading(false);
router.refresh();
}
};

return (
<div>
<Heading 
title="Video Generation"
description="Turn your prompt into a video."
icon={VideoIcon}
iconColor="text-orange-400"
bgColor="bg-orange-400/10"
/>
<div className="px-4 lg:px-8">
<Form {...form}>
<form
onSubmit={form.handleSubmit(onSubmit)}
className="rounded-lg border w-full p-4 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
>
<FormField
name="prompt"
render={({ field }) => (
<FormItem className="col-span-12 lg:col-span-10">
<FormControl className="m-0 p-0">
<Input
className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
disabled={isLoading}
placeholder="A dog playing in the park."
{...field}
/>
</FormControl>
</FormItem>
)}
/>
<Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
Generate 
</Button>
</form>
</Form>

<div className="flex flex-col gap-4 mt-4">
{isLoading && (
<div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
<Loader />
</div>
)}

{videoUrl && (
<div className="p-8 w-full flex flex-col items-start gap-2 rounded-lg bg-muted">
<video controls className="w-full rounded-lg">
<source src={videoUrl} />
</video>
</div>
)}
</div>
</div>
</div>
);
};

export default VideoPage;