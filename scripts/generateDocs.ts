import fs from "node:fs";
import path from "node:path";

// Basic file utilities
async function readFile(filePath: string): Promise<string> {
  return fs.promises.readFile(filePath, "utf8");
}

async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  await fs.promises.writeFile(filePath, content, "utf8");
}

async function listFilesRecursively(dir: string): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursively(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

// Helpers to extract data
type ConvexFunction = {
  name: string;
  kind: "query" | "mutation" | "action";
  file: string;
  args: string[];
};

type ComponentExport = {
  name: string;
  file: string;
  isDefault: boolean;
};

type HookExport = {
  name: string;
  file: string;
};

type ApiRoute = {
  method: string;
  file: string;
  routePath: string; // Next.js route path inferred from filesystem
};

type ConvexHttpRoute = {
  method: string;
  path: string;
};

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function toPosix(p: string) {
  return p.split(path.sep).join("/");
}

// Extract args from a snippet like `args: { id: v.id("vehicles"), search: v.string() }`
function extractArgsFromSnippet(code: string): string[] {
  const argsBlockMatch = code.match(/args\s*:\s*\{([\s\S]*?)\}/);
  if (!argsBlockMatch) return [];
  const argsBlock = argsBlockMatch[1];
  const argNames = Array.from(argsBlock.matchAll(/\b([A-Za-z0-9_]+)\s*:/g)).map(m => m[1]);
  return uniq(argNames);
}

async function collectConvexFunctions(root: string): Promise<ConvexFunction[]> {
  const convexDir = path.join(root, "convex");
  if (!fs.existsSync(convexDir)) return [];
  const files = (await listFilesRecursively(convexDir)).filter(f => /\.(ts|js)$/.test(f));
  const results: ConvexFunction[] = [];
  for (const file of files) {
    const code = await readFile(file);
    const re = /export\s+const\s+([A-Za-z0-9_]+)\s*=\s*(query|mutation|action)\s*\(/g;
    let match: RegExpExecArray | null;
    while ((match = re.exec(code)) !== null) {
      const [_, name, kind] = match;
      const tail = code.slice(match.index, match.index + 2000); // read ahead for args
      const args = extractArgsFromSnippet(tail);
      results.push({ name, kind: kind as ConvexFunction["kind"], file: toPosix(path.relative(root, file)), args });
    }
  }
  return results.sort((a, b) => a.file.localeCompare(b.file) || a.name.localeCompare(b.name));
}

async function collectComponents(root: string): Promise<ComponentExport[]> {
  const componentsDir = path.join(root, "src", "components");
  if (!fs.existsSync(componentsDir)) return [];
  const files = (await listFilesRecursively(componentsDir)).filter(f => f.endsWith(".tsx"));
  const results: ComponentExport[] = [];
  for (const file of files) {
    const code = await readFile(file);
    const defaultMatches = Array.from(code.matchAll(/export\s+default\s+function\s+([A-Z][A-Za-z0-9_]*)/g));
    for (const m of defaultMatches) {
      results.push({ name: m[1], file: toPosix(path.relative(root, file)), isDefault: true });
    }
    const namedMatches = Array.from(code.matchAll(/export\s+(?:function|const)\s+([A-Z][A-Za-z0-9_]*)/g));
    for (const m of namedMatches) {
      // Avoid double-counting default export if same name captured also as named
      const exists = results.find(r => r.file === toPosix(path.relative(root, file)) && r.name === m[1]);
      if (!exists) results.push({ name: m[1], file: toPosix(path.relative(root, file)), isDefault: false });
    }
  }
  return results.sort((a, b) => a.file.localeCompare(b.file) || a.name.localeCompare(b.name));
}

async function collectHooks(root: string): Promise<HookExport[]> {
  const hooksDir = path.join(root, "src", "hooks");
  if (!fs.existsSync(hooksDir)) return [];
  const files = (await listFilesRecursively(hooksDir)).filter(f => f.endsWith(".ts") || f.endsWith(".tsx"));
  const results: HookExport[] = [];
  for (const file of files) {
    const code = await readFile(file);
    const matches = Array.from(code.matchAll(/export\s+function\s+(use[A-Za-z0-9_]+)/g));
    for (const m of matches) {
      results.push({ name: m[1], file: toPosix(path.relative(root, file)) });
    }
    const constMatches = Array.from(code.matchAll(/export\s+const\s+(use[A-Za-z0-9_]+)\s*=/g));
    for (const m of constMatches) {
      results.push({ name: m[1], file: toPosix(path.relative(root, file)) });
    }
  }
  return results.sort((a, b) => a.file.localeCompare(b.file) || a.name.localeCompare(b.name));
}

function inferNextRouteFromFile(file: string): string {
  // file like src/app/api/download-url/route.ts -> /api/download-url
  const parts = toPosix(file).split("/");
  const apiIdx = parts.indexOf("api");
  if (apiIdx === -1) return "/api";
  const routeParts: string[] = [];
  for (let i = apiIdx + 1; i < parts.length; i++) {
    if (parts[i] === "route.ts" || parts[i] === "route.js") break;
    routeParts.push(parts[i]);
  }
  return "/api/" + routeParts.join("/");
}

async function collectNextApiRoutes(root: string): Promise<ApiRoute[]> {
  const apiDir = path.join(root, "src", "app", "api");
  if (!fs.existsSync(apiDir)) return [];
  const files = (await listFilesRecursively(apiDir)).filter(f => /route\.(ts|js)$/.test(f));
  const results: ApiRoute[] = [];
  for (const file of files) {
    const code = await readFile(file);
    const methods = Array.from(code.matchAll(/export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)/g)).map(m => m[1]);
    const uniqueMethods = uniq(methods);
    for (const method of uniqueMethods) {
      results.push({ method, file: toPosix(path.relative(root, file)), routePath: inferNextRouteFromFile(file) });
    }
  }
  return results.sort((a, b) => a.routePath.localeCompare(b.routePath) || a.method.localeCompare(b.method));
}

async function collectConvexHttpRoutes(root: string): Promise<ConvexHttpRoute[]> {
  const httpFile = path.join(root, "convex", "http.ts");
  if (!fs.existsSync(httpFile)) return [];
  const code = await readFile(httpFile);
  const routes: ConvexHttpRoute[] = [];
  const re = /http\.route\s*\(\s*\{[\s\S]*?path:\s*"([^"]+)",[\s\S]*?method:\s*"([A-Z]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code)) !== null) {
    routes.push({ path: m[1], method: m[2] });
  }
  return routes;
}

