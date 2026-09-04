# medhanshsekhri.github.io

Personal portfolio for Medhansh Sekhri — mechanical and aerospace engineering
student at the University of Queensland. One homepage (hero, projects,
hackathons, about, contact) plus a `/projects` index and a case-study page per
project.

## Stack

- **Next.js 16** (App Router) with `output: "export"` — the build emits a fully
  static site into `out/`. There is no server at runtime.
- **React 19**, **TypeScript**, **Tailwind CSS v4** (via `@tailwindcss/postcss`).
- **framer-motion** for the hero, reveals, and card tilt.
- **sharp** for the image pipeline (a dev dependency; it does not ship).
- Fonts: Cormorant Garamond via `next/font/google`, Satoshi via Fontshare.

Deploy is GitHub Actions (`.github/workflows/deploy.yml`): every push to `main`
runs `npm run build` and publishes `out/` to GitHub Pages.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into out/
npm run lint
```

`trailingSlash: true` is set, so internal links are written with a trailing
slash (`/projects/model-rocket/`). Keep that consistent or Pages will redirect.

## Project data

`lib/projects.ts` is the single source of truth for all six projects — copy,
outcome, tech list, GitHub URL, video, and photos. The homepage cards, the
`/projects` index, the case-study pages, and their metadata all read from it.
Array order is the display order: entry 0 is the homepage "Latest build"
feature, and `photos[0]` is each project's card image.

The homepage grid numbers the non-featured cards 02–06. There is no 01 — that
is the featured card. Intentional.

## The image pipeline

This is the non-obvious part. **Nothing in `public/` is edited by hand, and
originals are never committed.**

```
src-images/            gitignored, full-resolution originals (JPEG/PNG)
   |
   |  node scripts/optimise-images.mjs
   v
public/name.webp       1x — the largest width the image is actually displayed at
public/name@2x.webp    2x — retina tier
public/name-full.webp  long edge 2400px, only for lightbox images
lib/image-manifest.json  the real emitted widths of the 1x/2x pair
```

### How a width is chosen

`scripts/optimise-images.mjs` holds a `DISPLAY_WIDTHS` table mapping each source
filename to the largest CSS-pixel width that image is ever rendered at, derived
by reading the components — container max-widths, grid columns, gaps, and page
padding. A file gets **one** 1x output, so the number is the maximum across
every place the file appears. The comments in that table show the arithmetic for
each entry; update them when a layout changes.

The 2x tier is `displayWidth * 2`, and both are capped at the source width
(`withoutEnlargement`), so a small source simply produces two equal files.

Images that open in the lightbox are additionally listed in `LIGHTBOX_IMAGES`
and get a `-full.webp` sized to fit a 2400px box, loaded only when zoomed.
Line art and logos are listed in `HIGH_QUALITY` and encode at quality 92 instead
of 80. `.rotate()` is applied on every output so EXIF orientation is baked in
rather than lost in conversion.

### How the markup uses it

The script writes `lib/image-manifest.json` with the **real** emitted widths.
`responsiveImage(src, sizes)` in `lib/image.ts` reads that manifest and returns
`src`/`srcSet`/`sizes` with honest `w` descriptors — and returns a bare `src`
when the 2x file is no larger than the 1x, so there is nothing to choose
between:

```tsx
<img {...responsiveImage("/dragster.webp", "(max-width: 767px) 100vw, 320px")}
     alt="CO2 dragster" loading="lazy" />
```

The `sizes` argument must describe the CSS width of the slot. Without it the
browser assumes `100vw` and over-fetches.

These are plain `<img>` tags on purpose: `images.unoptimized` is required by
`output: "export"`, and under it `next/image` emits no `srcset` at all — so the
manifest is doing the job `next/image` would otherwise do.

### Adding or changing an image

1. Drop the original in `src-images/`.
2. Add it to `DISPLAY_WIDTHS` with a comment showing where the width comes from
   (and to `LIGHTBOX_IMAGES` / `HIGH_QUALITY` if it belongs there).
3. Run `node scripts/optimise-images.mjs`.
4. Commit the `public/*.webp` outputs and the updated
   `lib/image-manifest.json`.

`scripts/make-og-image.mjs` generates `public/og.png`, the social card, and is
run the same way.
