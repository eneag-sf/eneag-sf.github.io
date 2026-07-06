# eneagjoka.com One-Pager Redesign — Design Spec

**Date:** 2026-07-06
**Status:** Approved by user (interactive brainstorming session)

## Goal

Replace the existing Hexo blog at eneagjoka.com entirely with a single, premium-feeling
static one-pager that positions Enea Gjoka as a senior Salesforce Solution Architect who
pairs enterprise architecture expertise with AI-assisted delivery using Claude Code.

**Audience:** both professional contacts (clients, recruiters, colleagues) and the
Trailblazer community — professional positioning up top, community presence via footer links.

**Feel:** "million dollars" — dark premium tech aesthetic, polished animation, fast.

## Decisions made

| Question | Decision |
|---|---|
| Blog fate | Replace entirely; old posts retired, old URLs 404 |
| Sections | Hero, Expertise grid, Claude Code spotlight, Connect footer |
| Image use | One Dreamforce photo as dimmed hero backdrop only |
| Aesthetic | Dark premium tech |
| Build approach | Hand-crafted static HTML/CSS/JS, no framework, no build step |
| Sensitive info | No email addresses, no employer names, no career dates anywhere |

## Page structure & content

One continuous scroll, four sections:

1. **Hero** (revised at user request) — centered monogram composition: the user's EG
   lightning-slash logo as the main mark (processed to transparent PNG, glow hugging the
   glyphs), name demoted to small tracked-out caps beneath it, mono title line, thin
   gradient rule, positioning line. Dreamforce photo behind a dark radial+vertical veil.
   Subtle scroll cue. The EG logo is also the favicon.
2. **Expertise** — grid of ~5 glass cards, one-liner each:
   - Enterprise Architecture (Sales, Service & Field Service)
   - B2B Commerce
   - Pro-code (Apex & LWC)
   - ALM & CI/CD (scratch orgs, unlocked packages, pipelines)
   - Declarative vs. programmatic decision-making
3. **Claude Code spotlight** — two-column: copy about combining 8+ years of Salesforce
   architecture with agentic AI development; animated terminal window that types a
   realistic Claude Code session (e.g. generating an Apex class) when scrolled into view.
4. **Connect footer** — LinkedIn, GitHub, Trailblazer profile, Trailblazer Architects
   Düsseldorf group link. No email.

## Visual design & animation

- Near-black canvas (~#0a0a0f), off-white type, one accent gradient (Salesforce blue →
  AI violet) used sparingly: positioning line, card hover glows, section markers.
- Glassmorphism cards: translucent, backdrop blur, hairline borders.
- Modern grotesk headings (system stack or one self-hosted variable font — no font CDNs).
- Hero photo: slow Ken Burns drift; subtle parallax on scroll-away.
- Load: hero elements stagger in (fade + rise, ~100ms apart).
- Scroll: IntersectionObserver reveals per section; cards cascade with stagger.
- Hover: card lift + gradient glow border.
- Terminal: types line-by-line with blinking cursor when visible.
- `prefers-reduced-motion`: all motion collapses to simple fades.
- Only `transform`/`opacity` animations. Zero JS/CSS dependencies.

## Performance targets

- Hero image ~200–300 KB WebP with blurred placeholder.
- Loads in under a second; Lighthouse ≈100 across categories.

## Tech, deployment & cleanup

- **Files at repo root:** `index.html`, `css/style.css`, `js/main.js`, `assets/`
  (hero WebP, favicon, OG image), `CNAME` (`eneagjoka.com`).
- **Git:** initialize a real git repository in the working directory (source was never
  version-controlled before). Remote: `github.com/eneag-sf/eneag-sf.github.io`, branch
  `master`. No build step — the source is the deployed site. GitHub Pages serves it
  directly; the CNAME file preserves the custom domain.
- **Retire:** Hexo toolchain (`package.json` scripts, npm dependencies, `hexo deploy`).
- **Archive:** move the old Hexo project (source/, themes/, scaffolds/, configs,
  node_modules, public, .deploy_git) to `~/eneag-sf.github.io-hexo-archive/` — out of the
  repo, not deleted.
- **SEO/social meta:** title, description, Open Graph + Twitter card tags, OG image.

## Sensitive-information sweep

- No email addresses (the old theme config exposed enea.gjoka@trailblazercgl.com — gone).
- No employer names or employment dates ("8+ years" is the maximum specificity).
- Visually inspect the chosen hero photo for identifying content (badges, screens)
  before use.
- Final pass over shipped HTML for leftover personal data.

## Verification

- Local preview via a simple HTTP server.
- Real-browser checks at desktop/tablet/mobile widths.
- Reduced-motion behavior check.
- Lighthouse run.
- Confirm custom domain + CNAME still resolve after deploy.

## Out of scope

- Blog content migration or redirects for old post URLs.
- Analytics, contact forms, CMS of any kind.
- Multi-page navigation.
