"use client";

import { Heading } from "@/components/heading";
import { Settings } from "lucide-react";
import { useState } from "react";

const SettingsPage = () => {
const [activeMethod, setActiveMethod] = useState("card");
const [cardNumber, setCardNumber] = useState("");
const [expiry, setExpiry] = useState("");
const [name, setName] = useState("");
const [cvc, setCvc] = useState("");
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);

const formatCard = (value: string) => {
const v = value.replace(/\D/g, "").substring(0, 16);
return v.replace(/(.{4})/g, "$1 ").trim();
};

const formatExp = (value: string) => {
const v = value.replace(/\D/g, "").substring(0, 4);
if (v.length >= 2) return v.substring(0, 2) + " / " + v.substring(2);
return v;
};

const handlePay = () => {
if (!name || cardNumber.length < 4) {
alert("يرجى إدخال البيانات أولاً");
return;
}
setLoading(true);
setTimeout(() => {
setLoading(false);
setSuccess(true);
}, 1500);
};

return (
<div>
<Heading
title="Settings"
description="Manage your account settings."
icon={Settings}
iconColor="text-gray-400"
bgColor="bg-gray-400/10"
/>

<div className="px-4 lg:px-8 space-y-6 flex flex-col items-center">


<div className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex items-center gap-2 w-full max-w-md">
<span className="text-amber-700 text-sm font-medium">
⚠️ هذا النموذج للعرض فقط — لا يتم معالجة أي دفع حقيقي
</span>
</div>


<div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md">


<div className="flex justify-between items-center mb-5">
<span className="text-sm text-gray-500">المبلغ المطلوب</span>
<span className="text-lg font-semibold">99 ر.س / شهر</span>
</div>


<div className="flex gap-2 mb-4">
{["card", "mada", "applepay"].map((method) => (
<button
key={method}
onClick={() => setActiveMethod(method)}
className={`flex-1 py-2 px-3 rounded-lg border text-sm transition ${
activeMethod === method
? "border-blue-500 bg-blue-50 text-blue-700"
: "border-gray-200 text-gray-600"
}`}
>
{method === "card" ? "بطاقة" : method === "mada" ? "مدى" : "Apple Pay"}
</button>
))}
</div>


<div className="flex gap-2 mb-4">
{["VISA", "Mastercard", "AMEX"].map((c) => (
<span key={c} className="text-xs px-2 py-1 border border-gray-200 rounded text-gray-400">
{c}
</span>
))}
</div>

{!success ? (
<div className="space-y-4">

<div>
<label className="text-sm text-gray-500 mb-1 block">الاسم على البطاقة</label>
<input
className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
placeholder="Ali  Ahmed"
value={name}
onChange={(e) => setName(e.target.value)}
/>
</div>

<div>
<label className="text-sm text-gray-500 mb-1 block">رقم البطاقة</label>
<input
className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
placeholder="1234 5678 9101 1121"
value={cardNumber}
onChange={(e) => setCardNumber(formatCard(e.target.value))}
/>
</div>

<div className="grid grid-cols-2 gap-3">
<div>
<label className="text-sm text-gray-500 mb-1 block">تاريخ الانتهاء</label>
<input
className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
placeholder="MM / YY"
value={expiry}
onChange={(e) => setExpiry(formatExp(e.target.value))}
/>
</div>
<div>
<label className="text-sm text-gray-500 mb-1 block">CVC</label>
<input
className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
placeholder="123"
maxLength={3}
type="password"
value={cvc}
onChange={(e) => setCvc(e.target.value)}
/>
</div>
</div>

<hr className="border-gray-100" />

<button
onClick={handlePay}
disabled={loading}
className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-medium transition disabled:opacity-70"
>
{loading ? "جاري المعالجة..." : "ادفع 99 ر.س"}
</button>
</div>
) : (

<div className="text-center py-6">
<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
<span className="text-green-600 text-xl">✓</span>
</div>
<p className="font-medium text-gray-800 mb-1">تمت العملية بنجاح (تجريبي)</p>
<p className="text-sm text-gray-400">هذه محاكاة فقط — لا يوجد دفع حقيقي</p>
</div>
)}
</div>
</div>
</div>
);
};

export default SettingsPage;