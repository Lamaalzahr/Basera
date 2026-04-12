
const LandingLayout =({
children,
}: {
children: React.ReactNode;
}) => {
return (
<main className="h-full bg-[#111827] overflow-aouto">
<div className="mx-auto max-w-screen-sm-x1 h-full w-full">


{children}

</div>
</main>
);
}

export default LandingLayout;