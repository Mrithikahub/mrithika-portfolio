# Mrithika K · Portfolio

Personal portfolio of Mrithika K, AI/ML and full-stack engineer (B.Tech CSE, SRM Institute of Science and Technology, 2024–2028). Open to internships and full-time roles, and ready to relocate.

**Live:** https://mrithika-portfolio.vercel.app

## Stack

- **React 19 + TypeScript + Vite** single-page app (plus a separate `404.html` entry)
- **Tailwind CSS v4** with design tokens in `src/index.css` (light and dark themes)
- **Motion** for component animation, **GSAP ScrollTrigger** for pinned and scrubbed scroll scenes, **Lenis** for smooth scrolling
- **Phosphor** icons and **Simple Icons** brand logos
- Fonts: Rubik (display), Geist (body), JetBrains Mono (labels), Caveat (handwritten accents), all self-hosted via Fontsource

## Getting started

Requires Node 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173. Add `?still` to the URL in development to skip animations (useful for layout screenshots).

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run images` | Rebuild every generated image (needs Python 3 with Pillow, rembg and PyMuPDF) |

## Editing content

Almost all text lives in **`src/data/content.ts`**: hero lines, About copy and stats, projects, experience, skills, certifications, clubs and contact details. The "projects shipped" counter is derived from the project lists automatically.

### Images

Source images live in `assets-src/` and are never served directly. After changing one, run `npm run images`:

- `scripts/process_images.py` builds the avatar WebPs, Open Graph image and favicons
- `scripts/process_extras.py` builds the About photo (`assets-src/me.jpeg`), certificate previews and logo thumbnails

### Certificates

1. Put the file (PDF or image) in `public/certificates/`.
2. Add or update the entry in `certifications.items` in `content.ts`: set `file` to the file name, and `pages` if the PDF has more than one page.
3. Run `npm run images` to render the previews into `public/certificates/previews/`.

Verified certificates with a file open in a lightbox (zoomable page previews, plus Download and Open in new tab). Certificates marked `"progress"` are not clickable.

### Logos

Put cert and club logos in `src/assets/logos/` (PNG, JPEG or SVG) and reference them by file name, without the extension, through the `logo` field in `content.ts`. `npm run images` makes small WebP copies, which the site prefers. A missing logo falls back to an initials badge.

### Project covers

Each project card has a code-drawn animated cover (`src/components/work/Cover.tsx`). To use a real screenshot instead, set `image: "/images/projects/<slug>.webp"` on that project.

## Project structure

```
src/
  data/content.ts      all site copy and data
  App.tsx              loader, header, hero, footer
  Sections.tsx         everything below the hero (lazy chunk, mounted progressively)
  components/          one folder per section, plus layout/ and ui/
  providers/           theme, intro, smooth scroll, toasts
  hooks/ lib/          media queries, scramble text, z-index layers, logos, icons
scripts/               image pipelines (Python)
assets-src/            original images
public/                served as-is (images, certificates, favicons)
```

## Performance and accessibility

Lighthouse on the production build: performance 98 on desktop and 81–82 on mobile, and 100 for accessibility, best practices and SEO on both.

- The hero's code loads first; the remaining sections ship as a separate chunk and mount one per idle frame.
- Canvases and animated textures pause when off screen or in a background tab.
- Everything honours `prefers-reduced-motion`: pinned scenes become static layouts, and loops and pulses stop.
- Unknown URLs get `404.html` with a real 404 status on Vercel. (`npm run preview` falls back to the home page instead, so check the status code on the deployed site.)

## Deploying (Vercel)

The repo is ready for Vercel with no extra settings: framework preset **Vite**, build command `npm run build`, output directory `dist`. `vercel.json` adds long-term caching for hashed assets.

If the domain changes, update the canonical URL, Open Graph URLs and JSON-LD in `index.html`.
