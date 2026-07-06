# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Enea Gjoka's personal one-pager at https://eneagjoka.com — a single static page (dark premium design, EG monogram hero) positioning him as a Salesforce Solution Architect who delivers with Claude Code. Hand-written HTML/CSS/JS, zero dependencies, no build step: the repo root is the deployed site.

## Commands

```bash
python3 -m http.server 4173    # Preview locally at http://localhost:4173
git push origin main:master    # Deploy: GitHub Pages serves the master branch
```

There are no tests, linters, or package managers.

## Architecture

- **`index.html`** — the entire page: hero (EG logo + name), stack ticker, expertise grid (B2B Commerce is the featured card), Claude Code terminal section, connect footer.
- **`css/style.css`** — design tokens at the top (`:root`), then sections in page order. Animations are transform/opacity-only; every effect has a `prefers-reduced-motion` fallback at the bottom of the file.
- **`js/main.js`** — one IIFE: scroll reveals (IntersectionObserver), scroll-progress bar + hero parallax (single rAF loop), 3D card tilt and magnetic pills (fine pointers only), and the typing terminal (two scenes in `SCENES`, loops forever; renders instantly under reduced motion).
- **`assets/`** — self-hosted Archivo variable font subsets (latin + latin-ext), hero photo, EG logo (transparent PNG), OG image, favicon.
- **`CNAME`** — checked-in file that keeps the eneagjoka.com custom domain bound on GitHub Pages; do not delete.
- **`docs/superpowers/specs/`** — design specs.

## Constraints

- **No sensitive info on the page**: no email addresses, no employer names, no employment dates. Keep it that way.
- **No external requests**: fonts and all assets are self-hosted by design (no CDNs, no analytics, no cookies).
- Local branch is `main`; GitHub Pages serves `master` on eneag-sf/eneag-sf.github.io — hence the `main:master` push.
- The old Hexo blog this replaced is archived at `~/eneag-sf.github.io-hexo-archive/` (not in git).
