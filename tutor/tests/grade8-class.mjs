import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';

(async () => {
  const { arithmetic } = await import('../backend/teacher-worker.mjs');
  const html = fs.readFileSync('public/tutor/index.html', 'utf8');
  const dom = new JSDOM(html, { url: 'https://test.local', runScripts: 'outside-only' });
  const browser = dom.window, context = dom.getInternalVMContext(), jobs = new Map(), spoken = [];
  let now = Date.now(), sequence = 0, requests = 0;
  browser.Date.now = () => now;
  browser.setTimeout = (callback, delay = 0) => { jobs.set(++sequence, { callback, at: now + delay }); return sequence; };
  browser.clearTimeout = timer => jobs.delete(timer);
  browser.setInterval = () => 0;
  browser.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: () => () => {} });
  browser.HTMLMediaElement.prototype.pause = () => {};
  browser.scrollTo = () => {};
  browser.HTMLElement.prototype.scrollIntoView = () => {};
  browser.AbortController = AbortController; browser.AbortSignal = AbortSignal;
  browser.SpeechSynthesisUtterance = function(text) { this.text = text; };
  browser.speechSynthesis = { cancel: () => {}, getVoices: () => [], addEventListener: () => {}, speak: utterance => { spoken.push(utterance.text); browser.setTimeout(() => utterance.onend?.(), 60); } };
  browser.fetch = () => { requests++; throw Error('A prepared class must not need an AI request.'); };
  for (const match of html.matchAll(/<script(?: type="[^"]+")? src="([^"]+)"/g)) vm.runInContext(fs.readFileSync('public/tutor/' + match[1].split('?')[0], 'utf8'), context);
  const run = source => vm.runInContext(source, context), element = id => browser.document.getElementById(id);
  function nextJob() {
    assert(jobs.size, 'Expected a pending lesson timer');
    const [timer, job] = [...jobs].sort((first, second) => first[1].at - second[1].at)[0];
    jobs.delete(timer); now = job.at; job.callback();
  }
  function tick(duration) {
    const end = now + duration; let count = 0;
    while (jobs.size && Math.min(...[...jobs.values()].map(job => job.at)) <= end) { assert(++count < 20000, 'Timer loop'); nextJob(); }
    now = end;
  }
  function reachCheck() {
    let count = 0;
    while (!(run('OneToOneClass.state().stage') === 'check' && !run('speechBusy') && !run('writingJobs.size'))) { assert(++count < 20000, 'Missing understanding gate'); nextJob(); }
  }
  const plans = JSON.parse(run('JSON.stringify(GRADE8_CLASS_LESSONS)'));
  const course = JSON.parse(run('JSON.stringify(GRADE8_CLASS_COURSE)'));
  assert.equal(course.chapters.length, 18); assert.equal(Object.keys(plans).length, 60);
  assert.equal(new Set(course.chapters.flatMap(chapter => chapter.sections.flatMap(section => section.topics.map(topic => topic.id)))).size, 60);
  let checked = 0;
  for (const plan of Object.values(plans)) {
    assert.equal(plan.grade, 8); assert.equal(plan.pending, false);
    assert.equal(plan.workedExamples.length, 2); assert.equal(plan.guided.length, 4); assert.equal(plan.classExercise.length, 10);
    assert.equal(new Set([...plan.guided, ...plan.classExercise].map(question => question.q)).size, 14, plan.id);
    for (const question of [...plan.workedExamples.map(example => ({ ...example, a: example.answer })), ...plan.guided, ...plan.classExercise]) {
      for (const spec of question.visual.specs) assert(run('TeachingVisuals.validate(' + JSON.stringify(spec) + ').ok'), plan.id + ': invalid visual');
      if (question.accepted) {
        let expected;
        if (plan.id === 'g8-irrational') expected = Number.isInteger(Math.sqrt(Number(question.q.match(/root of (\d+)/)[1]))) ? 'rational' : 'irrational';
        if (plan.id === 'g8-linear-nonlinear') expected = question.q.includes('x²') ? 'nonlinear' : 'linear';
        if (plan.id === 'g8-equation-solutions') { const values = question.q.match(/2\(x \+ (\d+)\) = 2x \+ (\d+)/); expected = Number(values[1]) * 2 === Number(values[2]) ? 'infinitely many' : 'none'; }
        if (plan.id === 'g8-systems-type') { const intercepts = [...question.q.matchAll(/y = 2x \+ (\d+)/g)].map(match => Number(match[1])); expected = intercepts[0] === intercepts[1] ? 'infinitely many' : 'none'; }
        if (plan.id === 'g8-scatter') { const pairs = [...question.q.matchAll(/\((\d+), (\d+)\)/g)]; expected = Number(pairs.at(-1)[2]) > Number(pairs[0][2]) ? 'positive' : 'negative'; }
        assert.equal(question.accepted[0], expected, plan.id + ': incorrect classification');
        assert(run('OneToOneClass.correct(' + JSON.stringify(expected) + ',' + JSON.stringify(question) + ')'), plan.id);
      }
      else { const expected = arithmetic(question.calculation); assert(Number.isFinite(question.a)); assert(Math.abs(expected - question.a) <= Math.max(1e-8, Math.abs(expected) * 1e-12), plan.id + ': incorrect answer'); checked++; }
    }
    run('Grade8Classes.open(Grade8Classes.byId.get(' + JSON.stringify(plan.id) + '))');
    assert.equal(run('lesson.grade'), 8); assert(element('goal').textContent.startsWith('Grade 8'));
    reachCheck(); assert(element('visual').children.length > 0); assert(!element('visual').innerHTML.includes('NaN'));
    assert.equal(run('OneToOneClass.state().stage'), 'check', plan.id);
  }
  assert.equal(requests, 0); assert(spoken.some(text => text.includes('rational numbers')));
  run("Grade8Classes.open(Grade8Classes.byId.get('g8-function'))");
  assert.equal(element('visualTeaching').hidden, false);
  const visualPoint = run('JSON.stringify({stage:OneToOneClass.state().stage,cursor:OneToOneClass.state().cursor,answers:OneToOneClass.state().answers})');
  element('exploreVisualModel').click(); assert.equal(run('paused'), true);
  const slope = element('visualTeaching').querySelector('[data-parameter="slope"]'); slope.value = 4; slope.dispatchEvent(new browser.Event('input'));
  assert(element('visualTeaching').querySelector('.mvt-equation').textContent.includes('4x'));
  assert.equal(run('JSON.stringify({stage:OneToOneClass.state().stage,cursor:OneToOneClass.state().cursor,answers:OneToOneClass.state().answers})'), visualPoint);
  element('returnFromVisualModel').click(); assert.equal(run('paused'), false);
  assert.equal(run('JSON.stringify({stage:OneToOneClass.state().stage,cursor:OneToOneClass.state().cursor,answers:OneToOneClass.state().answers})'), visualPoint);
  run("Grade8Classes.open(Grade8Classes.byId.get('g8-scientific'))"); reachCheck();
  assert(element('working').textContent.includes('10⁵')); assert(spoken.some(text => text.includes('ten to the power of five')));
  assert(!element('working').textContent.includes('10^'));
  element('grade8ClassNav').click();
  assert(element('portal').textContent.includes('60 voice lessons'));
  const search = element('portal').querySelector('input[type="search"]'); search.value = 'Pythagoras'; search.dispatchEvent(new browser.Event('input'));
  assert.equal(element('portal').querySelector('.portal-cards').children.length, 1);
  search.value = 'no-such-lesson'; search.dispatchEvent(new browser.Event('input')); assert(element('portal').textContent.includes('No lessons match'));
  element('universalPathGrade').value = '7'; element('universalPathGrade').onchange(); assert(element('portal').textContent.includes('textbook'));
  element('universalPathGrade').value = '8'; element('universalPathGrade').onchange(); assert(element('portal').textContent.includes('60 voice lessons'));
  run("$('studentName').value='Nila';Grade8Classes.open(Grade8Classes.byId.get('g8-rational-add'))"); reachCheck();
  run('studentTurn("I understand")'); tick(1000);
  for (let index = 0; index < 4; index++) { run('studentTurn(String(question().a))'); tick(10000); }
  assert.equal(run('OneToOneClass.state().stage'), 'exerciseReady'); element('startClassExercise').click(); tick(1000);
  assert.equal(element('visualTeaching').hidden, true);
  const diagram = [...element('classExercise').querySelectorAll('button')].find(button => button.textContent === 'Show question diagram'); diagram.click();
  assert.equal(element('visualTeaching').hidden, true); assert(!element('visual').textContent.includes(run('lesson.classExercise[0].why')));
  run('OneToOneClass.state().answers=lesson.classExercise.map((question,index)=>index<5?String(question.a):"999")');
  run('OneToOneClass.submit(false)'); tick(1000);
  assert.equal(run('OneToOneClass.state().result.correct'), 5); assert.equal(run('OneToOneClass.state().result.grade'), 8);
  assert.equal(run('Grade8Classes.records().length'), 1); assert.equal(run('Grade7Classes.records().length'), 0);
  assert(run('Grade8Classes.validRecord(OneToOneClass.state().result)'));
  assert.equal(run('Grade8Classes.validRecord({...OneToOneClass.state().result,grade:7})'), false);
  assert.equal(run('Grade8Classes.validRecord({...OneToOneClass.state().result,percent:100})'), false);
  run('OneToOneClass.submit(false)'); assert.equal(run('Grade8Classes.records().length'), 1);
  run('Grade8Classes.dashboard()'); assert(element('portal').textContent.includes('5/10 · 50%')); assert(element('portal').textContent.includes('Needs practice'));
  run("$('studentName').value='Tariq';Grade8Classes.dashboard()"); assert(element('portal').textContent.includes('0 class attempts'));
  run("$('studentName').value='Nila';Grade8Classes.open(Grade8Classes.byId.get('g8-rational-add'))"); reachCheck(); run('studentTurn("I understand")'); tick(1000);
  run('studentTurn(String(question().a))'); tick(10000); const cursor = run('OneToOneClass.state().cursor');
  run('OneToOneClass.clean()'); element('resumeSaved').click(); assert.equal(run('OneToOneClass.state().cursor'), cursor);
  assert.equal(run('nextTeachingTopic().classTopic.id'), 'g8-rational-multiply');
  element('nextTopic').click(); assert.equal(run('lesson.id'), 'g8-rational-multiply');
  run("Grade8Classes.open(Grade8Classes.byId.get('g8-construction'))"); reachCheck(); run('studentTurn("I understand")'); tick(1000);
  for (let index = 0; index < 4; index++) { run('studentTurn(String(question().a))'); tick(10000); }
  element('startClassExercise').click(); tick(1000);
  assert(element('classExercise').textContent.includes('Put the idea into practice'));
  run('OneToOneClass.state().answers=lesson.classExercise.map(question=>String(question.a));OneToOneClass.submit(false)'); tick(1000);
  run('Grade8Classes.dashboard(ontUI,true)'); assert(element('portal').textContent.includes('Practical review pending'));
  const review = [...element('portal').querySelectorAll('button')].find(button => button.textContent === 'Save practical review'); assert(review);
  for (const input of review.parentElement.querySelectorAll('input[type="checkbox"]')) input.checked = true;
  review.click(); assert(run('Grade8Classes.practicalReview(Grade8Classes.records().at(-1).id).passed'));
  run("Grade8Classes.open(Grade8Classes.byId.get('g8-irrational'))"); reachCheck(); run('studentTurn("I understand")'); tick(1000);
  run("$('agentEndpoint').value='https://teacher.example';$('agentPassword').value='test'");
  const expectedChoice = run('question().accepted[0]');
  run('studentTurn(' + JSON.stringify(expectedChoice === 'rational' ? 'irrational' : 'rational') + ')'); tick(1000);
  assert.equal(run('OneToOneClass.state().guided[0].attempts'), 1); assert.equal(run('OneToOneClass.state().guided[0].completed'), undefined);
  run('studentTurn(' + JSON.stringify(expectedChoice) + ')'); tick(10000); assert.equal(run('OneToOneClass.state().cursor'), 1);
  run("$('agentPassword').value=''");
  assert.equal(run('Grade7Classes.records().length'), 0); assert.equal(requests, 0);
  for (const [index, plan] of Object.values(plans).entries()) {
    const record = { id: 'complete-course-' + index, student: 'Samira', studentKey: 'samira', grade: 8, chapterId: plan.chapterId, topicId: plan.id, topic: plan.name, finished: new Date(now + index).toISOString(), answers: plan.classExercise.map(question => String(question.accepted?.[0] ?? question.a)), results: Array(10).fill(true), correct: 10, percent: 100, questions: plan.classExercise.map(question => ({ q: question.q, a: question.a, accepted: question.accepted || null })), guided: [] };
    run('Grade8Classes.saveResult(' + JSON.stringify(record) + ')');
  }
  assert.equal(run('Grade8Classes.records("Samira").length'), 60);
  assert.equal(run('tutorStorage.getItem(Grade8Classes.historyKey)'), null);
  assert.equal(run('Grade8Classes.records("Nila").length'), 2);
  assert(run('Array.from({length:tutorStorage.length},(_,index)=>tutorStorage.key(index)).filter(key=>key.startsWith("ut-grade8-class-attempt-v1:")).every(key=>tutorStorage.getItem(key).length<300000)'));
  console.log(`60 Grade 8 voice lessons, ${checked} recalculated numerical answers, chapter search, grade switching, voiced examples, guided replies, scoring, isolated records, resume, next-topic navigation and separate practical review passed (simulated browser voice).`);
  dom.window.close();
})().catch(error => { console.error(error); process.exitCode = 1; });
