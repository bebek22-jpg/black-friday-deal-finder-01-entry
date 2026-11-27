// Bargain Friday — black-friday-deal-finder-01 entrypoint (Node 22,
// standard library only).
//
// The site itself is plain static files in app/ (index.html, style.css,
// app.js, deals.js) plus screenshots/ of it running. This program hands
// the entry in: it copies app/ and screenshots/ from beside this file
// into the output directory and writes dossier.json there, using the
// vendored make.fun library. The library's copy must stay untouched —
// the scorer rebuilds the dossier with its own copy and compares bytes.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });

mkdirSync(join(outDir, "screenshots"), { recursive: true });
const shots = join(repoRoot, "screenshots");
if (existsSync(shots)) cpSync(shots, join(outDir, "screenshots"), { recursive: true });

// Same caps the gate enforces, so a build that passes here matches it:
// at most 4 screenshots of 256 KiB, app/ under 993 entries / 16 MiB,
// dossier text capped at 160 KiB.
writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
