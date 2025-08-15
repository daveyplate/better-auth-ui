#!/usr/bin/env node
/**
 * Shadcn Registry Generator (Typed Classification + File Targets)
 *
 * CHANGE (target requirement):
 *   ANY item whose type === "registry:file" now ensures EVERY file entry inside
 *   item.files[] has a "target" property.
 *
 *   For localization and types directories:
 *     src/localization/foo-bar.ts  -> target: localization/foo-bar.ts
 *     src/types/any-auth-client.ts -> target: types/any-auth-client.ts
 *
 *   For any other registry:file (fallback) we use the path relative to src/:
 *     src/something/else/file.ts -> target: something/else/file.ts
 *
 * PRIOR FEATURES:
 *   - Classification into registry:ui, registry:component, registry:hook, registry:lib, registry:file
 *   - External packages only in "dependencies"
 *   - Internal imports in "registryDependencies" (URL-prefixed unless basic primitives)
 *   - Optional hydration (--hydrate)
 *   - Optional per-item JSON (--split-items)
 *
 * Typical usage:
 *   node scripts/generate.mjs --hydrate --description --name-strategy=path
 *
 * Dry run:
 *   node scripts/generate.mjs --dry-run
 */

import { promises as fs } from "fs";
import path from "path";

// ---------------------- CLI ARG PARSING --------------------------------------
const argv = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [k, ...rest] = arg.replace(/^--/, "").split("=");
    return [k, rest.length ? rest.join("=") : true];
  }),
);

// ---------------------- Configuration & Flags --------------------------------
const PROJECT_ROOT = path.resolve(argv.root || process.cwd());

// Directories to scan (comma list).
const SCAN_DIRS = (
  argv["scan-dirs"]
    ? String(argv["scan-dirs"])
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [
        "src/components",
        "src/hooks",
        "src/lib",
        "src/localization",
        "src/types",
      ]
).map((d) => d.replace(/\/+$/, ""));

const OUT_DIR = path.resolve(argv.out || path.join(PROJECT_ROOT, "registry"));
const PARSE_STRUCTURE =
  argv["parse-structure"] && path.resolve(argv["parse-structure"]);
const INLINE_CONTENT = Boolean(argv.hydrate);
const DRY_RUN = Boolean(argv["dry-run"]);
const EXTENSIONS = (
  argv.extensions
    ? String(argv.extensions)
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean)
    : [".tsx", ".ts"]
).map((e) => (e.startsWith(".") ? e : "." + e));

const INCLUDE_FILTERS = argv.include
  ? String(argv.include)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : [];
const EXCLUDE_FILTERS = argv.exclude
  ? String(argv.exclude)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : [];
const NAME_STRATEGY = argv["name-strategy"] === "path" ? "path" : "basename";
const NAME_PREFIX = argv.prefix ? String(argv.prefix) : "";
const ADD_DESCRIPTIONS = Boolean(argv.description);
const REGISTRY_NAME = argv["registry-name"] || "local";
const REGISTRY_HOMEPAGE = argv["registry-homepage"] || "";
const SPLIT_ITEMS = Boolean(argv["split-items"]);

const DEP_IGNORES = argv["ignore-deps"]
  ? String(argv["ignore-deps"])
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : [
      "react",
      "react-dom",
      "next",
      "next/navigation",
      "next/router",
      "next/link",
      "next/image",
    ];

const INTERNAL_ROOTS = argv["internal-roots"]
  ? String(argv["internal-roots"])
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : ["src/", "@/", "~/", "#/"];

let REG_DEP_BASE =
  argv["registry-dependency-base-url"] || "http://localhost:3000/r/";
if (!REG_DEP_BASE.endsWith("/")) REG_DEP_BASE += "/";

const DEFAULT_BASIC_COMPONENTS = [
  "alert",
  "avatar",
  "button",
  "card",
  "checkbox",
  "dialog",
  "drawer",
  "dropdown-menu",
  "form",
  "input",
  "input-otp",
  "label",
  "select",
  "separator",
  "skeleton",
  "tabs",
  "textarea",
];
const BASIC_COMPONENTS = new Set(
  (argv["basic-components"]
    ? String(argv["basic-components"])
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : DEFAULT_BASIC_COMPONENTS
  ).map((s) => s.toLowerCase()),
);

const SORT_ORDER = ["name", "path"].includes(argv.sort) ? argv.sort : "name";

// ------------------------- Helpers -------------------------------------------
function toPosix(p) {
  return p.replace(/\\/g, "/");
}

function slugify(str) {
  return str
    .replace(/\\/g, "/")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9/_-]+/g, "-")
    .replace(/\/+/g, "/")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .replace(/\/+/g, "/")
    .replace(/^-+/, "")
    .replace(/-+/g, "-");
}

function basenameNoExt(file) {
  return path.basename(file).replace(/\.[^.]+$/, "");
}

