import { RUO_NOTICE } from "@/site.config";

export function RuoNotice({ className = "" }: { className?: string }) {
  return (
    <p role="note" className={`rounded-lg border border-ink/15 bg-paper px-4 py-3 text-sm font-semibold ${className}`}>
      {RUO_NOTICE}
    </p>
  );
}
