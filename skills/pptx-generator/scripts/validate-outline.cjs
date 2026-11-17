const { readFileSync } = require('node:fs');

const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const stylePattern = /^(?:S[1-4]|M[1-5]|O(?:[1-9]|1[0-8]))$/;
const layoutPattern = /^L(?:[1-9]|1[0-6])$/;
const slideTypes = new Set(['cover', 'toc', 'divider', 'content', 'summary']);
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isText = value => typeof value === 'string' && value.trim() !== '';
const isTextList = value => Array.isArray(value) && value.every(isText);

function requireField(condition, field, message) {
  if (!condition) throw new Error(`${field}: ${message}`);
}

function validateOutline(outline) {
  requireField(isRecord(outline), 'outline', 'expected an object');
  requireField(outline.schema_version === 1, 'schema_version', 'expected 1');
  requireField(Number.isSafeInteger(outline.revision) && outline.revision > 0, 'revision', 'expected a positive integer');

  const { presentation, sections } = outline;
  requireField(isRecord(presentation), 'presentation', 'expected an object');
  for (const field of ['title', 'occasion', 'audience', 'language']) {
    requireField(isText(presentation[field]), `presentation.${field}`, 'expected nonempty text');
  }
  const { duration_minutes: minutes, style_code: style, template_file: templateFile } = presentation;
  requireField(minutes === null || (Number.isFinite(minutes) && minutes > 0), 'presentation.duration_minutes', 'expected a positive number or null');
  requireField(style === null || (isText(style) && stylePattern.test(style)), 'presentation.style_code', 'expected S1–S4, M1–M5, O1–O18, or null');
  requireField(templateFile === null || isText(templateFile), 'presentation.template_file', 'expected a file path or null');
  requireField(isTextList(presentation.layout_requirements), 'presentation.layout_requirements', 'expected an array of text');
  requireField(Array.isArray(sections) && sections.length > 0, 'sections', 'expected at least one section');

  const seenIds = new Set();
  function registerId(id, field) {
    requireField(isText(id) && idPattern.test(id), field, 'expected lowercase letters, digits, and hyphens');
    requireField(!seenIds.has(id), field, `duplicate ID "${id}"`);
    seenIds.add(id);
  }

  let coverCount = 0;
  let tocCount = 0;
  let slideCount = 0;
  for (const [sectionIndex, section] of sections.entries()) {
    const sectionPath = `sections[${sectionIndex}]`;
    requireField(isRecord(section), sectionPath, 'expected an object');
    registerId(section.id, `${sectionPath}.id`);
    requireField(isText(section.title), `${sectionPath}.title`, 'expected nonempty text');
    requireField(typeof section.show_in_toc === 'boolean', `${sectionPath}.show_in_toc`, 'expected true or false');
    requireField(isTextList(section.layout_requirements), `${sectionPath}.layout_requirements`, 'expected an array of text');
    requireField(Array.isArray(section.slides) && section.slides.length > 0, `${sectionPath}.slides`, 'expected at least one slide');

    for (const [slideIndex, slide] of section.slides.entries()) {
      const slidePath = `${sectionPath}.slides[${slideIndex}]`;
      requireField(isRecord(slide), slidePath, 'expected an object');
      registerId(slide.id, `${slidePath}.id`);
      requireField(isText(slide.title), `${slidePath}.title`, 'expected nonempty text');
      requireField(slideTypes.has(slide.type), `${slidePath}.type`, 'expected cover, toc, divider, content, or summary');
      requireField(typeof slide.key_message === 'string', `${slidePath}.key_message`, 'expected a string');
      if (slide.type === 'content' || slide.type === 'summary') {
        requireField(isText(slide.key_message), `${slidePath}.key_message`, 'expected the slide’s main point');
      }
      for (const field of ['content', 'sources', 'speaker_notes']) {
        requireField(isTextList(slide[field]), `${slidePath}.${field}`, 'expected an array of text');
      }

      requireField(isRecord(slide.layout), `${slidePath}.layout`, 'expected an object');
      const { code, requirements } = slide.layout;
      requireField(code === null || (isText(code) && layoutPattern.test(code)), `${slidePath}.layout.code`, 'expected L1–L16 or null');
      requireField(isTextList(requirements), `${slidePath}.layout.requirements`, 'expected an array of text');

      requireField(Array.isArray(slide.visuals), `${slidePath}.visuals`, 'expected an array');
      for (const [visualIndex, visual] of slide.visuals.entries()) {
        const visualPath = `${slidePath}.visuals[${visualIndex}]`;
        requireField(isRecord(visual), visualPath, 'expected an object');
        requireField(visual.file === null || isText(visual.file), `${visualPath}.file`, 'expected a file path or null');
        requireField(isText(visual.source), `${visualPath}.source`, 'expected a source or drawing instruction');
        requireField(typeof visual.caption === 'string', `${visualPath}.caption`, 'expected a string');
      }

      if (slide.type === 'cover' && coverCount++ === 0) {
        requireField(slide.title === presentation.title, `${slidePath}.title`, 'the first cover title must match presentation.title');
      }
      if (slide.type === 'toc') {
        requireField(++tocCount === 1, slidePath, 'only one table of contents slide is allowed');
        requireField(slide.content.length === 0, `${slidePath}.content`, 'leave empty so entries are derived from the sections');
      }
      slideCount++;
    }
  }
  requireField(tocCount === 0 || sections.some(section => section.show_in_toc), 'sections', 'mark at least one section with show_in_toc for the table of contents');
  return slideCount;
}

try {
  if (process.argv.length !== 3) {
    throw new Error('Usage: node scripts/validate-outline.cjs "<path to outline.json>"');
  }
  const input = readFileSync(process.argv[2], 'utf8').replace(/^\uFEFF/, '');
  const outline = JSON.parse(input);
  const slideCount = validateOutline(outline);
  console.log(`Outline revision ${outline.revision}: ${outline.sections.length} sections, ${slideCount} slides.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
