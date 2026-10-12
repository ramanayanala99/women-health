import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';

function classroom(query = '') {
  const html = fs.readFileSync('public/tutor/index.html', 'utf8');
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'https://classroom.test/tutor/index.html' + query });
  const browser = dom.window;
  const context = dom.getInternalVMContext();
  const timers = new Map();
  let time = Date.now();
  let sequence = 0;
  const writes = [];
  browser.Date.now = () => time;
  browser.setTimeout = (callback, delay = 0) => { timers.set(++sequence, { callback, time: time + delay }); return sequence; };
  browser.clearTimeout = timer => timers.delete(timer);
  browser.setInterval = () => 0;
  browser.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: () => () => {} });
  browser.HTMLMediaElement.prototype.pause = () => {};
  browser.scrollTo = () => {};
  browser.HTMLElement.prototype.scrollIntoView = () => {};
  browser.AbortController = AbortController;
  browser.AbortSignal = AbortSignal;
  browser.SpeechSynthesisUtterance = function (text) { this.text = text; };
  browser.speechSynthesis = {
    cancel() {}, getVoices: () => [], addEventListener() {},
    speak(utterance) { browser.setTimeout(() => utterance.onend?.(), 50); },
  };
  browser.fetch = async (url, options = {}) => {
    assert.equal(url, '/api/tutor/progress', 'Prepared lessons must not require an AI request');
    if (options.method === 'POST') writes.push(JSON.parse(options.body));
    return { ok: true, json: async () => ({ values: {} }) };
  };
  for (const match of html.matchAll(/<script(?: type="[^"]+")? src="([^"]+)"/g)) {
    vm.runInContext(fs.readFileSync('public/tutor/' + match[1].split('?')[0], 'utf8'), context);
  }
  const run = source => vm.runInContext(source, context);
  const get = id => browser.document.getElementById(id);
  function nextTimer() {
    assert.ok(timers.size, 'Expected lesson timer');
    const [timer, job] = [...timers].sort((first, second) => first[1].time - second[1].time)[0];
    timers.delete(timer);
    time = job.time;
    job.callback();
  }
  function tick(duration) {
    const end = time + duration;
    let count = 0;
    while (timers.size && Math.min(...[...timers.values()].map(job => job.time)) <= end) {
      assert.ok(++count < 20000, 'Timer loop');
      nextTimer();
    }
    time = end;
  }
  function reachCheck() {
    let count = 0;
    while (!(run('OneToOneClass.state().stage') === 'check' && !run('speechBusy') && !run('writingJobs.size'))) {
      assert.ok(++count < 20000, 'Missing understanding check');
      nextTimer();
    }
  }
  return { dom, browser, run, get, tick, reachCheck, writes };
}

test('the direct algebra link opens exactly two complete chapters and all seven topics', () => {
  const { dom, get, run } = classroom('?grade8-algebra=1');
  const catalogue = get('grade8AlgebraChapters');
  assert.ok(catalogue);
  assert.equal(catalogue.querySelectorAll('.g8-chapter-card').length, 2);
  assert.equal(catalogue.querySelectorAll('[data-topic]').length, 7);
  assert.ok(catalogue.textContent.includes('Algebraic expressions and identities'));
  assert.ok(catalogue.textContent.includes('Linear equations and inequalities'));
  assert.ok(catalogue.textContent.includes('14 worked examples'));
  assert.ok(catalogue.textContent.includes('28 guided questions'));
  assert.ok(catalogue.textContent.includes('70 exercise questions'));
  assert.equal(run('OneToOneClass.active()'), false);
  assert.equal(run('speechBusy'), false);
  assert.equal(get('grade8AlgebraScene'), null);
  assert.ok(fs.readFileSync('src/app/page.tsx', 'utf8').includes('grade8-algebra=1'));
  dom.window.close();
});

test('both chapter selectors and next-lesson controls open real classes without duplicated boards', async () => {
  const { dom, browser, run, get } = classroom('?grade8-algebra=1');
  get('grade8AlgebraChapters').querySelector('[data-start-chapter="g8-ch-6"]').click();
  await Promise.resolve();
  assert.equal(run('lesson.id'), 'g8-substitution');
  assert.ok(browser.document.body.classList.contains('grade8-algebra-board'));
  assert.equal(get('grade8BoardHeading').textContent, 'Algebraic expressions and identities');
  assert.equal(get('grade8BoardTopic').querySelectorAll('option').length, 4);
  assert.ok(get('grade8BoardPrevious').disabled);
  get('grade8BoardNext').click();
  assert.equal(run('lesson.id'), 'g8-expand');
  const picker = get('grade8BoardChapter');
  picker.value = 'g8-ch-7';
  picker.dispatchEvent(new browser.Event('change'));
  assert.equal(run('lesson.id'), 'g8-linear-equation');
  assert.equal(get('grade8BoardTopic').querySelectorAll('option').length, 3);
  get('grade8BoardTopic').value = 'g8-inequality';
  get('grade8BoardTopic').dispatchEvent(new browser.Event('change'));
  assert.ok(get('grade8BoardNext').disabled);
  assert.equal(browser.document.querySelectorAll('.g8-board-heading').length, 1);
  assert.equal(browser.document.querySelectorAll('.board').length, 1);
  assert.ok(get('grade8AlgebraScene').contains(get('visual')));
  run('Grade8Classes.open(Grade8Classes.byId.get("g8-rational-add"))');
  assert.equal(get('grade8AlgebraScene'), null);
  assert.ok(!browser.document.body.classList.contains('grade8-algebra-board'));
  assert.equal(browser.document.querySelector('.columns > .board')?.contains(get('working')), true);
  dom.window.close();
});

test('all seven lessons teach two examples, guide four answers, score ten questions and save through Netlify', async () => {
  const { dom, run, get, tick, reachCheck, writes } = classroom();
  await run('tutorStorage.hydrate()');
  const topics = JSON.parse(run('JSON.stringify(Grade8AlgebraBoard.topics)'));
  run("$('studentName').value='Nila'");
  for (const topic of topics) {
    run(`Grade8Classes.open(Grade8Classes.byId.get(${JSON.stringify(topic.id)}))`);
    await Promise.resolve();
    assert.ok(get('grade8AlgebraScene'), topic.id);
    assert.equal(run('lesson.workedExamples.length'), 2);
    assert.equal(run('lesson.guided.length'), 4);
    assert.equal(run('lesson.classExercise.length'), 10);
    reachCheck();
    assert.ok(get('working').textContent.trim().length > 0);
    run('studentTurn("I understand")');
    tick(1000);
    for (let question = 0; question < 4; question++) {
      run('studentTurn(question().accepted?.[0] || String(question().a))');
      tick(10000);
    }
    assert.equal(run('OneToOneClass.state().stage'), 'exerciseReady', topic.id);
    get('startClassExercise').click();
    tick(1000);
    assert.equal(get('classExercise').querySelectorAll('input').length, 10);
    run('OneToOneClass.state().answers=lesson.classExercise.map(question=>question.accepted?.[0] || String(question.a))');
    run('OneToOneClass.submit(false)');
    tick(1000);
    assert.equal(run('OneToOneClass.state().result.correct'), 10, topic.id);
    assert.equal(run('OneToOneClass.state().result.percent'), 100, topic.id);
    assert.equal(run('Grade8Classes.validRecord(OneToOneClass.state().result)'), true);
    assert.ok(get('grade8AlgebraScene'));
    await Promise.resolve();
    await Promise.resolve();
  }
  assert.equal(run('Grade8Classes.records().length'), 7);
  for (const chapter of ['g8-ch-6', 'g8-ch-7']) {
    assert.equal(run(`Grade8Classes.chapterStats(Grade8Classes.course.chapters.find(chapter=>chapter.id===${JSON.stringify(chapter)})).complete`), true);
  }
  run('Grade8AlgebraBoard.openChapters()');
  tick(1000);
  await Promise.resolve();
  await Promise.resolve();
  assert.ok(writes.length > 0);
  assert.ok(writes.some(write => write.key?.startsWith('ut-grade8-class-attempt-v1:')));
  assert.ok(get('grade8AlgebraChapters').textContent.includes('4 / 4 lessons assessed'));
  assert.ok(get('grade8AlgebraChapters').textContent.includes('3 / 3 lessons assessed'));
  assert.equal(get('grade8AlgebraScene'), null);
  dom.window.close();
});

test('the algebra board restores on saved-class resume and is removed on exit', async () => {
  const { dom, browser, get, run, reachCheck, tick } = classroom();
  run('Grade8Classes.open(Grade8Classes.byId.get("g8-substitution"))');
  reachCheck();
  run('studentTurn("I understand")');
  tick(1000);
  run('studentTurn(String(question().a))');
  tick(10000);
  const cursor = run('OneToOneClass.state().cursor');
  run('OneToOneClass.clean()');
  assert.equal(get('grade8AlgebraScene'), null);
  get('resumeSaved').click();
  assert.equal(run('OneToOneClass.state().cursor'), cursor);
  assert.ok(get('grade8AlgebraScene'));
  browser.document.querySelector('.room-toolbar button').click();
  await Promise.resolve();
  assert.equal(get('grade8AlgebraScene'), null);
  assert.ok(!browser.document.body.classList.contains('grade8-algebra-board'));
  dom.window.close();
});
