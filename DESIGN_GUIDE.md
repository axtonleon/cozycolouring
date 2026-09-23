# CozyColouring — Design Guide

Reference: cocowyo.com (inspected 2026-09-23 via Playwright).
Overall vibe: soft, cozy, cute, hand-drawn. Cream/off-white canvas with pastel lavender accents, playful rounded sans-serif type, and hand-illustrated mascots. Feels like a warm children's book crossed with a boutique stationery brand.

---

## 1. Brand Personality

| Trait | How it shows up |
|---|---|
| Cozy & warm | Cream backgrounds, soft lavender panels, generous whitespace |
| Cute & playful | Hand-drawn animal mascots (frog, bear, duck, hippo), heart doodles |
| Calm & gentle | Low-contrast text, no harsh blacks, no aggressive CTAs |
| Handcrafted | Line-art illustrations, personal copy ("Hi Friend!") |

Voice: first-person, friendly, low-pressure ("We craft these coloring books to offer comfort and relaxation to people like us").

---

## 2. Color Palette

Sampled directly from the live site.

### Core
| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFEFE` | Page background (warm off-white) |
| `--bg-alt` | `#FFFAF7` | Subtle section background (cream) |
| `--surface` | `#F7F7F7` | Chips, product cards, subtle panels |
| `--text` | `#3C3C3C` | Body copy (soft near-black, never `#000`) |
| `--text-strong` | `#322F37` | Section headings |
| `--text-muted` | `#868686` | Meta, labels, secondary links |
| `--text-subtle` | `#ACACAC` / `#969696` | Placeholders, dividers |

### Accents (pastel)
| Token | Value | Use |
|---|---|---|
| `--lavender` | `#F6ECFF` | Header bar, footer, callout panels |
| `--lavender-2` | `#F8EDFF` | Lighter lavender wash |
| `--peach` | `#FFFAF7` | Warm hero backdrop |
| `--sale` | `#E95144` | Sale price / badge (used sparingly) |
| `--success` | `#428445` | Stock / positive states |

Rule: **one accent hue per section max.** Lavender is the signature — don't add competing pastels (pink, mint, blue) unless illustrating.

---

## 3. Typography

Single-family system for cohesion.

- **Primary font:** `Nunito`, sans-serif (weights 400, 600, **800**)
- Fallback stack: `Nunito, "Nunito Sans", system-ui, sans-serif`
- Load via Google Fonts or self-host.

### Scale (desktop)
| Role | Size | Weight | Color |
|---|---|---|---|
| Section H2 (New Release, Best Seller) | `34px` | 800 | `--text-strong` |
| Sub-heading H2 (Hi Friend!, Bold & Easy) | `24px` | 800 | `--text` |
| Product title H3 | `18px` | 800 | `--text` |
| Body | `16px` | 400 | `--text` |
| Nav / meta | `14–15px` | 600 | `--text` |
| Chips / tags | `12–13px` | 600 | `--text-muted` |

Line-height: `1.5–1.6` for body, `1.2–1.3` for headings. Letter-spacing near 0 (Nunito is already rounded).

Headings are always **800 (extra-bold)** — this is the site's signature rhythm. Never use italic. Never use uppercase for headings (only for small labels like "COLLECTION" if desired).

---

## 4. Layout

- Max content width: **~1280–1400px**, centered.
- Section vertical padding: **80–120px** desktop, **48–64px** mobile.
- Grid: 12-col with **24–32px** gutters. Product grids run 4-up desktop → 2-up mobile.
- Generous whitespace above and below every section — nothing feels crowded.
- Sections stack full-bleed; the lavender bands (header, footer, occasional callouts) provide rhythm.

---

## 5. Components

### Header
- Sticky top bar, background `--lavender` (`#F6ECFF`).
- Center-aligned nav links: Home · Products · Blogs · Gallery · About Us · Comics · Freebies · FAQs
- Links: 15px / 600 / `--text`. Hover: darker text, no underline.
- Wishlist + cart icons on the right.

### Hero
- Full-bleed slideshow with hand-drawn illustration on cream backdrop.
- Copy is minimal; the illustration does the heavy lifting.
- Optional soft-shadowed CTA button (see below).

### Buttons
- **Primary:** soft-rounded pill, `border-radius: 999px`, `padding: 14px 28px`, background `--text-strong`, text `#FFF`, weight 700. Hover: subtle lift + 10% darker.
- **Secondary:** same shape, background `--surface`, text `--text`.
- **Text link:** underline on hover only, color `--text`.
- Never use flat rectangles. Pill or `12–16px` radius only.

