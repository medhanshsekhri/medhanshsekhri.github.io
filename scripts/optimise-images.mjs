/**
 * One-off image optimiser.
 *
 * Reads every raster source in src-images/ (outside public/, gitignored) and
 * writes WebP outputs into public/. For each image it emits two tiers so the
 * markup can offer a real srcset:
 *
 *   name.webp      1x - the largest width the image is actually displayed at
 *   name@2x.webp   2x - retina headroom
 *
 * plus, for images that open in the modal lightbox, a name-full.webp sized for
 * a full-viewport view.
 *
 * Run:  node scripts/optimise-images.mjs
 *
 * ---------------------------------------------------------------------------
 * DISPLAY WIDTHS
 *
 * Every number below was derived by reading the components, not guessed. The
 * layout constants that drive them:
 *
 *   Home sections   px-6 md:px-16   -> content = vw-48 (mobile), vw-128 (md+)
 *                                      capped at a 1920px viewport => 1792px
 *   Modal           max-w-4xl (896) + md:px-10  -> content 816px
 *                   on mobile the sheet is full width -> vw-48
 *   /projects page  max-w-5xl (1024) + px-8     -> content 960px
 *   WhyMe           max-w-5xl, md:grid-cols-2 gap-16 -> column 480px
 *
 * A value is the MAXIMUM across every place the file is used, because one file
 * serves one WebP. Where 2x overshoots the source, the source width wins
 * (withoutEnlargement) - noted as "capped" below.
 * ---------------------------------------------------------------------------
 */

import sharp from "sharp";
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const SRC_DIR = path.join(process.cwd(), "src-images");
const OUT_DIR = path.join(process.cwd(), "public");
const DPR = 2;

/** Largest CSS-pixel width each image is ever rendered at. */
const DISPLAY_WIDTHS = {
  // --- Home: Projects featured card (grid md:grid-cols-2, image = half) ---
  // 1792/2 = 896 on desktop; 719 at the widest mobile 1-col.
  "Frontview_FRH.jpg": 896,

  // --- Home: Projects uniform grid (sm:grid-cols-2 lg:grid-cols-3 gap-5) ---
  // Widest is the 1-col mobile case at 639px vw: 639-48 = 591.
  // (3-col at 1920 is 584; 2-col just under lg is 477.)
  "frontview.jpg": 591, // also /projects 2-col (341) + radar modal 4-up (290)
  "tower_side.jpg": 591, // also modal flex h-260 (402), /projects 2-col (341)
  "rover_front.jpg": 591, // also modal maxHeight 200 (92), /projects (341)

  // Grid card (591) vs /projects single-photo column (695 at 767px mobile:
  // 767 - 40 page padding - 32 card padding = 695). The page wins.
  "dragster.jpg": 695,
  "rocket_upright.jpg": 695,

  // --- Home: Projects modal galleries ---
  // FRH 3-up: grid-cols-1 sm:grid-cols-3. Widest = 1-col at 639px vw = 591.
  "Backview_FRH.jpg": 591,
  "Topview_FRH.jpg": 591,
  // Radar 4-up: grid-cols-2 md:grid-cols-4 -> 2-col mobile 290, 4-col 195.
  // topview/sideview also appear on /projects in a 2-col grid at 341.
  "topview.jpg": 341,
  "sideview.jpg": 341,
  "topview2.jpg": 290, // modal 4-up only
  // Rocket modal renders at width:100% of the 816px modal content box.
  "rocket.jpg": 816,
  // Tower modal is a 2-up flex row at height 260 -> ~402 wide each.
  "tower_top.jpg": 402,
  // Rover modal is height-capped at 200 (=> ~92 wide); /projects 2-col is 341.
  "rover_side.jpg": 341,
  // Circuit diagram: modal box is height 200 object-contain (~203 wide);
  // /projects renders it in an aspect-[4/5] tile, 341 at the widest.
  "circuit_image.png": 341,

  // --- Home: Hackathons cards (50/50 above 900px, aspect-video) ---
  // (1792-32)/2 = 880 desktop; 851 just under the 900px breakpoint.
  // Also serves as the modal video poster (816 wide).
  "leapfrog_screenshot.jpg": 880,
  "metrix_screenshot.jpg": 880,

  // Logo plate: height-capped at 64px (48px effective on the card). The source
  // is 128x126, so 2x of its ~65px display width is already the full source.
  "leapfrog_logo.png": 128,

  // --- Home: About photo grid (grid-cols-3 gap-2.5 inside a 480px column) ---
  // Desktop tile (480-20)/3 = 153; widest is mobile at 767px vw:
  // (767-48-20)/3 = 233.
  "diamondda40.jpg": 233,
  "networking.jpg": 233,
  "news.jpg": 233,
  "UQ.jpg": 233,
  "cadets.jpg": 233,
  "pose.jpg": 233,
  "news2.jpg": 233,
  "biology.jpg": 233,
  "nightlight.jpg": 233,
  "wos.jpeg": 233,

  // --- Hero: UQ crest in a 42px circle with 4px padding -> 34px ---
  "UQ-300x300.png": 34,
};

/**
 * Not referenced anywhere in the codebase. Converted at a conservative default
 * so the directory is complete, but nothing links to the output.
 */
const UNREFERENCED_DEFAULT = 800;
const UNREFERENCED = new Set([
  "Soldering.jpg",
  // Replaced in the About grid by wos; source kept, output no longer emitted.
  "news.jpg",
]);

