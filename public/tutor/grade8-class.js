const Grade8Classes = (() => {
  const course = GRADE8_CLASS_COURSE, lessons = GRADE8_CLASS_LESSONS;
  const topics = course.chapters.flatMap(chapter => chapter.sections.flatMap(section => section.topics));
  const byId = new Map(topics.map(topic => [topic.id, topic]));
  const historyKey = 'ut-grade8-class-assessments-v1', reviewKey = 'ut-grade8-practical-reviews-v1';
  const attemptPrefix = 'ut-grade8-class-attempt-v1:';
  const read = key => { try { return JSON.parse(tutorStorage.getItem(key) || 'null'); } catch { return null; } };
  const studentKey = name => String(name || 'Learner').trim().toLocaleLowerCase();
  for (const item of Object.values(lessons)) if (!LESSONS.some(existing => existing.id === item.id)) LESSONS.push(item);
  function validRecord(record) {
    const prepared = lessons[record?.topicId];
    return !!prepared && typeof record.id === 'string' && typeof record.student === 'string' && record.student.length <= 40 && record.studentKey === studentKey(record.student) && record.grade === 8 && record.chapterId === prepared.chapterId && Number.isFinite(Date.parse(record.finished)) && Array.isArray(record.answers) && record.answers.length === 10 && record.answers.every(answer => typeof answer === 'string' && answer.length <= 100) && Array.isArray(record.results) && record.results.length === 10 && record.results.every((correct, index) => typeof correct === 'boolean' && correct === OneToOneClass.correct(record.answers[index], prepared.classExercise[index])) && record.correct === record.results.filter(Boolean).length && record.percent === record.correct * 10 && Array.isArray(record.questions) && record.questions.length === 10 && record.questions.every((item, index) => item && item.q === prepared.classExercise[index].q && item.a === prepared.classExercise[index].a && JSON.stringify(item.accepted || null) === JSON.stringify(prepared.classExercise[index].accepted || null)) && Array.isArray(record.guided) && record.guided.length <= 4 && (!record.practicalEvidence || (typeof record.practicalEvidence === 'string' && record.practicalEvidence.length <= 2000)) && (!record.practicalDrawing || (typeof record.practicalDrawing === 'string' && record.practicalDrawing.length < 300000 && /^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(record.practicalDrawing)));
  }
  function allRecords() {
    const legacy = read(historyKey), rows = Array.isArray(legacy) ? [...legacy] : [];
    for (let index = 0; index < tutorStorage.length; index++) { const key = tutorStorage.key(index); if (key?.startsWith(attemptPrefix)) rows.push(read(key)); }
    return [...new Map(rows.filter(validRecord).map(record => [record.id, record])).values()].sort((first, second) => Date.parse(first.finished) - Date.parse(second.finished));
  }
  function saveResult(record) { if (!validRecord(record)) throw Error('Invalid Grade 8 result.'); tutorStorage.setItem(attemptPrefix + record.id, JSON.stringify(record)); }
  function records(name = practiceStudent()) { return allRecords().filter(record => record.studentKey === studentKey(name)); }
  function latest(id, name) { return records(name).filter(record => record.topicId === id).at(-1); }
  function practicalReview(id) { return (read(reviewKey) || {})[id]; }
  function chapterStats(chapter, name) {
    const rows = chapter.sections.flatMap(section => section.topics), done = rows.filter(topic => latest(topic.id, name));
    const reviewPending = done.filter(topic => lessons[topic.id].practicalActivity && !practicalReview(latest(topic.id, name).id)?.passed).length;
    return { total: rows.length, done: done.length, reviewPending, complete: done.length === rows.length && !reviewPending };
  }
  function open(topic) {
    if (!topic || !byId.has(topic.id)) return;
    if (agentEnabled) endAgent(false);
    AutomaticLessons.cancel(); ontActiveTopic = null; centralDraftContext = null;
    tutorStorage.setItem('ut-learning-mode', 'universal'); tutorStorage.setItem('ut-universal-grade', '8');
    $('grade').value = '8'; originalGradeChanged();
    if (!$('topic').querySelector('option[value="' + topic.id + '"]')) $('topic').append(new Option(topic.title, topic.id));
    $('topic').value = topic.id; ontUI.show('classroom'); autoVoice = true; $('start').click(); refreshChapterSubtopics();
  }
  function render(portalUI) {
    ontUI = portalUI;
    const { portal, el, button, heading } = portalUI;
    heading(course.title, 'Learn with your tutor: explanation → two examples → four guided questions → ten-question class exercise. Speak or type your replies.');
    const gradeLabel = el('label', 'Learning grade'), grade = el('select'); grade.id = 'universalPathGrade';
    for (let level = 1; level <= 12; level++) grade.append(new Option('Grade ' + level, String(level)));
    grade.value = '8'; grade.onchange = () => { tutorStorage.setItem('ut-universal-grade', grade.value); portalUI.show('universal'); }; gradeLabel.append(grade); portal.append(gradeLabel);
    const learner = el('label', 'Student first name'), name = el('input'); name.value = $('studentName').value; name.maxLength = 40;
    name.onchange = () => { $('studentName').value = name.value.trim(); tutorStorage.setItem('ut-student-name', name.value.trim()); portalUI.show('universal'); }; learner.append(name); portal.append(learner);
    portal.append(el('p', course.chapters.length + ' chapters · ' + course.chapters.reduce((count, chapter) => count + chapter.sections.length, 0) + ' subchapters · ' + topics.length + ' voice lessons', 'portal-feature'), el('p', 'International topic collection, not a promise of every country’s syllabus. Grade levels vary. Browser speech works without a microphone; you can always type.'), button('Continue my course', () => open(topics.find(topic => !latest(topic.id)) || topics[0])), button('My Grade 8 dashboard', () => dashboard(portalUI)));
    const search = el('input'); search.type = 'search'; search.placeholder = 'Find a chapter, subchapter or skill'; search.setAttribute('aria-label', 'Find a Grade 8 lesson');
    const list = el('div', undefined, 'portal-cards'); portal.append(search, list);
    function draw() {
      list.replaceChildren();
      for (const [index, chapter] of course.chapters.entries()) {
        const sections = chapter.sections.map(section => ({ ...section, topics: section.topics.filter(topic => (chapter.title + ' ' + section.title + ' ' + topic.title).toLowerCase().includes(search.value.trim().toLowerCase())) })).filter(section => section.topics.length);
        if (!sections.length) continue;
        const stats = chapterStats(chapter), card = el('section', undefined, 'portal-card');
        card.append(el('span', 'CHAPTER ' + (index + 1) + (chapter.extension ? ' · STAGE-WIDE EXTENSION' : ' · INTERNATIONAL COURSE'), 'eyebrow'), el('h2', chapter.title), el('p', stats.done + ' / ' + stats.total + ' topics attempted' + (stats.reviewPending ? ' · practical review pending' : '')), button('Start chapter', () => open(chapter.sections.flatMap(section => section.topics).find(topic => !latest(topic.id)) || chapter.sections[0].topics[0])));
        const tree = el('details'); tree.append(el('summary', sections.length + ' subchapters · explore lessons'));
        for (const section of sections) { tree.append(el('h3', section.title)); for (const topic of section.topics) { const result = latest(topic.id); tree.append(button(topic.title + (result ? ' · ' + result.percent + '%' : ''), () => open(topic))); } }
        card.append(tree); list.append(card);
      }
      if (!list.children.length) list.append(el('p', 'No lessons match that search. Try a topic such as fractions, graphs or volume.'));
    }
    search.oninput = draw; draw();
    const coverage = el('details', undefined, 'portal-card'); coverage.append(el('summary', 'Curriculum sources and coverage limits'), el('p', course.notes));
    for (const source of course.sources) { const link = el('a', source.title); link.href = source.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; coverage.append(link, el('p', source.status)); }
    const guide = el('a', 'Read the topic map and source-checking notes'); guide.href = 'grade8-course-guide.html'; guide.target = '_blank'; guide.rel = 'noopener'; coverage.append(guide); portal.append(coverage);
  }
  function dashboard(portalUI = ontUI, parent = false) {
    const { portal, el, button, heading } = portalUI; portal.replaceChildren();
    heading(parent ? 'Grade 8 · Parent and teacher report' : 'My Grade 8 progress', 'Scores are for ten supporting questions. Practical constructions need a separate review. An attempt is not a certificate of mastery.');
    const names = [...new Set([practiceStudent(), ...allRecords().map(record => record.student)])];
    const label = el('label', 'Student'), picker = el('select'); for (const name of names) picker.append(new Option(name, name)); picker.value = practiceStudent(); label.append(picker);
    const report = el('div'); portal.append(label, report);
    function draw() {
      report.replaceChildren(); const rows = records(picker.value);
      report.append(el('p', rows.length + ' class attempts · ' + new Set(rows.map(record => record.topicId)).size + ' lesson topics attempted'));
      for (const chapter of course.chapters) {
        const stats = chapterStats(chapter, picker.value), card = el('details', undefined, 'portal-card'); card.open = stats.done > 0;
        card.append(el('summary', chapter.title + ' · ' + stats.done + '/' + stats.total + ' attempted' + (stats.reviewPending ? ' · practical review pending' : '')));
        for (const section of chapter.sections) { card.append(el('h3', section.title)); for (const topic of section.topics) { const result = latest(topic.id, picker.value); card.append(el('p', topic.title + ' · ' + (result ? result.correct + '/10 · ' + result.percent + '% · ' + (result.percent < 80 ? 'Needs practice' : 'Strong result') : 'Not started'))); } }
        for (const result of rows.filter(record => record.chapterId === chapter.id).reverse()) {
          const attempt = el('details'); attempt.append(el('summary', result.topic + ' · ' + result.percent + '% · ' + new Date(result.finished).toLocaleString()));
          lessons[result.topicId].classExercise.forEach((question, index) => attempt.append(el('p', (index + 1) + '. ' + question.q + ' · Your answer: ' + (result.answers[index] || 'Not answered') + ' · ' + (result.results[index] ? 'Correct' : 'Review: ' + question.why))));
          const activity = lessons[result.topicId].practicalActivity;
          if (activity) {
            attempt.append(el('p', activity.prompt), el('p', 'Student notes: ' + (result.practicalEvidence || 'Not provided')), el('p', practicalReview(result.id)?.passed ? 'Practical review passed' : 'Practical review pending'));
            if (result.practicalDrawing) { const drawing = el('img'); drawing.src = result.practicalDrawing; drawing.alt = 'Saved student construction for review'; drawing.style.maxWidth = '100%'; attempt.append(drawing); }
            if (parent) {
              const checks = activity.rubric.map((criterion, index) => { const label = el('label', criterion), input = el('input'); input.type = 'checkbox'; input.checked = !!practicalReview(result.id)?.checks[index]; label.prepend(input); attempt.append(label); return input; });
              attempt.append(button('Save practical review', () => { const all = read(reviewKey) || {}, values = checks.map(input => input.checked); all[result.id] = { checks: values, passed: values.every(Boolean), reviewed: new Date().toISOString() }; tutorStorage.setItem(reviewKey, JSON.stringify(all)); draw(); }));
            }
          }
          card.append(attempt);
        }
        report.append(card);
      }
    }
    picker.onchange = draw; draw();
    portal.append(button('Back to Grade 8 lessons', () => { tutorStorage.setItem('ut-universal-grade', '8'); portalUI.show('universal'); }), button('Export Grade 8 progress', () => { const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, grade: 8, records: records(picker.value) }, null, 2)], { type: 'application/json' })), link = el('a'); link.href = url; link.download = 'grade8-class-progress.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }));
  }
  return { course, lessons, topics, bookTopics: topics, byId, open, render, dashboard, records, latest, chapterStats, studentKey, historyKey, validRecord, practicalReview, saveResult };
})();

