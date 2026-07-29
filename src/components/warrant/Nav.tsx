export function Nav() {
  const links = [
    { href: "#how", label: "How it works" },
    { href: "#demo", label: "Demo" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#090909]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2">
          <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#4F7DFF]/15 ring-1 ring-[#4F7DFF]/40">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4F7DFF] shadow-[0_0_10px_#4F7DFF]" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Warrant</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-white/60 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="transition hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#demo"
          className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-white/80 transition hover:border-white/25 hover:text-white"
        >
          Try demo
        </a>
      </div>
    </header>
  );
}