/** Line art and logos keep more quality than photographs. */
const HIGH_QUALITY = new Set([
  "circuit_image.png",
  "leapfrog_logo.png",
  "UQ-300x300.png",
]);

/**
 * Images that appear inside a project modal can be opened in the lightbox,
 * where they render at up to the full viewport rather than their small
 * in-modal thumbnail size. They get a second, larger `-full.webp` variant that
 * the lightbox loads on demand, so the in-page thumbnails stay small.
 * 2400px on the long edge covers a 1440p display at 1x with headroom.
 */
const LIGHTBOX_LONG_EDGE = 2400;
const LIGHTBOX_IMAGES = new Set([
  "Frontview_FRH.jpg", "Backview_FRH.jpg", "Topview_FRH.jpg", // FRH 3-up
  "frontview.jpg", "topview.jpg", "sideview.jpg", "topview2.jpg", // radar 4-up
  "circuit_image.png",                                            // radar diagram
  "dragster.jpg",                                                 // dragster
  "rocket.jpg",                                                   // rocket
  "tower_top.jpg", "tower_side.jpg",                              // tower 2-up
  "rover_front.jpg", "rover_side.jpg",                            // rover 2-up
]);

const RASTER = /\.(jpe?g|png|webp)$/i;

function fmt(bytes) {
  return (bytes / 1024).toFixed(1).padStart(8) + " KB";
}

/** Strip the extension so lookups work whatever the source format is. */
function stem(file) {
  return file.replace(/\.[^.]+$/, "");
}

/** Build a stem-keyed view of a filename-keyed table. */
function byStem(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [stem(k), v]));
}

const DISPLAY_BY_STEM = byStem(DISPLAY_WIDTHS);
const HIGH_QUALITY_STEMS = new Set([...HIGH_QUALITY].map(stem));
const LIGHTBOX_STEMS = new Set([...LIGHTBOX_IMAGES].map(stem));
const UNREFERENCED_STEMS = new Set([...UNREFERENCED].map(stem));

async function main() {
  // Unreferenced sources are kept in src-images/ but produce no output.
  const entries = (await readdir(SRC_DIR))
    .filter((f) => RASTER.test(f) && !UNREFERENCED_STEMS.has(stem(f)))
    .sort();

  let beforeTotal = 0;
  let afterTotal = 0;
  const rows = [];
  // Real emitted widths, so markup can write honest `w` descriptors rather
  // than nominal ones (targets are capped at the source width).
  const manifest = {};

  for (const file of entries) {
    const srcPath = path.join(SRC_DIR, file);
    const outName = file.replace(RASTER, ".webp");
    const outPath = path.join(OUT_DIR, outName);

    const image = sharp(srcPath);
    const meta = await image.metadata();

    const displayWidth = DISPLAY_BY_STEM[stem(file)] ?? UNREFERENCED_DEFAULT;
    const target = Math.min(meta.width, displayWidth);
    const target2x = Math.min(meta.width, Math.ceil(displayWidth * DPR));
    const quality = HIGH_QUALITY_STEMS.has(stem(file)) ? 92 : 80;

    // 1x: exactly the display width, for non-retina screens.
    await sharp(srcPath)
      .resize({ width: target, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(outPath);

    // 2x: retina tier.
    const out2xPath = path.join(OUT_DIR, file.replace(RASTER, "@2x.webp"));
    await sharp(srcPath)
      .resize({ width: target2x, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(out2xPath);
    const size2x = (await stat(out2xPath)).size;
    afterTotal += size2x;

    // Lightbox variant: fit inside a 2400px box, never upscaled.
    let fullNote = "";
    if (LIGHTBOX_STEMS.has(stem(file))) {
      const fullPath = path.join(OUT_DIR, file.replace(RASTER, "-full.webp"));
      await sharp(srcPath)
        .resize({
          width: LIGHTBOX_LONG_EDGE,
          height: LIGHTBOX_LONG_EDGE,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality, effort: 6 })
        .toFile(fullPath);
      const fullSize = (await stat(fullPath)).size;
      afterTotal += fullSize;
      fullNote = ` +${(fullSize / 1024).toFixed(0)}KB full`;
    }

    const before = (await stat(srcPath)).size;
    const after = (await stat(outPath)).size;
    beforeTotal += before;
    afterTotal += after;

    manifest["/" + outName] = { w: target, w2x: target2x };

    rows.push({
      file,
      outName,
      from: `${meta.width}px`,
      to: `${target}/${target2x}px`,
      before,
      after,
      note: ` +${(size2x / 1024).toFixed(0)}KB @2x` + fullNote,
    });
  }

  await writeFile(
    path.join(process.cwd(), "lib", "image-manifest.json"),
    JSON.stringify(Object.fromEntries(Object.entries(manifest).sort()), null, 2)
  );

  console.log(
    "source".padEnd(26) +
      "w:1x/2x".padEnd(20) +
      "before".padStart(11) +
      "after".padStart(11) +
      "  saved"
  );
  console.log("-".repeat(80));
  for (const r of rows) {
    const saved = (((r.before - r.after) / r.before) * 100).toFixed(0);
    console.log(
      r.file.padEnd(26) +
        `${r.to}`.padEnd(20) +
        fmt(r.before) +
        fmt(r.after) +
        `  -${saved}%` +
        r.note
    );
  }
  console.log("-".repeat(80));
  console.log(
    `${rows.length} images`.padEnd(44) +
      fmt(beforeTotal) +
      fmt(afterTotal) +
      `  -${(((beforeTotal - afterTotal) / beforeTotal) * 100).toFixed(1)}%`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
