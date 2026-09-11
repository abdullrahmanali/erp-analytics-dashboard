/**
 * build.js — a tiny esbuild script that bundles the React app.
 *
 * No Vite/webpack config here on purpose: esbuild alone is enough for
 * a project this size, and a small build script you can actually read
 * top to bottom teaches more than a generated config file would.
 *
 * Run: bun run build.js
 */
import * as esbuild from "esbuild";
import { mkdirSync, copyFileSync, writeFileSync } from "fs";

mkdirSync("dist", { recursive: true });

await esbuild.build({
  entryPoints: ["src/main.jsx"],
  bundle: true,
  outfile: "dist/bundle.js",
  loader: { ".css": "css", ".jsx": "jsx" },
  jsx: "automatic",
  minify: true,
  sourcemap: true,
  define: { "process.env.NODE_ENV": '"production"' },
});

copyFileSync("index.html", "dist/index.html");

console.log("Built dist/bundle.js and dist/index.html");
