import QRCode from "qrcode";
import { getLot, getLots } from "@/lib/data";
import { lotUrl } from "@/components/LotQr";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLots().map((l) => ({ code: l.code }));
}

/** Print-ready QR code for vial labels: /lot/<code>/qr.svg */
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const lot = getLot(code);
  if (!lot) return new Response("Unknown lot", { status: 404 });
  const svg = await QRCode.toString(lotUrl(lot.code), { type: "svg", margin: 2, errorCorrectionLevel: "M" });
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml" } });
}
