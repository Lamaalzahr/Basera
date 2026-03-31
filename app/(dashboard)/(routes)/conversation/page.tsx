"use client";
import * as z from "zod"; 
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { Heading } from "@/components/heading";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";


const ConversationPage = () => {
const form = useForm<z.infer<typeof formSchema>> ({
resolver:zodResolver(formSchema),
defaultValues: {
prompt:""
}
});

const onSubmit = async ( values: z.infer<typeof formSchema>) =>{
console.log(values);
};

return(
<div>
<Heading 
title="Conversation"
description="Our most advanced conversation model."
icon={MessageSquare}
iconColor="text-violet-400"
bgColor="bg-violet-400/10"
/>

<div className="px-4 lg:px-8">
<div>
    <Form{...form}>

    </Form>
</div>

</div>
</div>
);
}

export default ConversationPage;