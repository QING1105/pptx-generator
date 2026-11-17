---
name: pptx-generator
description: "Generate, edit, and read PowerPoint presentations. Create from scratch with PptxGenJS (cover, TOC, content, section divider, summary slides), edit existing PPTX via XML workflows, or extract text with markitdown. Triggers: PPT, PPTX, PowerPoint, presentation, slide, deck, slides."
license: See LICENSE
metadata:
  version: "1.0"
  category: productivity
  sources:
    - https://gitbrent.github.io/PptxGenJS/
    - https://github.com/microsoft/markitdown
---

# PPTX Generator & Editor

## Overview

Generate, edit, and read PowerPoint presentations. For a new deck, share the combined visual style and slide layout preview before planning slides.

## Step 0: Share the Style and Layout Preview

Start the local preview server from the directory containing this file with Python 3 (python on Windows or python3 where needed). Reuse a running server for this skill when available. If port 8765 is occupied by another service, use 8766 or 8767 and send the working URL.

    python -m http.server 8765 --bind 127.0.0.1 --directory "<pptx-generator skill directory>"

Send the [combined preview](http://127.0.0.1:8765/references/style-packs/preview.html). It shows all 16 single-slide layouts inline alongside the style swatches.

| Codes | What to choose |
|---|---|
| L1–L16 | Slide arrangements for covers, figures, comparisons, flowcharts, and other page types |
| S1–S4 | Swiss style with Helvetica / Arial and a bold accent color |
| M1–M5 | Magazine style with Georgia titles and Calibri body text |
| O1–O18 | Office palettes with Arial / Microsoft YaHei |

Use any style choices the user has already made. When the style choice is open, ask for a style code or recommend one based on the occasion. During outline design, use the L codes to agree on layouts for individual slides, such as L1 for the cover and L12 for a methods flowchart. If the user supplied a PowerPoint template, use the [editing workflow](references/editing.md). For a thesis defense, adapt the [defense outline](references/presets/defense-final.md) to the research and speaking time.

---

## Quick Reference

| Task | Approach |
|------|----------|
| Read/analyze content | `python -m markitdown presentation.pptx` |
| Edit or create from template | See [Editing Presentations](references/editing.md) |
| Create from scratch | See [Creating from Scratch](#creating-from-scratch-workflow) below |

| Item | Value |
|------|-------|
| **Dimensions** | 10" x 5.625" (LAYOUT_16x9) |
| **Colors** | 6-char hex without # (e.g., `"FF0000"`) |
| **English font** | Arial (default), or approved alternatives |
| **Chinese font** | Microsoft YaHei |
| **Page badge position** | x: 9.3", y: 5.1" |
| **Theme keys** | `primary`, `secondary`, `accent`, `light`, `bg` |
| **Shapes** | RECTANGLE, OVAL, LINE, ROUNDED_RECTANGLE |
| **Charts** | BAR, LINE, PIE, DOUGHNUT, SCATTER, BUBBLE, RADAR |

## Reference Files

| File | Contents |
|------|----------|
| [layout-coords.md](references/layout-coords.md) | Coordinates and guidance for L1–L16 |
| [slide-types.md](references/slide-types.md) | 5 slide page types (Cover, TOC, Section Divider, Content, Summary) + additional layout patterns |
| [design-system.md](references/design-system.md) | Color palettes, font reference, style recipes (Sharp/Soft/Rounded/Pill), typography & spacing |
| [editing.md](references/editing.md) | Template-based editing workflow, XML manipulation, formatting rules, common pitfalls |
| [pitfalls.md](references/pitfalls.md) | QA process, common mistakes, critical PptxGenJS pitfalls |
| [pptxgenjs.md](references/pptxgenjs.md) | Complete PptxGenJS API reference |

---

## Reading Content

Use MarkItDown for text extraction. If it is unavailable, install "markitdown[pptx]" in a project Python environment when this workflow needs it.

```bash
# Text extraction
python -m markitdown presentation.pptx
```

---

## Creating from Scratch — Workflow

**Use when no template or reference presentation is available.**

### Step 0 (DONE): Style Selected

User already chose from the [preview](#step-0-share-the-style-and-layout-preview). Read the corresponding style-pack:

| Code | File |
|------|------|
| S1-S4 | [references/style-packs/guizang-swiss.md](references/style-packs/guizang-swiss.md) |
| M1-M5 | [references/style-packs/guizang-magazine.md](references/style-packs/guizang-magazine.md) |
| O1-O18 | [references/design-system.md](references/design-system.md) (palettes #1-18) |

From the style-pack, extract: theme object, hard rules, layout dimensions, font rules.

### Step 1: Research & Requirements

Search to understand user requirements — topic, audience, purpose, tone, content depth.

### Step 2: Apply Style Pack to Slides

Use the theme object from the selected pack. If Swiss or Magazine pack, apply its hard rules (no gradients, no rounded corners for Swiss; Georgia headers for Magazine; etc.). If Office pack, use [Color Palette Reference](references/design-system.md#color-palette-reference) and [Style Recipes](references/design-system.md#style-recipes).

### Step 4: Plan Slide Outline

Classify **every slide** as exactly one of the [5 page types](references/slide-types.md). Plan the content and layout for each slide. Ensure visual variety — do NOT repeat the same layout across slides.

### Step 5: Prepare the Project and Write Slides

With Node.js and npm available, run the setup script from this skill directory. Pass a separate directory for the presentation inside the user's workspace.

    node scripts/setup.cjs "<absolute presentation project directory>"

The script creates the project’s slides directory and installs the pinned PptxGenJS dependency there. Use a new project directory for each deck. If setup reports an existing, different manifest, choose a separate project directory.

In that project's slides directory, create one module per slide (slide-01.js, slide-02.js, etc.). Each exports a synchronous createSlide(pres, theme) function. Put images in slides/imgs and final decks in slides/output. Use a 10" × 5.625" canvas, Microsoft YaHei for Chinese and Arial or the selected style font for English, and six-character hex colors without a leading #. Follow the [format below](#slide-output-format), the [slide type guide](references/slide-types.md), the [theme contract](#theme-object-contract-mandatory), and the [PptxGenJS API reference](references/pptxgenjs.md).

### Step 6: Compile into Final PPTX

Create `slides/compile.js` to combine all slide modules:

```javascript
// slides/compile.js
const fs = require('node:fs');
const pptxgen = require('pptxgenjs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

const theme = {
  primary: "22223b",    // dark color for backgrounds/text
  secondary: "4a4e69",  // secondary accent
  accent: "9a8c98",     // highlight color
  light: "c9ada7",      // light accent
  bg: "f2e9e4"          // background color
};

for (let i = 1; i <= 12; i++) {  // adjust count as needed
  const num = String(i).padStart(2, '0');
  const slideModule = require(`./slide-${num}.js`);
  slideModule.createSlide(pres, theme);
}

fs.mkdirSync('./output', { recursive: true });
pres.writeFile({ fileName: './output/presentation.pptx' }).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
```

Run with: `cd slides && node compile.js`

### Step 7: QA (Required)

See [QA Process](references/pitfalls.md#qa-process).

### Output Structure

```
slides/
├── slide-01.js          # Slide modules
├── slide-02.js
├── ...
├── imgs/                # Images used in slides
└── output/              # Final artifacts
    └── presentation.pptx
```

---

## Slide Output Format

Each slide is a **complete, runnable JS file**:

```javascript
// slide-01.js
const pptxgen = require("pptxgenjs");

const slideConfig = {
  type: 'cover',
  index: 1,
  title: 'Presentation Title'
};

// MUST be synchronous (not async)
function createSlide(pres, theme) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  slide.addText(slideConfig.title, {
    x: 0.5, y: 2, w: 9, h: 1.2,
    fontSize: 48, fontFace: "Arial",
    color: theme.primary, bold: true, align: "center"
  });

  return slide;
}

// Standalone preview - use slide-specific filename
if (require.main === module) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  const theme = {
    primary: "22223b",
    secondary: "4a4e69",
    accent: "9a8c98",
    light: "c9ada7",
    bg: "f2e9e4"
  };
  createSlide(pres, theme);
  pres.writeFile({ fileName: "slide-01-preview.pptx" });
}

module.exports = { createSlide, slideConfig };
```

---

## Theme Object Contract (MANDATORY)

The compile script passes a theme object with these **exact keys**:

| Key | Purpose | Example |
|-----|---------|---------|
| `theme.primary` | Darkest color, titles | `"22223b"` |
| `theme.secondary` | Dark accent, body text | `"4a4e69"` |
| `theme.accent` | Mid-tone accent | `"9a8c98"` |
| `theme.light` | Light accent | `"c9ada7"` |
| `theme.bg` | Background color | `"f2e9e4"` |

**NEVER use other key names** like `background`, `text`, `muted`, `darkest`, `lightest`.

---

## Page Number Badge (REQUIRED)

All slides **except Cover Page** MUST include a page number badge in the bottom-right corner.

- **Position**: x: 9.3", y: 5.1"
- Show current number only (e.g. `3` or `03`), NOT "3/12"
- Use palette colors, keep subtle

### Circle Badge (Default)

```javascript
slide.addShape(pres.shapes.OVAL, {
  x: 9.3, y: 5.1, w: 0.4, h: 0.4,
  fill: { color: theme.accent }
});
slide.addText("3", {
  x: 9.3, y: 5.1, w: 0.4, h: 0.4,
  fontSize: 12, fontFace: "Arial",
  color: "FFFFFF", bold: true,
  align: "center", valign: "middle"
});
```

### Pill Badge

```javascript
slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 9.1, y: 5.15, w: 0.6, h: 0.35,
  fill: { color: theme.accent },
  rectRadius: 0.15
});
slide.addText("03", {
  x: 9.1, y: 5.15, w: 0.6, h: 0.35,
  fontSize: 11, fontFace: "Arial",
  color: "FFFFFF", bold: true,
  align: "center", valign: "middle"
});
```

---

## Dependencies

- Python 3 serves the local preview. MarkItDown with the PPTX extra provides optional text extraction.
- Node.js 20 or later and npm run the generation workflow. The project setup script installs the lockfile’s PptxGenJS dependency.
- Use PowerPoint or LibreOffice to render finished slides for a visual check.
