---
name: pptx-generator
description: "Generate, edit, and read PowerPoint presentations. Create from scratch with PptxGenJS (cover, TOC, content, section divider, summary slides), edit existing PPTX via XML workflows, or extract text with markitdown. Triggers: PPT, PPTX, PowerPoint, presentation, slide, deck, slides."
license: See LICENSE
metadata:
  version: "1.1"
  category: productivity
  sources:
    - https://gitbrent.github.io/PptxGenJS/
    - https://github.com/microsoft/markitdown
---

# PPTX Generator & Editor

## Overview

Generate, edit, and read PowerPoint presentations. New decks start with a choice of how to prepare the outline. Use one editable JSON outline through planning, generation, and revision.

## Step 0: Choose How to Start

For a new deck, show these choices in the current chat and wait for the user to choose. Use a choice already made explicit in the request. Resume an existing deck using its outline and previous decisions.

1. **已有提纲，直接生成。** 导入已有提纲或 `outline.json`，整理并校验后生成 PPT。
2. **苏格拉底式问答，生成提纲。** 逐轮确认讲述主线、各章节内容和配图。先交付逐页提纲，经用户确认后生成 PPT。

Use the labels “方式 1” and “方式 2” for these choices. L1–L16 identify individual slide layouts.

## Step 1: Preview and Prepare the Outline

Start the local preview server from the directory containing this file with Python 3 (python on Windows or python3 where needed). Reuse a running server for this skill when available. If port 8765 is occupied by another service, use 8766 or 8767 and send the working URL.

    python -m http.server 8765 --bind 127.0.0.1 --directory "<pptx-generator skill directory>"

Send the [combined preview](http://127.0.0.1:8765/references/style-packs/preview.html). It shows all 16 single-slide layouts inline alongside the style swatches.

| Codes | What to choose |
|---|---|
| L1–L16 | Slide arrangements for covers, figures, comparisons, flowcharts, and other page types |
| S1–S4 | Swiss style with Helvetica / Arial and a bold accent color |
| M1–M5 | Magazine style with Georgia titles and Calibri body text |
| O1–O18 | Office palettes with Arial / Microsoft YaHei |

Use the style and layout choices the user has already made. When the style choice is open, ask for a style code or recommend one based on the occasion. Follow the [outline workflow and JSON format](references/outline-workflow.md) for either mode. Save `outline.json` in the presentation project directory. For a thesis defense, adapt the [defense outline](references/presets/defense-final.md) to the research and speaking time.

Before generation, validate that file from the skill directory:

    node scripts/validate-outline.cjs "<absolute path to outline.json>"

Generate from the validated outline. When the user provides a PowerPoint template, use the [editing workflow](references/editing.md) with the same outline. Derive the agenda and slide order from its sections. On revision, update and revalidate that file first. Deliver it alongside the PPTX.

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
| [outline-workflow.md](references/outline-workflow.md) | Direct outline and guided dialogue paths, JSON fields, and revisions |
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

### Step 2: Apply the Selected Style

Read the style pack for the style recorded in `outline.json` after the [preview](#step-1-preview-and-prepare-the-outline):

| Code | File |
|------|------|
| S1-S4 | [references/style-packs/guizang-swiss.md](references/style-packs/guizang-swiss.md) |
| M1-M5 | [references/style-packs/guizang-magazine.md](references/style-packs/guizang-magazine.md) |
| O1-O18 | [references/design-system.md](references/design-system.md) (palettes #1-18) |

Use the theme, fonts, and layout constraints from the selected pack. Match each page type to the [slide type guide](references/slide-types.md).

### Step 3: Prepare the Project and Write Slides

With Node.js and npm available, run the setup script from this skill directory. Pass a separate directory for the presentation inside the user's workspace.

    node scripts/setup.cjs "<absolute presentation project directory>"

The script creates the project’s slides directory and installs the pinned PptxGenJS dependency there. Use a new project directory for each deck. If setup reports an existing, different manifest, choose a separate project directory.

In the project's slides directory, create one module per stable slide ID, such as `slide-research-question.js`. Each exports a synchronous `createSlide(pres, theme, slideSpec, context)` function that returns the new slide. Put images in slides/imgs and final decks in slides/output. Use a 10" × 5.625" canvas by default, Microsoft YaHei for Chinese and Arial or the selected style font for English, and six-character hex colors without a leading #. Follow the [format below](#slide-output-format), the [theme contract](#theme-object-contract-mandatory), and the [PptxGenJS API reference](references/pptxgenjs.md).

### Step 4: Compile into Final PPTX

Create `slides/compile.js` to combine the slide modules in the outline’s order. Set the theme in this example to the selected palette.

```javascript
// slides/compile.js
const fs = require('node:fs');
const path = require('node:path');
const pptxgen = require('pptxgenjs');
const outlinePath = path.join(__dirname, '..', 'outline.json');
const outline = JSON.parse(fs.readFileSync(outlinePath, 'utf8').replace(/^\uFEFF/, ''));
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';
pres.title = outline.presentation.title;

const theme = {
  primary: "22223b",    // dark color for backgrounds/text
  secondary: "4a4e69",  // secondary accent
  accent: "9a8c98",     // highlight color
  light: "c9ada7",      // light accent
  bg: "f2e9e4"          // background color
};

const tocEntries = outline.sections
  .filter(section => section.show_in_toc)
  .map(section => section.title);

let pageNumber = 0;
for (const section of outline.sections) {
  for (const slideSpec of section.slides) {
    const { createSlide } = require(`./slide-${slideSpec.id}.js`);
    const slide = createSlide(pres, theme, slideSpec, {
      pageNumber: ++pageNumber,
      tocEntries,
      sectionLayoutRequirements: section.layout_requirements,
    });
    if (slideSpec.speaker_notes.length) {
      slide.addNotes(slideSpec.speaker_notes.join('\n'));
    }
  }
}

const outputDir = path.join(__dirname, 'output');
fs.mkdirSync(outputDir, { recursive: true });
pres.writeFile({ fileName: path.join(outputDir, 'presentation.pptx') }).catch(error => {
  console.error(error);
  process.exitCode = 1;
});
```

From the project directory, run `node slides/compile.js`.

### Step 5: QA (Required)

Check that the deck’s page count, titles, order, and agenda match the outline. See [QA Process](references/pitfalls.md#qa-process) for visual checks.

### Output Structure

```
presentation-project/
├── outline.json
└── slides/
    ├── compile.js
    ├── slide-cover.js
    ├── slide-research-question.js
    ├── imgs/
    └── output/
        └── presentation.pptx
```

---

## Slide Output Format

Use JSON values for titles and content. The cover example reads the slide's title directly. A table of contents module uses `context.tocEntries` for its list. Match each slide to its own layout and the chapter’s layout requirements.

```javascript
// slide-cover.js
function createSlide(pres, theme, slideSpec) {
  const slide = pres.addSlide();
  slide.background = { color: theme.bg };

  slide.addText(slideSpec.title, {
    x: 0.5, y: 2, w: 9, h: 1.2,
    fontSize: 48, fontFace: "Arial",
    color: theme.primary, bold: true, align: "center"
  });

  return slide;
}

module.exports = { createSlide };
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
