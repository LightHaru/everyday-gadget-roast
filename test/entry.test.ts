import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ENTRY, writeEntry } from "../main.ts";

test("writes entry.txt at the expected path inside the given directory", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "roast-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  const file = writeEntry(dir);
  assert.equal(file, join(dir, "entry.txt"));
  assert.ok(statSync(file).isFile());
});

test("output is deterministic: identical bytes on every run", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "roast-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  const first = readFileSync(writeEntry(join(dir, "a")));
  const second = readFileSync(writeEntry(join(dir, "b")));
  assert.deepEqual(first, second);
  assert.equal(first.toString("utf8"), ENTRY);
});

test("strict one-line format: no newline, no carriage return, no trailing whitespace", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "roast-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  const text = readFileSync(writeEntry(dir), "utf8");
  assert.ok(!text.includes("\n"), "must not contain a newline");
  assert.ok(!text.includes("\r"), "must not contain a carriage return");
  assert.equal(text, text.trim(), "must not have leading/trailing whitespace");
  assert.ok(text.trim().length > 0, "must not be only whitespace");
});

test("fits the gate: valid UTF-8 text of 1 to 200 Unicode characters", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "roast-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));

  const raw = readFileSync(writeEntry(dir));
  const text = raw.toString("utf8");
  assert.equal(Buffer.byteLength(text, "utf8"), raw.length, "must round-trip as UTF-8");
  const chars = [...text].length;
  assert.ok(chars >= 1 && chars <= 200, `expected 1-200 characters, got ${chars}`);
});
