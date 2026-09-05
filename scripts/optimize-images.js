// scripts/optimize-images.js
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "assets/img/src");
const OUT = path.join(ROOT, "assets/img/dist");
const WIDTHS = [480, 768, 1200, 1920];

// Duyệt đệ quy, trả về đường dẫn tương đối so với SRC
function walk(dir, base = "") {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) {
      result.push(...walk(path.join(dir, entry.name), rel));
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      result.push(rel);
    }
  }
  return result;
}

const files = walk(SRC);
let totalIn = 0;
let totalOut = 0;

for (const rel of files) {
  const input = path.join(SRC, rel);
  const subDir = path.dirname(rel);              // "" nếu ở gốc, "banners" nếu trong thư mục con
  const name = path.parse(rel).name;
  const outDir = path.join(OUT, subDir);

  fs.mkdirSync(outDir, { recursive: true });     // tạo lại đúng cây thư mục

  const meta = await sharp(input).metadata();
  totalIn += fs.statSync(input).size;

  const widths = WIDTHS.filter((w) => w <= meta.width);
  if (widths.length === 0) widths.push(meta.width);

  for (const w of widths) {
    const webp = path.join(outDir, `${name}-${w}.webp`);
    const avif = path.join(outDir, `${name}-${w}.avif`);

    if (!fs.existsSync(webp)) {
      await sharp(input).resize(w).webp({ quality: 78 }).toFile(webp);
    }
    if (!fs.existsSync(avif)) {
      await sharp(input).resize(w).avif({ quality: 55 }).toFile(avif);
    }
    totalOut += fs.statSync(webp).size;
  }

  const fallbackW = Math.min(1200, meta.width);
  const jpg = path.join(outDir, `${name}-${fallbackW}.jpg`);
  if (!fs.existsSync(jpg)) {
    await sharp(input)
      .resize(fallbackW)
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(jpg);
  }

  console.log(`${rel}  ${meta.width}x${meta.height}  →  ${widths.length} sizes`);
}

const mb = (n) => (n / 1024 / 1024).toFixed(2) + " MB";
console.log(`\n${files.length} ảnh   Gốc: ${mb(totalIn)}  →  WebP: ${mb(totalOut)}`);