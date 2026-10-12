import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

function classroom({ speech = false, reducedMotion = true } = {}) {
  const dom = new JSDOM(readFileSync('public/tutor/board-preview.html', 'utf8'), {
    runScripts: 'outside-only',
    url: 'https://classroom.test/tutor/board-preview.html',
  });
  const browser = dom.window;
  const utterances = [];
  const events = { cancelled: 0 };
  browser.matchMedia = () => ({ matches: reducedMotion });
  if (speech) {
    browser.SpeechSynthesisUtterance = function (text) { this.text = text; };
    browser.speechSynthesis = {
      speak(utterance) { utterances.push(utterance); utterance.onstart?.(); },
      cancel() { events.cancelled++; utterances.at(-1)?.onerror?.(); },
    };
  }
  vm.runInContext(readFileSync('public/tutor/board-preview.js', 'utf8'), dom.getInternalVMContext());
  return { dom, browser, utterances, events, get: id => browser.document.getElementById(id) };
}

test('preview matches the reference subject and keeps the new board limited to one class', () => {
  const { dom, get } = classroom();
  assert.equal(get('boardHeading').textContent, 'Measurement and Geometry');
  assert.ok(get('boardContents').textContent.includes('Grade 9'));
  assert.ok(get('boardContents').textContent.includes('Measurement and Geometry strand'));
  assert.equal(get('stepCounter').textContent, '1 / 6');
  assert.ok(get('previousStep').disabled);
  assert.equal(get('practiceAnswer'), null);
  assert.ok(existsSync('public/tutor/board-teacher.png'));
  const mainClassroom = readFileSync('public/tutor/index.html', 'utf8');
  assert.ok(!mainClassroom.includes('board-preview.js'));
  assert.ok(!mainClassroom.includes('board-preview.css'));
  assert.ok(mainClassroom.includes('href="board-preview.html"'));
  assert.ok(readFileSync('src/app/page.tsx', 'utf8').includes('/tutor/board-preview.html'));
  dom.window.close();
});

test('one class advances through the formula and worked example, and can go back or restart', () => {
  const { dom, browser, get } = classroom();
  get('nextStep').click();
  assert.ok(get('boardContents').textContent.includes('a² + b² = c²'));
  assert.ok(browser.document.querySelector('svg[role="img"] title').textContent.includes('Right triangle'));
  get('nextStep').click();
  assert.ok(get('boardContents').textContent.includes('3 cm'));
  get('nextStep').click();
  assert.ok(get('boardContents').textContent.includes('c² = 25'));
  get('nextStep').click();
  assert.ok(get('boardContents').textContent.includes('c = 5 cm'));
  get('previousStep').click();
  assert.equal(get('stepCounter').textContent, '4 / 6');
  get('restartClass').click();
  assert.equal(get('stepCounter').textContent, '1 / 6');
  assert.ok(get('previousStep').disabled);
  dom.window.close();
});

test('practice rejects empty and malformed answers and checks the new triangle correctly', () => {
  const { dom, browser, get } = classroom();
  for (let step = 0; step < 5; step++) get('nextStep').click();
  assert.ok(get('nextStep').disabled);
  assert.equal(get('teacherStatus').textContent, 'Your turn to try');
  const form = browser.document.querySelector('.practice-form');
  const submit = () => form.dispatchEvent(new browser.Event('submit', { bubbles: true, cancelable: true }));
  for (const value of ['', '-13', '13cm', '<img src=x onerror=alert(1)>']) {
    get('practiceAnswer').value = value;
    submit();
    assert.ok(get('practiceFeedback').textContent.includes('Enter a positive number'));
    assert.equal(get('practiceAnswer').getAttribute('aria-invalid'), 'true');
  }
  get('practiceAnswer').value = '169';
  submit();
  assert.ok(get('practiceFeedback').textContent.includes('Not quite'));
  get('practiceAnswer').value = '13';
  submit();
  assert.ok(get('practiceFeedback').textContent.includes('Correct!'));
  assert.ok(get('practiceFeedback').textContent.includes('√169 = 13 cm'));
  assert.equal(get('teacherStatus').textContent, 'Nicely worked out');
  assert.equal(get('practiceAnswer').getAttribute('aria-invalid'), 'false');
  get('restartClass').click();
  assert.equal(get('practiceFeedback'), null);
  dom.window.close();
});

test('voice is opt-in, stops when moving steps, and ignores stale speech events', () => {
  const { dom, get, utterances, events } = classroom({ speech: true });
  assert.equal(utterances.length, 0);
  get('listenStep').click();
  assert.equal(utterances.length, 1);
  assert.equal(get('listenStep').getAttribute('aria-pressed'), 'true');
  assert.equal(get('teacherStatus').textContent, 'Explaining this step');
  const stale = utterances[0];
  get('nextStep').click();
  assert.equal(events.cancelled, 1);
  assert.equal(get('listenStep').getAttribute('aria-pressed'), 'false');
  get('listenStep').click();
  stale.onend();
  assert.equal(get('teacherStatus').textContent, 'Explaining this step');
  utterances[1].onend();
  assert.equal(get('listenStep').getAttribute('aria-pressed'), 'false');
  assert.ok(get('voiceStatus').textContent.includes('Explanation finished'));
  dom.window.close();
});

test('voice failures, unsupported browsers, and leaving the page have safe states', () => {
  const unsupported = classroom();
  unsupported.get('listenStep').click();
  assert.ok(unsupported.get('voiceStatus').textContent.includes('does not offer spoken explanations'));
  unsupported.dom.window.close();
  const { dom, browser, get, utterances, events } = classroom({ speech: true });
  get('listenStep').click();
  utterances[0].onerror();
  assert.ok(get('voiceStatus').textContent.includes('could not play'));
  get('listenStep').click();
  browser.dispatchEvent(new browser.Event('pagehide'));
  assert.equal(events.cancelled, 1);
  assert.equal(get('listenStep').getAttribute('aria-pressed'), 'false');
  dom.window.close();
});

test('the preview respects reduced motion and does not request a microphone or persist practice', () => {
  const { dom, get } = classroom();
  assert.ok(!get('boardContents').classList.contains('is-arriving'));
  const source = readFileSync('public/tutor/board-preview.js', 'utf8');
  assert.ok(!/getUserMedia|localStorage|sessionStorage|fetch\(/.test(source));
  const css = readFileSync('public/tutor/board-preview.css', 'utf8');
  assert.ok(css.includes('prefers-reduced-motion'));
  assert.ok(css.includes(':focus-visible'));
  assert.ok(css.includes('max-width: 600px'));
  dom.window.close();
});