function titleCaseFromName(name) {
  return name
    .split(/[-_/]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function guessDescription(relPath, name) {
  if (!ADD_DESCRIPTIONS) return "";
  const parts = relPath.split("/");
  const context = parts.slice(0, -1).join("/");
  return `Auto-generated registry entry for ${name} (source: ${relPath}${context ? ", context: " + context : ""}).`;
}

function passesFilters(relPath) {
  if (
    INCLUDE_FILTERS.length &&
    !INCLUDE_FILTERS.some((f) => relPath.includes(f))
  )
    return false;
  if (
    EXCLUDE_FILTERS.length &&
    EXCLUDE_FILTERS.some((f) => relPath.includes(f))
  )
    return false;
  return true;
}

async function walk(dir, collector = []) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return collector;
  }
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(abs, collector);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (EXTENSIONS.includes(ext)) {
        const rel = toPosix(path.relative(PROJECT_ROOT, abs));
        if (passesFilters(rel)) collector.push({ abs, rel });
      }
    }
  }
  return collector;
}

async function parseStructureFile(file) {
  const text = await fs.readFile(file, "utf8");
  const lines = text.split(/\r?\n/);
  const matches = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    for (const ext of EXTENSIONS) {
      if (line.endsWith(ext)) {
        let rel = line.replace(/^\.\/+/, "").replace(/^[\-\*\d\.\)]+\s*/, "");
        if (!rel.startsWith("src/")) {
          if (
            /(^components\/|^hooks\/|^lib\/|^localization\/|^types\/)/.test(rel)
          )
            rel = `src/${rel}`;
          else continue;
        }
        matches.push({ abs: path.join(PROJECT_ROOT, rel), rel });
        break;
      }
    }
  }
  return matches;
}

async function resolveImport(fromFileRel, importSource) {
  if (!importSource.startsWith(".")) return null;
  const fromDirAbs = path.dirname(path.join(PROJECT_ROOT, fromFileRel));
  const base = path.normalize(path.join(fromDirAbs, importSource));
  const candidates = [];
  candidates.push(base);
  for (const ext of EXTENSIONS) candidates.push(base + ext);
  for (const ext of EXTENSIONS) candidates.push(path.join(base, "index" + ext));

  const seen = new Set();
  for (const abs of candidates) {
    const norm = abs.toLowerCase();
    if (seen.has(norm)) continue;
    seen.add(norm);
    try {
      const stat = await fs.stat(abs);
      if (stat.isFile()) {
        return toPosix(path.relative(PROJECT_ROOT, abs));
      }
    } catch {
      /* ignore */
    }
  }
  return null;
}

function isExternalImport(source) {
  if (source.startsWith(".") || source.startsWith("/")) return false;
  if (INTERNAL_ROOTS.some((r) => source.startsWith(r))) return false;
  return true;
}

function normalizePackageName(spec) {
  if (spec.startsWith("@")) {
    const parts = spec.split("/");
    return parts.length > 2 ? parts.slice(0, 2).join("/") : spec;
  }
  return spec.split("/")[0];
}

async function readFileContent(abs) {
  try {
    return await fs.readFile(abs, "utf8");
  } catch {
    return "";
  }
}

// Import detection regex (heuristic)
const IMPORT_RE =
  /\bimport\s+(?:[\s\S]*?)\s+from\s+['"]([^'"]+)['"]|import\(['"]([^'"]+)['"]\)|export\s+\*\s+from\s+['"]([^'"]+)['"]/g;

// Classification function
function classify(rel) {
  if (rel.startsWith("src/components/ui/")) return "registry:ui";
  if (rel.startsWith("src/components/")) return "registry:component";
  if (rel.startsWith("src/hooks/")) return "registry:hook";
  if (rel.startsWith("src/lib/")) return "registry:lib";
  if (rel.startsWith("src/localization/")) return "registry:file";
  if (rel.startsWith("src/types/")) return "registry:file";
  return "registry:file";
}

// Compute target for registry:file (required for ALL registry:file now)
function computeFileTarget(rel) {
  if (rel.startsWith("src/localization/")) {
    return `localization/${path.basename(rel)}`;
  }
  if (rel.startsWith("src/types/")) {
    return `types/${path.basename(rel)}`;
  }
  // fallback: path relative to src/
  return rel.startsWith("src/") ? rel.slice(4) : rel;
}

