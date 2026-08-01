import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const pathFor = (path) => fileURLToPath(new URL(path, import.meta.url));

const appIcon = await readFile(pathFor("../public/app-icon.svg"));
const favicon = await readFile(pathFor("../public/favicon.svg"));
const ogImage = await readFile(pathFor("../public/og-image.svg"));

await Promise.all([
  sharp(appIcon).resize(180, 180).png().toFile(pathFor("../public/apple-touch-icon.png")),
  sharp(appIcon).resize(192, 192).png().toFile(pathFor("../public/icon-192.png")),
  sharp(appIcon).resize(512, 512).png().toFile(pathFor("../public/icon-512.png")),
  sharp(ogImage).resize(1200, 630).png().toFile(pathFor("../public/og-image.png")),
]);

const faviconPng = await sharp(favicon).resize(64, 64).png().toBuffer();
const icoHeader = Buffer.alloc(22);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);
icoHeader.writeUInt8(64, 6);
icoHeader.writeUInt8(64, 7);
icoHeader.writeUInt16LE(1, 10);
icoHeader.writeUInt16LE(32, 12);
icoHeader.writeUInt32LE(faviconPng.length, 14);
icoHeader.writeUInt32LE(22, 18);
await writeFile(pathFor("../public/favicon.ico"), Buffer.concat([icoHeader, faviconPng]));
