/**
 * Minimal append-only storage for waitlist signups and contact messages.
 * Writes JSON Lines files to ./.data on the server. This works for local use
 * and any host with a persistent disk. On serverless hosts the disk is
 * temporary: swap `append` for a database or form service before launch.
 */
import fs from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), ".data");

export async function append(file: "waitlist" | "contact", record: Record<string, unknown>) {
  await fs.mkdir(DIR, { recursive: true });
  await fs.appendFile(path.join(DIR, `${file}.jsonl`), JSON.stringify({ ...record, at: new Date().toISOString() }) + "\n");
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