// ------------------------- Main ----------------------------------------------
async function main() {
  let fileEntries = [];

  if (PARSE_STRUCTURE) {
    fileEntries = await parseStructureFile(PARSE_STRUCTURE);
  } else {
    for (const dir of SCAN_DIRS) {
      const absDir = path.join(PROJECT_ROOT, dir);
      fileEntries = fileEntries.concat(await walk(absDir));
    }
  }

  // Deduplicate
  const seen = new Set();
  fileEntries = fileEntries.filter((f) => {
    if (seen.has(f.rel)) return false;
    seen.add(f.rel);
    return true;
  });

  const items = [];
  for (const f of fileEntries) {
    const rel = f.rel;
    const base = basenameNoExt(rel);
    const name =
      NAME_STRATEGY === "basename"
        ? NAME_PREFIX + slugify(base)
        : NAME_PREFIX +
          slugify(rel.replace(/\.[^.]+$/, "").replace(/^src\//, ""));
    const title = titleCaseFromName(name.replace(NAME_PREFIX, ""));
    const description = guessDescription(rel, name);
    const content = await readFileContent(f.abs);
    const type = classify(rel);

    const fileObj = {
      path: rel,
      type,
      ...(INLINE_CONTENT ? { content } : {}),
    };

    if (type === "registry:file") {
      fileObj.target = computeFileTarget(rel);
    }

    // Optionally also add an item-level target ONLY for localization/types (legacy behavior)
    const itemLevelTarget =
      rel.startsWith("src/localization/") || rel.startsWith("src/types/")
        ? computeFileTarget(rel)
        : undefined;

    items.push({
      __path: rel,
      __content: content,
      name,
      title,
      description,
      type,
      ...(itemLevelTarget ? { target: itemLevelTarget } : {}),
      dependencies: [], // external packages only
      registryDependencies: [], // internal modules & components
      files: [fileObj],
    });
  }

  // Lookup maps
  const pathToItem = new Map();
  for (const item of items) {
    const full = item.__path;
    pathToItem.set(full, item.name);
    pathToItem.set(full.replace(/\.[^.]+$/, ""), item.name);
  }

  // Dependency extraction
  for (const item of items) {
    const content = item.__content;
    if (!content) {
      delete item.__content;
      delete item.__path;
      continue;
    }

    const externals = new Set();
    const registryDeps = new Set();

    IMPORT_RE.lastIndex = 0;
    let match;
    while ((match = IMPORT_RE.exec(content)) !== null) {
      const source = match[1] || match[2] || match[3];
      if (!source) continue;

      if (isExternalImport(source)) {
        const pkg = normalizePackageName(source);
        if (!DEP_IGNORES.includes(pkg)) externals.add(pkg);
      } else {
        if (source.startsWith(".")) {
          const resolved = await resolveImport(item.__path, source);
          if (resolved) {
            const candidate =
              pathToItem.get(resolved) ||
              pathToItem.get(resolved.replace(/\.[^.]+$/, ""));
            if (candidate && candidate !== item.name)
              registryDeps.add(candidate);
          }
        } else if (INTERNAL_ROOTS.some((r) => source.startsWith(r))) {
          let normalized = source;
          if (source.startsWith("@/")) normalized = "src/" + source.slice(2);
          if (normalized.startsWith("src/")) {
            const direct = normalized;
            const noExt = direct.replace(/\.[^.]+$/, "");
            const candidate = pathToItem.get(direct) || pathToItem.get(noExt);
            if (candidate && candidate !== item.name)
              registryDeps.add(candidate);
          }
        }
      }
    }

    const transformedRegistryDeps = Array.from(registryDeps)
      .sort()
      .map((dep) => {
        if (/^https?:\/\//.test(dep)) return dep;
        return BASIC_COMPONENTS.has(dep.toLowerCase())
          ? dep
          : `${REG_DEP_BASE}${dep}.json`;
      });

    item.dependencies = Array.from(externals).sort();
    item.registryDependencies = transformedRegistryDeps;

    delete item.__content;
    delete item.__path;
  }

  // Sorting
  if (SORT_ORDER === "name") {
    items.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    items.sort((a, b) => a.files[0].path.localeCompare(b.files[0].path));
  }

  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: REGISTRY_NAME,
    ...(REGISTRY_HOMEPAGE ? { homepage: REGISTRY_HOMEPAGE } : {}),
    items,
  };

  if (DRY_RUN) {
    console.log("(dry-run) Summary:");
    console.log(
      JSON.stringify(
        {
          name: registry.name,
          homepage: registry.homepage,
          scanDirs: SCAN_DIRS,
          items: registry.items.length,
          fileTypeTargetsSample: registry.items
            .filter((i) => i.type === "registry:file")
            .slice(0, 5)
            .map((i) => ({
              name: i.name,
              itemTarget: i.target,
              fileTarget: i.files[0].target,
            })),
          sample: registry.items.slice(0, 6).map((i) => ({
            name: i.name,
            type: i.type,
            fileTarget: i.files[0].target,
            deps: i.dependencies,
            registryDeps: i.registryDependencies,
          })),
        },
        null,
        2,
      ),
    );
    return;
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  if (SPLIT_ITEMS) {
    const ITEMS_DIR = path.join(OUT_DIR, "components");
    await fs.mkdir(ITEMS_DIR, { recursive: true });
    for (const item of items) {
      await fs.writeFile(
        path.join(ITEMS_DIR, `${item.name}.json`),
        JSON.stringify(item, null, 2) + "\n",
        "utf8",
      );
    }
  }

  const registryPath = path.join(OUT_DIR, "registry.json");
  await fs.writeFile(
    registryPath,
    JSON.stringify(registry, null, 2) + "\n",
    "utf8",
  );

  console.log(`Registry generated: ${registryPath}`);
  console.log(`Items: ${items.length}`);
  console.log(
    INLINE_CONTENT
      ? "File contents embedded."
      : "Run with --hydrate to embed file contents.",
  );
  console.log("All registry:file entries have file-level targets.");
  if (SPLIT_ITEMS) {
    console.log("Per-item JSON files written to registry/components/*.json");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
