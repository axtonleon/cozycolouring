# Image Generation

Generates all site illustrations in the chunky cartoon coloring-book cover style using Gemini's Nano Banana model (`gemini-2.5-flash-image`).

## Setup

```bash
pip install google-genai python-dotenv pillow
```

Get an API key at https://aistudio.google.com/apikey, then copy the example env file and paste it in:

```bash
cp .env.example .env
# edit .env and set GEMINI_API_KEY=...
```

## Run

```bash
# Generate all 24 images (one variant each)
py -3 scripts/generate_images.py

# Generate 4 variants of everything (pick the best)
py -3 scripts/generate_images.py --variants 4

# Only regenerate specific ones
py -3 scripts/generate_images.py --only hero-01 mascot-03

# Skip anything already saved
py -3 scripts/generate_images.py --skip-existing
```

Output lands in `public/illustrations/`.

## Editing the prompts

All prompts live in `scripts/prompts.json`:

- `style` — the master style block prepended to every generation. Edit once, applies to all.
- `images[]` — list of `{id, aspect, scene}`. Add or remove entries freely.

## Cost / speed

- Each image is ~1–2 sec of API time, ~$0.03 depending on Gemini pricing tier.
- 24 images × 4 variants = 96 generations ≈ 2–3 minutes total, ~$3.

## Tips

- Regenerate individual images with `--only <id>` if one comes out wonky.
- If characters keep drifting off-style, tighten the `style` block in prompts.json — the model heavily weights the first sentence.
- For transparent backgrounds (mascots, doodles), run outputs through `remove.bg` or `rembg` after generation.
