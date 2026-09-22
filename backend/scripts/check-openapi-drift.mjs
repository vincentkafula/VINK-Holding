// Fails if openapi.yaml and src/app.js's actual routes have drifted apart —
// run in CI so the contract can't silently go stale as routes change.
import fs from "fs";
import * as yaml from "js-yaml";

const spec = yaml.load(fs.readFileSync(new URL("../openapi.yaml", import.meta.url), "utf-8"));
const appSrc = fs.readFileSync(new URL("../src/app.js", import.meta.url), "utf-8");

const specRoutes = new Set();
for (const [p, methods] of Object.entries(spec.paths)) {
  for (const method of Object.keys(methods)) {
    specRoutes.add(`${method.toUpperCase()} /api${p.replace("{id}", ":id")}`);
  }
}

const appRoutes = new Set();
for (const m of appSrc.matchAll(/app\.(get|post)\("([^"]+)"/g)) {
  appRoutes.add(`${m[1].toUpperCase()} ${m[2]}`);
}

const missingFromSpec = [...appRoutes].filter((r) => !specRoutes.has(r));
const missingFromApp = [...specRoutes].filter((r) => !appRoutes.has(r));

if (missingFromSpec.length || missingFromApp.length) {
  console.error("OpenAPI spec has drifted from the actual routes in src/app.js:");
  if (missingFromSpec.length) console.error("  In app.js but missing from openapi.yaml:", missingFromSpec);
  if (missingFromApp.length) console.error("  In openapi.yaml but not in app.js:", missingFromApp);
  process.exit(1);
}

console.log(`OpenAPI spec matches app.js — ${specRoutes.size} routes, no drift.`);