const grade8PriorUniversal = renderUniversalMaths;
renderUniversalMaths = function(portalUI) {
  if ((tutorStorage.getItem('ut-universal-grade') || $('grade').value) === '8') return Grade8Classes.render(portalUI);
  grade8PriorUniversal(portalUI);
  const picker = $('universalPathGrade');
  if (picker) { const previous = picker.onchange; picker.onchange = () => { if (picker.value === '8') { tutorStorage.setItem('ut-universal-grade', '8'); portalUI.show('universal'); } else previous?.(); }; }
};
const grade8Nav = document.createElement('button'); grade8Nav.id = 'grade8ClassNav'; grade8Nav.textContent = 'Grade 8 voice classes'; grade8Nav.onclick = () => { tutorStorage.setItem('ut-universal-grade', '8'); ontUI.show('universal'); }; document.querySelector('.app-nav').append(grade8Nav);
const grade8PriorHome = renderOntarioHome;
renderOntarioHome = function(portalUI) { grade8PriorHome(portalUI); portalUI.portal.append(portalUI.button('Grade 8 international voice classes', grade8Nav.onclick)); };
const grade8PriorParents = renderOntarioParentSummary;
renderOntarioParentSummary = function(...args) { grade8PriorParents(...args); const button = document.createElement('button'); button.textContent = 'View scored Grade 8 class history'; button.onclick = () => Grade8Classes.dashboard(ontUI, true); args[0].prepend(button); };
const grade8PriorDashboard = $('classDashboardNav').onclick;
$('classDashboardNav').onclick = () => { if (tutorStorage.getItem('ut-universal-grade') !== '8') return grade8PriorDashboard(); pauseAdvance(true); ontUI.show('home'); Grade8Classes.dashboard(); };
