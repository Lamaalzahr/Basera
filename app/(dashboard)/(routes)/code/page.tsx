"use client";
import * as z from "zod"; 
import { Code } from "lucide-react";
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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useProModal } from "@/hooks/use-pro-modal";

type MessageType = {
role: "user" | "assistant";
content: string;
};

const CodePage = () => {
const router = useRouter();
const [messages, setMessages] = useState<MessageType[]>([]);
const { onOpen } = useProModal(); 

const form = useForm<z.infer<typeof formSchema>>({
resolver: zodResolver(formSchema),
defaultValues: {
prompt: ""
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

const response = await fetch("/api/code", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ messages: newMessages })
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
} finally {
router.refresh();
}
};

return (
<div>
<Heading 
title="Code Generation"
description="Generate code using descriptive text."
icon={Code}
iconColor="text-green-700"
bgColor="bg-green-500/10"
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
<FormItem className="col-span-12 lg:col-span-10">
<FormControl className="m-0 p-0">
<Input
className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
disabled={isLoading}
placeholder="Simple toggle button using React hooks."
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
"p-8 w-full flex items-start gap-x-7 rounded-lg overflow-hidden",
message.role === "user" 
? "bg-white border border-black/10" 
: "bg-muted"
)}
>
{message.role === "user" ? <UserAvatar /> : <BotAvatar />}

<div className="text-sm overflow-hidden break-words min-w-0">
<ReactMarkdown
remarkPlugins={[remarkGfm]}
components={{
code({ node, className, children, ...props }: any) {
const inline = !className?.startsWith("language-");
const match = /language-(\w+)/.exec(className || "");
return !inline && match ? (
<SyntaxHighlighter
style={oneDark as any}
language={match[1]}
PreTag="div"
className="rounded-lg my-2 overflow-x-auto"
>
{String(children).replace(/\n$/, "")}
</SyntaxHighlighter>
) : (
<code className="bg-black/10 rounded px-1 py-0.5 text-sm" {...props}>
{children}
</code>
);
},
pre({ children }) {
return <div className="overflow-x-auto w-full">{children}</div>;
}
}}
>
{message.content || ""}
</ReactMarkdown>
</div>
</div>
))}
</div>
</div>
</div>
);
}

export default CodePage;