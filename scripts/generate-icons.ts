import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const source = path.join(root, "public", "assets", "trackdiri-logo.png");
const outDir = path.join(root, "public", "assets", "icons");
const sizes = [16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 384, 512];

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  await Promise.all(
    sizes.map((size) =>
      sharp(source)
        .resize(size, size, { fit: "contain", background: { r: 230, g: 247, b: 255, alpha: 0 } })
        .png()
        .toFile(path.join(outDir, `icon-${size}.png`))
    )
  );
  await sharp(source)
    .resize(410, 410, { fit: "contain", background: { r: 230, g: 247, b: 255, alpha: 0 } })
    .extend({ top: 51, bottom: 51, left: 51, right: 51, background: { r: 230, g: 247, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, "maskable-512.png"));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
