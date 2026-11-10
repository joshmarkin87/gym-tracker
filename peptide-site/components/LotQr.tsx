import QRCode from "qrcode";
import { SITE_URL } from "@/site.config";

export function lotUrl(code: string) {
  return `${SITE_URL}/lot/${code}`;
}

/** QR code for a lot page, rendered to inline SVG at build time. */
export async function LotQr({ code, className = "h-32 w-32" }: { code: string; className?: string }) {
  const svg = await QRCode.toString(lotUrl(code), {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#1b2430", light: "#ffffff" },
  });
  return (
    <figure className="flex flex-col items-center gap-2">
      <div
        role="img"
        aria-label={`QR code linking to the verification page for lot ${code}`}
        className={`${className} [&>svg]:h-full [&>svg]:w-full`}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <figcaption className="text-center text-xs text-muted">
        Scan to open this lot&apos;s page.
        <br />
        <a href={`/lot/${code}/qr.svg`} download className="text-accent underline underline-offset-2">
          Download QR (SVG)
        </a>
      </figcaption>
    </figure>
  );
}
