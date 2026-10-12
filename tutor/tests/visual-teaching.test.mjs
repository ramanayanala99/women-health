import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

function environment(html = '<main id="lab"></main>') {
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://another-app.test/' });
  const context = dom.getInternalVMContext();
  for (const filename of ['maths-notation.js', 'visual-teaching.js']) vm.runInContext(fs.readFileSync('public/tutor/' + filename, 'utf8'), context);
  return dom;
}

test('mathematical display preserves exponent grouping and normalises scientific notation', () => {
  const dom = environment(), notation = dom.window.MathsNotation;
  assert.equal(notation.display('4.2 × 10^(-3)'), '4.2 × 10⁻³');
  assert.equal(notation.display('10^(3 + 2)'), '10³⁺²');
  assert.equal(notation.display('x^2 + sqrt(25) + pi'), 'x² + √(25) + π');
  assert.equal(notation.display('6.02e23'), '6.02 × 10²³');
  for (const value of [720000, .0042, -3500, 1, 9.9, 10, 1e-20, 1e20, Number.MAX_VALUE]) {
    const result = notation.scientific(value); assert(Math.abs(result.coefficient) >= 1 && Math.abs(result.coefficient) < 10);
    assert(Math.abs(result.coefficient * 10 ** result.exponent / value - 1) < 1e-12);
  }
  assert.equal(notation.scientific(.0042).text, '4.2 × 10⁻³'); assert.equal(notation.scientific(0).text, '0');
  assert.throws(() => notation.scientific(Infinity)); dom.window.close();
});

test('speech explicitly reads powers, fractions, decimals, units, roots and comparisons', () => {
  const dom = environment(), notation = dom.window.MathsNotation;
  assert.equal(notation.speech('4.2 × 10⁻³'), '4 point two times ten to the power of minus three');
  assert.equal(notation.speech('10^(3 + 2)'), 'ten to the power of the quantity 3 plus 2');
  assert.equal(notation.speech('10³⁺²'), 'ten to the power of the quantity 3 plus 2');
  assert.equal(notation.speech('6.02e23'), '6 point zero two times ten to the power of 23');
  assert.equal(notation.speech('3/4 + ½ = 1.25'), '3 over 4 plus one half equals 1 point two five');
  assert.equal(notation.speech('A = 24 cm²; V = 8 m³'), 'A equals 24 square centimetres; V equals 8 cubic metres');
  assert.equal(notation.speech('sqrt(25) = 5 cm'), 'square root of 25 equals 5 centimetres');
  assert.equal(notation.speech('2 × (3 + 4)'), '2 times open bracket 3 plus 4 close bracket');
  assert.equal(notation.speech('sqrt(3² + 4²)'), 'square root of the quantity 3 squared plus 4 squared end quantity');
  assert.equal(notation.speech('y = m x + b; m² + n²'), 'y equals m x plus b; m squared plus n squared');
  assert.equal(notation.speech('x ≤ 2; y ≠ 3; pi ≈ 3.14'), 'x is less than or equal to 2; y is not equal to 3; pi is approximately 3 point one four');
  assert.equal(notation.speech('one-to-one teaching'), 'one-to-one teaching'); dom.window.close();
});

test('speech boundary positions map back to the original teaching text', () => {
  const dom = environment(), notation = dom.window.MathsNotation, source = 'Use 4.2 × 10⁻³. Next step.';
  const converted = notation.speechWithMap(source), start = converted.text.indexOf('Next');
  assert.equal(converted.sourceIndex(start), source.indexOf('Next'));
  assert.equal(notation.speech(source.slice(converted.sourceIndex(start))), 'Next step.');
  assert.equal(converted.sourceIndex(converted.text.length), source.length);
  let previous = 0; for (let index = 0; index <= converted.text.length; index++) { const position = converted.sourceIndex(index); assert(position >= previous && position <= source.length); previous = position; }
  dom.window.close();
});

test('every standalone visual model renders and reacts without a tutor or backend', () => {
  const dom = environment(), browser = dom.window, toolkit = browser.MathsVisualTeaching, host = browser.document.getElementById('lab');
  assert.equal(toolkit.kinds.length, 10); assert.equal(browser.tutorStorage, undefined);
  for (const kind of toolkit.kinds) {
    const model = toolkit.mount(host, { kind }); model.setTeachingStep(2);
    assert(model.panel.querySelector('svg[role="img"]')); assert(!model.panel.innerHTML.includes('NaN')); assert(model.panel.querySelector('.mvt-equation').textContent);
    const initial = model.panel.querySelector('.mvt-equation').textContent;
    const input = model.panel.querySelector('input[type="range"]'); input.value = input.max; input.dispatchEvent(new browser.Event('input'));
    assert.notEqual(model.panel.querySelector('.mvt-equation').textContent, initial, kind);
    assert(model.panel.querySelector('[role="status"]').textContent); assert(input.getAttribute('aria-label'));
    model.setInteractive(false); assert.equal(model.panel.querySelector('.mvt-controls').hidden, true); model.setInteractive(true);
    model.panel.querySelector('.mvt-actions button:nth-child(2)').click(); assert.equal(model.panel.querySelector('.mvt-equation').textContent, initial);
    model.replay(); assert(model.panel.querySelectorAll('.mvt-line').length || kind === 'fraction'); model.destroy(); assert.equal(host.children.length, 0);
  }
  assert.throws(() => toolkit.mount(host, { kind: 'not-a-model' })); assert.throws(() => toolkit.mount(host, { kind: '__proto__' })); dom.window.close();
});

test('fractions remain valid as their denominator changes; model values cannot inject HTML', () => {
  const dom = environment(), browser = dom.window, host = browser.document.getElementById('lab');
  const model = browser.MathsVisualTeaching.mount(host, { kind: 'fraction', values: { numerator: 11, denominator: 12 } });
  const denominator = model.panel.querySelector('[data-parameter="denominator"]'); denominator.value = 2; denominator.dispatchEvent(new browser.Event('input'));
  assert.equal(model.getValues().numerator, 2); assert.equal(model.panel.querySelectorAll('.is-filled').length, 2);
  assert.equal(model.panel.querySelector('.mvt-equation').textContent, '2/2 = 1'); model.destroy();
  const malicious = browser.MathsVisualTeaching.mount(host, { kind: 'scientific', values: { coefficient: '<img onerror=alert(1)>' } });
  assert.equal(malicious.panel.querySelector('img'), null); assert.equal(malicious.getValues().coefficient, 4.2); dom.window.close();
});

test('standalone demo runs independently and explains voice support without requesting a microphone', () => {
  const dom = environment(fs.readFileSync('public/tutor/visual-teaching-demo.html', 'utf8'));
  vm.runInContext(fs.readFileSync('public/tutor/visual-teaching-demo.js', 'utf8'), dom.getInternalVMContext());
  assert.equal(dom.window.document.querySelectorAll('.mvt-lab').length, 10);
  const read = [...dom.window.document.querySelectorAll('button')].find(button => button.textContent === 'Read this model'); read.click();
  assert.match(dom.window.document.getElementById('demoVoiceStatus').textContent, /Speech is unavailable/); dom.window.close();
});

test('animations respect reduced motion and controls retain visible keyboard focus', () => {
  const css = fs.readFileSync('public/tutor/visual-teaching.css', 'utf8'); assert.match(css, /prefers-reduced-motion:reduce/); assert.match(css, /focus-visible/); assert.match(css, /stroke-dashoffset:0/);
});
