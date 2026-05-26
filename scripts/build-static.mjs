import { cp, mkdir, rm } from "node:fs/promises";

const files = [
  "index.html",
  "icon.svg",
  "manifest.webmanifest",
  "sw.js",
  "src/app.js",
  "src/styles.css",
];

await rm("dist", { force: true, recursive: true });
await mkdir("dist/src", { recursive: true });

await Promise.all(
  files.map((file) =>
    cp(file, `dist/${file}`, {
      force: true,
      recursive: true,
    })
  )
);
