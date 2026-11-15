// Writes clearly-marked DEMO report PDFs to public/reports for every lot file
// marked "demo": true that has results. Real lots must use the lab's own,
// unedited PDF; this script never touches a lot without "demo": true.
//
// Run: npm run demo-reports
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const lotsDir = path.join(root, "content", "lots");
const productsDir = path.join(root, "content", "products");
const outDir = path.join(root, "public", "reports");
fs.mkdirSync(outDir, { recursive: true });

const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

function pdf(lines) {
  // lines: [{ text, size, bold, y }]
  let stream = "";
  for (const l of lines) {
    stream += `BT /${l.bold ? "F2" : "F1"} ${l.size} Tf 56 ${l.y} Td (${esc(l.text)}) Tj ET\n`;
  }
  // A light diagonal-free border box for the demo watermark band.
  stream += "0.8 0 0 RG 2 w 50 742 495 40 re S\n";
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}endstream`,
  ];
  let out = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((o, i) => {
    offsets.push(Buffer.byteLength(out, "latin1"));
    out += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = Buffer.byteLength(out, "latin1");
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) out += `${String(off).padStart(10, "0")} 00000 n \n`;
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, "latin1");
}

const products = Object.fromEntries(
  fs.readdirSync(productsDir).filter((f) => f.endsWith(".json")).map((f) => {
    const p = JSON.parse(fs.readFileSync(path.join(productsDir, f), "utf8"));
    return [p.slug, p];
  }),
);

let written = 0;
for (const f of fs.readdirSync(lotsDir).filter((f) => f.endsWith(".json"))) {
  const lot = JSON.parse(fs.readFileSync(path.join(lotsDir, f), "utf8"));
  if (!lot.demo || !lot.results) continue;
  const p = products[lot.product];
  const r = lot.results;
  let y = 754;
  const lines = [];
  const add = (text, size = 11, bold = false, gap = 18) => {
    lines.push({ text, size, bold, y });
    y -= gap;
  };
  add("DEMO REPORT - NOT A REAL LABORATORY RESULT", 14, true, 50);
  add("Certificate of Analysis", 20, true, 30);
  add(`Laboratory: ${r.lab}`);
  add(`Client sample codes: ${r.samples.map((s) => `${lot.code}-${s.id}`).join(", ")} (submitted blind)`);
  add(`Material: ${p.name}, label claim ${p.nominalSize} per vial`);
  add(`Date of analysis: ${r.analysisDate}`);
  if (r.methods) add(`Methods: ${r.methods}`);
  y -= 14;
  add("Sample      Identity          Net content (mg)      Purity (%)", 11, true);
  for (const s of r.samples) {
    add(
      `${(lot.code + "-" + s.id).padEnd(18)}  ${s.identity.padEnd(18)}  ${s.netContentMg.toFixed(2).padEnd(22)}  ${s.purityPct.toFixed(1)}`,
    );
  }
  y -= 20;
  add("Each vial was analysed individually. Results are not averaged.", 10);
  add("This PDF was generated as placeholder content for a website demo.", 10);
  add("Replace it with the laboratory's own unedited report before publishing a real lot.", 10);
  fs.writeFileSync(path.join(outDir, `${lot.code}.pdf`), pdf(lines));
  written++;
}
console.log(`Wrote ${written} demo report(s) to public/reports`);