function header(text: string, level = 2): string {
  return `${"#".repeat(level)} ${text}`;
}

function fence(lang: string, code: string): string {
  return "```" + lang + "\n" + code + "\n```";
}

function link(relPath: string): string {
  return relPath;
}

function makeConvexUsageExample(fn: ConvexFunction): string {
  const apiPath = toPosix(fn.file)
    .replace(/^convex\//, "")
    .replace(/\.(ts|js)$/, "")
    .replace(/\//g, ".");
  const argsObject = fn.args.length ? `{ ${fn.args.map(a => `${a}: /* value */`).join(", ")} }` : "{}";
  const hook = fn.kind === "query" ? "useQuery" : fn.kind === "mutation" ? "useMutation" : "useAction";
  if (fn.kind === "query") {
    return fence("tsx", `import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";

const data = useQuery(api.${apiPath}.${fn.name}, ${argsObject});`);
  }
  if (fn.kind === "mutation") {
    return fence("tsx", `import { useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";

const mutate = useMutation(api.${apiPath}.${fn.name});
await mutate(${argsObject});`);
  }
  return fence("tsx", `import { useAction } from "convex/react";
import { api } from "@/../convex/_generated/api";

const run = useAction(api.${apiPath}.${fn.name});
const result = await run(${argsObject});`);
}

function makeNextApiExample(route: ApiRoute): string {
  const url = route.routePath;
  if (route.method === "GET") {
    return fence("bash", `curl -G --data-urlencode "param=value" http://localhost:3000${url}`);
  }
  return fence("bash", `curl -X ${route.method} -H "Content-Type: application/json" -d '{"key":"value"}' http://localhost:3000${url}`);
}

function makeConvexHttpExample(route: ConvexHttpRoute): string {
  return fence("bash", `curl -X ${route.method} -H "Content-Type: application/json" -d '{}' https://<your-convex-deployment>${route.path}`);
}

async function generateDocs() {
  const root = process.cwd();

  const [convexFns, components, hooks, nextRoutes, convexHttpRoutes] = await Promise.all([
    collectConvexFunctions(root),
    collectComponents(root),
    collectHooks(root),
    collectNextApiRoutes(root),
    collectConvexHttpRoutes(root),
  ]);

  // Index
  const indexMd = [
    header("API Reference", 2),
    "",
    "This directory contains documentation for public APIs, Convex functions, React components, and hooks.",
    "",
    "- " + link("./nextjs-api.md") + " — Next.js API routes",
    "- " + link("./convex-http.md") + " — Convex HTTP routes",
    "- " + link("./convex-functions.md") + " — Convex queries, mutations, and actions",
    "- " + link("./components.md") + " — React components",
    "- " + link("./hooks.md") + " — Custom React hooks",
    "",
  ].join("\n");

  // Next.js API routes
  const nextApiMd = [
    header("Next.js API Routes", 2),
    "",
    ...nextRoutes.map(r => [
      header(`${r.method} ${r.routePath}`, 3),
      `File: \
${r.file}`,
      "",
      "Example:",
      makeNextApiExample(r),
      "",
    ].join("\n")),
  ].join("\n");

  // Convex HTTP routes
  const convexHttpMd = [
    header("Convex HTTP Routes", 2),
    "",
    ...convexHttpRoutes.map(r => [
      header(`${r.method} ${r.path}`, 3),
      "",
      "Example:",
      makeConvexHttpExample(r),
      "",
    ].join("\n")),
  ].join("\n");

  // Convex functions
  const groupedByFile: Record<string, ConvexFunction[]> = {};
  for (const fn of convexFns) {
    groupedByFile[fn.file] = groupedByFile[fn.file] || [];
    groupedByFile[fn.file].push(fn);
  }
  const convexFnsMdParts: string[] = [header("Convex Functions", 2), ""];
  for (const file of Object.keys(groupedByFile).sort()) {
    convexFnsMdParts.push(header(file, 3));
    convexFnsMdParts.push("");
    for (const fn of groupedByFile[file]) {
      convexFnsMdParts.push(`- ${fn.kind} ${fn.name}${fn.args.length ? `(args: ${fn.args.join(", ")})` : "()"}`);
      convexFnsMdParts.push("  ");
      convexFnsMdParts.push("  Example:");
      convexFnsMdParts.push(makeConvexUsageExample(fn));
      convexFnsMdParts.push("");
    }
  }
  const convexFnsMd = convexFnsMdParts.join("\n");

  // Components
  const groupedComponents: Record<string, ComponentExport[]> = {};
  for (const c of components) {
    groupedComponents[c.file] = groupedComponents[c.file] || [];
    groupedComponents[c.file].push(c);
  }
  const componentsMdParts: string[] = [header("React Components", 2), "", "Import using your project's alias paths or relative imports.", ""]; 
  for (const file of Object.keys(groupedComponents).sort()) {
    componentsMdParts.push(header(file, 3));
    const exports = groupedComponents[file]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(e => `- ${e.isDefault ? "default " : ""}${e.name}`);
    componentsMdParts.push(exports.join("\n"));
    componentsMdParts.push("");
  }
  const componentsMd = componentsMdParts.join("\n");

  // Hooks
  const groupedHooks: Record<string, HookExport[]> = {};
  for (const h of hooks) {
    groupedHooks[h.file] = groupedHooks[h.file] || [];
    groupedHooks[h.file].push(h);
  }
  const hooksMdParts: string[] = [header("Custom Hooks", 2), ""];
  for (const file of Object.keys(groupedHooks).sort()) {
    hooksMdParts.push(header(file, 3));
    hooksMdParts.push("");
    for (const h of groupedHooks[file].sort((a, b) => a.name.localeCompare(b.name))) {
      hooksMdParts.push(`- ${h.name}`);
      hooksMdParts.push("  ");
      hooksMdParts.push("  Example:");
      hooksMdParts.push(fence("tsx", `import { ${h.name} } from "@/${toPosix(file).replace(/^src\//, "").replace(/\.(ts|tsx)$/, "")}";

const value = ${h.name}(/* params */);`));
      hooksMdParts.push("");
    }
  }
  const hooksMd = hooksMdParts.join("\n");

  // Write files
  const outDir = path.join(root, "docs", "api-reference");
  await writeFile(path.join(outDir, "README.md"), indexMd);
  await writeFile(path.join(outDir, "nextjs-api.md"), nextApiMd);
  await writeFile(path.join(outDir, "convex-http.md"), convexHttpMd);
  await writeFile(path.join(outDir, "convex-functions.md"), convexFnsMd);
  await writeFile(path.join(outDir, "components.md"), componentsMd);
  await writeFile(path.join(outDir, "hooks.md"), hooksMd);

  // Also update docs/README.md entry
  const docsRootReadme = path.join(root, "docs", "README.md");
  let docsReadme = fs.existsSync(docsRootReadme) ? await readFile(docsRootReadme) : "";
  const marker = "<!-- AUTO-GENERATED-API-REFERENCE -->";
  const block = [
    marker,
    "\n",
    header("API Reference", 3),
    "",
    "See `docs/api-reference/` for full reference:",
    "",
    "- api-reference/nextjs-api.md",
    "- api-reference/convex-http.md",
    "- api-reference/convex-functions.md",
    "- api-reference/components.md",
    "- api-reference/hooks.md",
    "",
    marker,
  ].join("\n");
  if (docsReadme.includes(marker)) {
    docsReadme = docsReadme.replace(new RegExp(`${marker}[\s\S]*${marker}`, "m"), block);
  } else {
    docsReadme = (docsReadme ? docsReadme + "\n\n" : "") + block;
  }
  await writeFile(docsRootReadme, docsReadme);

  // Log summary
  const summary = {
    nextApiRoutes: nextRoutes.length,
    convexHttpRoutes: convexHttpRoutes.length,
    convexFunctions: convexFns.length,
    components: components.length,
    hooks: hooks.length,
  };
  await writeFile(path.join(outDir, "_summary.json"), JSON.stringify(summary, null, 2));
}

generateDocs().catch(err => {
  console.error("Failed to generate docs:", err);
  process.exit(1);
});