### Chips / Tags
- Background `#F7F7F7`, text `#868686`, `border-radius: 6px`, `padding: 5px 10px`, 12–13px, 600.
- Small icon (heart, star) optional on the left.

### Product Card
- White background, no visible border, tiny shadow on hover.
- Image: square, `border-radius: 12–16px`, subtle cream backdrop.
- Below image:
  - H3 title (18px / 800)
  - Price row: current price 16px / 700, compare-at 14px / 400 line-through `--text-muted`
  - Sale price in `--sale` (`#E95144`) when discounted.
- Section header pattern: big centered H2 + small underlined "View more" link.

### Section Rhythm
Homepage sections used on cocowyo (adopt this order):
1. Hero slideshow
2. Image banner
3. "Hi Friend!" intro (rich text + illustration)
4. New Release grid
5. Best Seller grid
6. Collection spotlight (Bold & Easy, Cute & Comfy, Classic, Seasonal)
7. Digital products grid
8. Blog posts spotlight
9. Featured On (press logos)
10. Cozy Moments (UGC/gallery)
11. Image banner
12. FAQ accordion
13. Newsletter (lavender panel)
14. Footer (lavender panel)

### Footer
- Background `--lavender`.
- Three columns: Info · Our Book · Contact. Social icons row.
- Above the footer sits a **mascot illustration** (frog + duck with flowers) — signature closing motif.

### Newsletter
- Full-width, cream/white background inside a lavender wrapper.
- Two stacked inputs (Name, Email) with hairline borders, then full-width pill "Subscribe" button in `--surface`.

### FAQ
- Numbered questions in uppercase small-caps or plain 800.
- Answers indented, body-size, muted text.
- Accordion optional.

---

## 6. Imagery & Illustration

- **Style:** Hand-drawn, black line-art on cream, minimal shading. Round friendly shapes. Occasional flat pastel fills (green frog, yellow duck, pink hearts).
- **Subjects:** Chubby animals, cozy scenes (cafes, blankets, tea, autumn leaves), tiny hearts as decorative punctuation.
- **Backgrounds:** cream or white only — never photographic textures.
- **Photography:** product shots on cream/wood surfaces, natural light, warm tone. No harsh studio white.
- **Icons:** rounded, stroke-based (2px), never filled glyphs. Use Phosphor "regular" or Lucide with rounded corners.

---

## 7. Motion

Keep it gentle.
- Card hover: `transform: translateY(-2px)` + soft shadow, 200ms ease-out.
- Button hover: background darken 200ms.
- Section reveal on scroll: 12px fade-up, 400ms, once.
- No parallax, no bouncing, no auto-playing video.

---

## 8. Accessibility

- Body text contrast: `#3C3C3C` on `#FFFEFE` = 11.9:1 ✓
- Muted text `#868686` — use only for non-critical meta, never core content.
- Focus rings: 2px dashed `--text-strong`, 3px offset — visible but on-brand.
- All interactive targets ≥ 44×44px.
- Alt text on every illustration ("frog holding tulips").

---

## 9. Design Tokens (copy-paste)

```css
:root {
  --bg: #FFFEFE;
  --bg-alt: #FFFAF7;
  --surface: #F7F7F7;
  --lavender: #F6ECFF;
  --lavender-2: #F8EDFF;
  --text: #3C3C3C;
  --text-strong: #322F37;
  --text-muted: #868686;
  --text-subtle: #ACACAC;
  --sale: #E95144;
  --success: #428445;

  --font-sans: "Nunito", system-ui, sans-serif;

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  --shadow-card: 0 2px 12px rgba(50, 47, 55, 0.06);
  --shadow-hover: 0 6px 20px rgba(50, 47, 55, 0.10);

  --space-section-y: clamp(48px, 8vw, 120px);
  --container: 1320px;
}
```

---

## 10. Do / Don't

**Do**
- Lean on whitespace; let illustrations breathe.
- Use one lavender band per screen as a visual anchor.
- Keep copy short, warm, and personal.
- Ship hand-drawn assets — even section dividers.

**Don't**
- Use pure black (`#000`) anywhere.
- Introduce a second display font — Nunito 800 already carries display duties.
- Use hard drop-shadows, gradients, or neon accents.
- Add urgency ("Only 2 left!", countdown timers) — off-brand for a calm product.
