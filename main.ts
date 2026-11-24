import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

export const ENTRY =
  "My smartwatch logs my every step, heartbeat and hour of sleep, then buzzes hourly: 'Time to stand!' It watched me run a 10K this morning and still isn't sure I have legs.";

export function writeEntry(dir: string): string {
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "entry.txt");
  writeFileSync(file, ENTRY, "utf8");
  return file;
}

const invokedAs = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedAs) {
  writeEntry(process.argv[2] ?? "/output");
}
