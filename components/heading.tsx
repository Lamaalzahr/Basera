import { LucideIcon } from "lucide-react";

interface Headingprops{
    title: string;
    description: string;
    icon: LucideIcon;
    iconColor?: string;
    bgColor?:string;
}

export const Heading = ({
title,
description,
icon,
iconColor,
bgColor,

}: Headingprops) => {
return(
<div>
Heading component
</div>
);
};

