"use client";
import * as z from "zod"; 
import { ImageIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import NextImage from "next/image";
import {
Select,
SelectContent,
SelectGroup,
SelectItem,
SelectLabel,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import { useProModal } from "@/hooks/use-pro-modal";


type MessageType = {
role: "user" | "assistant";
content: string;
};

const amountOptions = [
{ value: "1", label: "1 Photo" },
{ value: "2", label: "2 Photos" },
{ value: "3", label: "3 Photos" },
{ value: "4", label: "4 Photos" },
{ value: "5", label: "5 Photos" },
];

const resolutionOptions = [
{ value: "256x256", label: "256x256" },
{ value: "512x512", label: "512x512" },
{ value: "1024x1024", label: "1024x1024" },
];

const ImagePage = () => {
const router = useRouter();
const [messages, setMessages] = useState<MessageType[]>([]);
const { onOpen } = useProModal();

const form = useForm<z.infer<typeof formSchema>>({
resolver: zodResolver(formSchema),
defaultValues: {
prompt: "",
amount: "1",
resolution: "512x512"
}
});

const isLoading = form.formState.isSubmitting;

const onSubmit = async (values: z.infer<typeof formSchema>) => {
try {
const userMessage: MessageType = {
role: "user",
content: values.prompt,
};

const newMessages = [...messages, userMessage];

const response = await fetch("/api/image", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ 
messages: newMessages,
amount: values.amount,
resolution: values.resolution
})
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
setMessages((current) => [...current, userMessage, data]);
form.reset();
} catch (error: any) {
console.log(error);
alert(error.message || "حدث خطأ ما");
} finally {
router.refresh();
}
};

return (
<div>
<Heading 
title="Image Generation"
description="Turn your prompt into an image."
icon={ImageIcon}
iconColor="text-pink-400"
bgColor="bg-pink-400/10"
/>
<div className="px-4 lg:px-8">
<div>
<Form {...form}>
<form
onSubmit={form.handleSubmit(onSubmit)}
className="rounded-lg border w-full p-4 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
>
<FormField
name="prompt"
render={({ field }) => (
<FormItem className="col-span-12 lg:col-span-6">
<FormControl className="m-0 p-0">
<Input
className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
disabled={isLoading}
placeholder="A horse in the middle of the ocean."
{...field}
/>
</FormControl>
</FormItem>
)}
/>

<FormField
name="amount"
render={({ field }) => (
<FormItem className="col-span-12 lg:col-span-2">
<Select
disabled={isLoading}
onValueChange={field.onChange}
value={field.value}
defaultValue={field.value}
>
<SelectTrigger className="h-10">
<SelectValue defaultValue={field.value} />
</SelectTrigger>
<SelectContent>
<SelectGroup>
<SelectLabel>Number of Photos</SelectLabel>
{amountOptions.map((option) => (
<SelectItem key={option.value} value={option.value}>
{option.label}
</SelectItem>
))}
</SelectGroup>
</SelectContent>
</Select>
</FormItem>
)}
/>

<FormField
name="resolution"
render={({ field }) => (
<FormItem className="col-span-12 lg:col-span-2">
<Select
disabled={isLoading}
onValueChange={field.onChange}
value={field.value}
defaultValue={field.value}
>
<SelectTrigger className="h-10">
<SelectValue defaultValue={field.value} />
</SelectTrigger>
<SelectContent>
<SelectGroup>
<SelectLabel>Resolution</SelectLabel>
{resolutionOptions.map((option) => (
<SelectItem key={option.value} value={option.value}>
{option.label}
</SelectItem>
))}
</SelectGroup>
</SelectContent>
</Select>
</FormItem>
)}
/>

<Button className="col-span-12 lg:col-span-2 w-full h-10" disabled={isLoading}>
Generate 
</Button>
</form>
</Form>
</div>

<div className="flex flex-col gap-4 mt-4">
{isLoading && (
<div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
<Loader />
</div>
)}

{messages.map((message, index) => (
<div
key={index}
className={cn(
"p-8 w-full flex items-start gap-x-7 rounded-lg",
message.role === "user" 
? "bg-white border border-black/10" 
: "bg-muted"
)}
>
{message.role === "user" ? <UserAvatar /> : <BotAvatar />}
{message.role === "assistant" && (message.content.startsWith("http") || message.content.startsWith("data:image")) ? (
<div className="relative w-full h-64 mt-2">
<NextImage
src={message.content}
alt="Generated image"
fill
className="object-contain rounded-lg"
/>
</div>
) : (
<p className="text-sm">{message.content}</p>
)}
</div>
))}
</div>
</div>
</div>
);
}

export default ImagePage;