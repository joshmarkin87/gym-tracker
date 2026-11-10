export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-5xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="border-b border-line bg-card">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-lg text-muted">{children}</div>}
      </div>
    </header>
  );
}
