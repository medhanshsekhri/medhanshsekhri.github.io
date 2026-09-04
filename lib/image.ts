import manifest from "./image-manifest.json";

type Entry = { w: number; w2x: number };

const WIDTHS = manifest as Record<string, Entry>;

/**
 * Build src/srcSet/sizes for an optimised image.
 *
 * The optimiser emits two files per image: `name.webp` at the width the image
 * is actually laid out at, and `name@2x.webp` at twice that. The `w`
 * descriptors below are the real emitted widths (from image-manifest.json,
 * capped at the source width), so a 1x display downloads the small file and
 * only a retina display pays for the large one.
 *
 * `sizes` must describe the CSS width of the slot - without it the browser
 * assumes 100vw and over-fetches.
 */
export function responsiveImage(src: string, sizes: string) {
  const entry = WIDTHS[src];
  if (!entry) return { src, sizes };

  // Nothing to choose between when the source was too small to have a real 2x.
  if (entry.w2x <= entry.w) return { src, sizes };

  const retina = src.replace(/\.webp$/, "@2x.webp");
  return {
    src,
    srcSet: `${src} ${entry.w}w, ${retina} ${entry.w2x}w`,
    sizes,
  };
}
