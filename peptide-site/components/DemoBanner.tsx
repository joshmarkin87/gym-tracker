import { hasDemoContent } from "@/lib/data";

/** Shown while any product or lot file is marked "demo": true. Disappears once real data replaces it. */
export function DemoBanner() {
  if (!hasDemoContent()) return null;
  return (
    <div className="border-b border-wait/30 bg-wait-soft px-4 py-2 text-center text-sm text-wait">
      <strong>Demo content.</strong> The products, lots, results and lab reports shown are sample data for review, not
      real test results.
    </div>
  );
}
