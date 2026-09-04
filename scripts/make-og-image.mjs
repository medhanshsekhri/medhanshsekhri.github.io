/**
 * Generates the 1200x630 Open Graph card at public/og.png.
 *
 * Drawn as SVG and rasterised with sharp, so it needs no browser and no
 * external assets. Colours are lifted from the light theme in globals.css
 * (--clr-bg, --clr-text, --clr-muted, --clr-accent).
 *
 * Run:  node scripts/make-og-image.mjs
 */

import sharp from "sharp";
import path from "node:path";

const W = 1200;
const H = 630;

const BG = "#FFF7FB";
const TEXT = "#2D2D2D";
const MUTED = "#6B6B6B";
const ACCENT = "#E04B52";
const BORDER = "#EAEAEA";

// Generic families only: the rasteriser has no access to the site webfonts.
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Helvetica, Arial, sans-serif";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>

  <!-- hairline frame, echoing the dashed section rules on the site -->
  <rect x="48" y="48" width="${W - 96}" height="${H - 96}" fill="none"
        stroke="${BORDER}" stroke-width="2" stroke-dasharray="10 8"/>

  <text x="104" y="196" font-family="${SANS}" font-size="22" fill="${MUTED}"
        letter-spacing="6">MECHANICAL &amp; AEROSPACE ENGINEERING</text>

  <text x="100" y="330" font-family="${SERIF}" font-size="104" font-weight="600" fill="${TEXT}">
    Medhansh Sekhri<tspan fill="${ACCENT}">.</tspan>
  </text>

  <text x="104" y="404" font-family="${SANS}" font-size="30" fill="${MUTED}">
    Building autonomous systems from scratch.
  </text>

  <line x1="104" y1="470" x2="248" y2="470" stroke="${ACCENT}" stroke-width="4"/>

  <text x="104" y="536" font-family="${SANS}" font-size="25" fill="${TEXT}">
    University of Queensland &#183; BEng(Hons) + MEng
  </text>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(path.join(process.cwd(), "public", "og.png"));

console.log("wrote public/og.png (1200x630)");
