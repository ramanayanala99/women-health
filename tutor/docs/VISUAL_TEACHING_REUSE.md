# Visual teaching and code reuse

## In the classroom

Both Grade 7 and Grade 8 use the shared visual teaching integration. Matched lessons show an animated concept model beneath the existing board diagram. The model highlights different parts as the teacher advances through a teaching scene. Other topics retain their original textbook diagrams; this update does not supply a bespoke interactive simulation for every lesson.

Choose **Try the model** to pause the lesson at the current teaching checkpoint. Change its values using keyboard-accessible sliders or touch controls. Choose **Return to voice lesson** to continue at the same checkpoint. Exploration does not submit answers or change marks. The lab is hidden during independent exercises; Grade 8 question diagrams show the question rather than the answer explanation. Browser microphone access is optional.

The ten models cover fractions, signed number lines, linear graphs, equation balance, rectangle/triangle area, circles, adjacent angles, Pythagoras, scientific notation and three-observation statistics. Models are related teaching aids, not claims that a changed demonstration is the answer to a current question. Built-in reset and replay controls allow comparison. Reduced-motion preferences disable animation without removing information.

Mathematical display uses raised exponents, root signs and conventional scientific notation. English speech explicitly reads powers (including negative exponents), decimal digits, fractions, roots, comparisons and squared/cubed measurement units. Finite nonzero scientific numbers are normalised to a coefficient with magnitude at least one and below ten. Exact expressions retain equals; rounded measurements use approximately. Speech-boundary offsets map back to the original text so interruptions do not skip mathematical working. This lightweight formatter is not a full symbolic algebra or LaTeX parser.

## Reuse the independent visual toolkit

Yes, the new visual toolkit can be integrated into another web app. It needs no AI agent, API key, database, framework or Netlify service. Copy these three files into that app's public assets:

- `public/tutor/maths-notation.js`
- `public/tutor/visual-teaching.js`
- `public/tutor/visual-teaching.css`

Load the notation script before the visual script, and include the stylesheet. Then mount a model in an existing DOM container:

```html
<link rel="stylesheet" href="visual-teaching.css">
<div id="maths-model"></div>
<script src="maths-notation.js"></script>
<script src="visual-teaching.js"></script>
<script>
  const model = MathsVisualTeaching.mount(document.getElementById('maths-model'), {
    kind: 'graph',
    values: { slope: 2, intercept: 3, input: 1 },
    onChange: ({ values }) => console.log(values)
  });
  model.setTeachingStep(2);
</script>
```

`MathsVisualTeaching.kinds` lists supported model identifiers. A mounted instance exposes `setTeachingStep(0..2)`, `setInteractive(boolean)`, `getValues()`, `replay()`, `panel` and `destroy()`. Values are bounded according to the selected model; fraction numerators cannot exceed their denominators. Call `destroy()` when leaving the page or unmounting a framework component. Keep score handling and any new persistent data separate; the toolkit does not save anything.

`MathsNotation.display(text)` produces safe display text, not HTML. `MathsNotation.speech(text)` produces English speech text. `MathsNotation.scientific(number)` returns a coefficient, exponent and display string. `speechWithMap(text)` also returns `sourceIndex(spokenCharacterIndex)` for narration checkpoint handling. Use `textContent`, not `innerHTML`, with returned text.

The **Visual maths lab** navigation button opens `public/tutor/visual-teaching-demo.html`, a standalone working example with all ten models and optional browser speech. Its demo scripts use neither the tutor nor its backend.

## Reuse the complete tutor

The whole tutor is not a three-file widget. It has curriculum data, shared browser globals, lesson controls, script ordering and service dependencies. Preserve the ordering in `public/tutor/index.html` when adapting it. `visual-classroom.js` is the tutor-specific adapter and is not required by another app that only needs the visual toolkit.

Natural AI conversations and stored learning still require the application's existing same-origin Netlify Functions, AI Gateway and Database setup, including database migrations. Another origin cannot simply call this site's current protected endpoints. A separate app must integrate those services correctly; no browser credentials should be copied or exposed. Progress remains tied to the existing browser-session and retention policy rather than a cross-app student account.

For a native Android/iOS/Flutter app, these DOM/SVG modules need a web view or a native reimplementation. Browser speech and recognition support must be checked on the target platform. Reusing the visual toolkit does not automatically make browser microphone features portable.

## Validation

`node --test tutor/tests/visual-teaching.test.mjs` checks mathematical formatting and English speech, scientific coefficient bounds, interruption offsets, all ten standalone models, interactive changes, reset, independent demo loading, safe rendering, reduced motion and focus rules. Grade 7 and Grade 8 classroom tests check shared-engine regression, matched visual entry, exploration pause/resume and exercise isolation. Tests simulate browser speech and do not verify real speaker or microphone hardware.
