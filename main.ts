// Developer Excuses — one funny single-line excuse for a production break.
// Writes the entry to /output/entry.txt. Deterministic, no network, no input.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The excuse: CI passed because the tests mock everything —
// database, network, and finally reality itself. The twist lands
// on the last word, and every developer has watched green CI
// mean nothing in production.
const EXCUSE =
  "It passed CI because the test mocks the database, the network, and reality.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 200
// characters, not only white space, on a single line. Refuse to
// write anything that would fail it, so a bad edit fails loudly
// here instead of silently at grading time.
if (EXCUSE.length < 1 || EXCUSE.length > 200) {
  throw new Error(`excuse is ${EXCUSE.length} characters, gate is 1-200`);
}
if (EXCUSE.trim() !== EXCUSE || /\n/.test(EXCUSE)) {
  throw new Error("excuse must be one clean line with no surrounding space");
}

const outDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, EXCUSE, "utf8");

// Read back what was written and confirm it is byte-for-byte the
// excuse: the grader runs the program twice and gates both runs,
// so the output must be identical every time, with no trailing
// newline or stray whitespace sneaking in.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== EXCUSE) {
  throw new Error("entry.txt does not match the excuse exactly");
}
