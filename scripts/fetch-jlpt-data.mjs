import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const jsonBase = "https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json";
const noticeUrl = "https://raw.githubusercontent.com/evanclan/OpenJLPT/main/NOTICE.md";

const levels = ["n5", "n4", "n3", "n2", "n1"];
const kinds = ["vocab", "kanji", "grammar"];

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

for (const kind of kinds) {
  for (const level of levels) {
    const text = await fetchText(`${jsonBase}/${kind}/${level}.json`);
    JSON.parse(text);
    const dest = join(root, "src", "data", "jp", kind, `${level}.json`);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, text);
    console.log(`saved ${kind}/${level}.json (${(text.length / 1024).toFixed(0)} KB)`);
  }
}

const meta = await fetchText(`${jsonBase}/meta.json`);
JSON.parse(meta);
await writeFile(join(root, "src", "data", "jp", "meta.json"), meta);
console.log("saved meta.json");

const notice = await fetchText(noticeUrl);
const credits = [
  "# Data credits",
  "",
  "Learning data is from [OpenJLPT](https://github.com/evanclan/OpenJLPT),",
  "licensed under CC BY-SA 4.0. Upstream attribution follows below.",
  "",
  "---",
  "",
  notice,
  "",
].join("\n");
await writeFile(join(root, "src", "data", "jp", "CREDITS.md"), credits);
console.log("saved CREDITS.md");
