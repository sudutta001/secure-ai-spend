export function GridBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      
      <div
        className="absolute left-1/2 top-[-10%] h-[520px] w-[820px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(79,125,255,0.28), rgba(79,125,255,0.05) 55%, transparent 75%)",
        }}
      />
      <div
        className="absolute -bottom-40 right-[-10%] h-[420px] w-[560px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(79,125,255,0.18), transparent 70%)",
        }}
      />
    </div>
  );
}
