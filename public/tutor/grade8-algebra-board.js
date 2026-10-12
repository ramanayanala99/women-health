(() => {
  const grade8Chapters = Grade8Classes.course.chapters.filter(chapter => ['g8-ch-6', 'g8-ch-7'].includes(chapter.id));
  const grade9Chapters = grade9Course.chapters.filter(chapter => ['ont-9-MTH1W-E1', 'ont-9-MTH1W-F1'].includes(chapter.id)).map(chapter => ({ ...chapter, sections: [{ title: 'Chapter topics', topics: chapter.topics.map(topic => ({ ...topic, chapterId: chapter.id })) }] }));
  const courses = [
    { grade: 8, chapters: grade8Chapters, className: 'grade8-algebra-board', catalogueId: 'grade8AlgebraChapters', sceneId: 'grade8AlgebraScene', name: 'algebra', headline: 'Algebra. On your chalkboard.' },
    { grade: 9, chapters: grade9Chapters, className: 'grade9-chapter-board', catalogueId: 'grade9ChalkboardChapters', sceneId: 'grade9ChalkboardScene', name: 'geometry and finance', headline: 'Geometry & finance. More room to learn.' },
  ];
  for (const course of courses) course.topics = course.chapters.flatMap(chapter => chapter.sections.flatMap(section => section.topics));
  let currentCourse = courses[0];
  let chapters = currentCourse.chapters;
  let topics = currentCourse.topics;
  let topicIds = new Set(topics.map(topic => topic.id));
  const board = document.querySelector('.board');
  let scene;
  let heading;
  let subtitle;
  let chapterPicker;
  let topicPicker;
  let previousTopic;
  let nextTopic;
  let teacherStatus;
  let chapterProgress;
  let currentTopicId;
  const element = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const button = (text, handler, className) => {
    const node = element('button', text, className);
    node.type = 'button';
    node.addEventListener('click', handler);
    return node;
  };

  function selectCourse(course) {
    if (course === currentCourse) return;
    clear();
    currentCourse = course;
    chapters = course.chapters;
    topics = course.topics;
    topicIds = new Set(topics.map(topic => topic.id));
  }

  const boardId = suffix => `grade${currentCourse.grade}Board${suffix}`;
  const grade9State = () => ({ stage: lesson.pending ? 'research' : phase === 6 ? 'summary' : phase >= 2 ? 'guided' : 'intro' });
  const currentState = () => currentCourse.grade === 8 ? OneToOneClass.state() : grade9State();
  const active = () => currentCourse.grade === 8 ? OneToOneClass.active() : lesson.grade === 9 && topicIds.has(lesson.id) && !agentEnabled;
  const resultFor = topic => currentCourse.grade === 8 ? Grade8Classes.latest(topic.id) : ontRecord(topic.id);
  const preparedTopic = topic => currentCourse.grade === 8 || GRADE9_SKILLS.some(skill => skill.code === topic.code);
  const statsFor = chapter => currentCourse.grade === 8 ? Grade8Classes.chapterStats(chapter) : { total: chapter.topics.length, done: chapter.topics.filter(topic => ontRecord(topic.id).completed).length };

  function saveCurrent() {
    if (OneToOneClass.active()) OneToOneClass.save();
    else if (activeLesson && !lesson.pending) saveProgress();
  }

  function setupGrade9() {
    if (!ontMatchesProfile() || $('country').value !== 'Canada') ontChooseOntario();
    $('grade').value = '9';
    ontCourseId = 'MTH1W';
  }

  function openTopic(id) {
    if (!topicIds.has(id)) return;
    saveCurrent();
    if (currentCourse.grade === 8) Grade8Classes.open(Grade8Classes.byId.get(id));
    else {
      setupGrade9();
      const chapter = grade9Course.chapters.find(candidate => candidate.topics.some(topic => topic.id === id));
      ontOpenTopic(grade9Course, chapter, chapter.topics.find(topic => topic.id === id));
      sync(lesson, currentState());
    }
  }

  function clear() {
    document.body.classList.remove('grade8-algebra-board', 'grade9-chapter-board', 'course-chalkboard');
    if (!scene) return;
    scene.before(board);
    scene.remove();
    board.querySelector('.g8-board-heading')?.remove();
    scene = null;
    currentTopicId = null;
  }

  function mount() {
    scene = element('section', undefined, 'g8-board-scene');
    scene.id = currentCourse.sceneId;
    scene.setAttribute('aria-label', `Grade ${currentCourse.grade} ${currentCourse.name} chalkboard classroom`);
    board.before(scene);
    scene.append(board);
    const titleArea = element('div', undefined, 'g8-board-heading');
    heading = element('h2');
    heading.id = boardId('Heading');
    subtitle = element('p');
    titleArea.append(heading, subtitle);
    board.prepend(titleArea);

    const teacher = element('aside', undefined, 'g8-teacher-guide');
    teacher.setAttribute('aria-label', 'Illustrated teaching guide');
    const portrait = element('img');
    portrait.src = 'board-teacher.png';
    portrait.alt = 'Illustrated teacher holding a book and pointing toward the chalkboard';
    portrait.width = 122;
    portrait.height = 236;
    teacherStatus = element('span', 'Ready to learn', 'g8-teacher-status');
    teacherStatus.id = boardId('TeacherStatus');
    teacherStatus.setAttribute('role', 'status');
    teacher.append(portrait, teacherStatus, element('small', 'Illustrated guide'));

    const strip = element('nav', undefined, 'g8-class-strip');
    strip.setAttribute('aria-label', `Grade ${currentCourse.grade} ${currentCourse.name} chapter and lesson navigation`);
    const chapterLabel = element('label', `Grade ${currentCourse.grade} chapter`);
    chapterPicker = element('select');
    chapterPicker.id = boardId('Chapter');
    for (const chapter of chapters) {
      const option = element('option', chapter.title);
      option.value = chapter.id;
      chapterPicker.append(option);
    }
    chapterPicker.addEventListener('change', () => {
      const chapter = chapters.find(candidate => candidate.id === chapterPicker.value);
      if (chapter) openTopic(chapter.sections[0].topics[0].id);
    });
    chapterLabel.append(chapterPicker);
    const topicLabel = element('label', 'Lesson');
    topicPicker = element('select');
    topicPicker.id = boardId('Topic');
    topicPicker.addEventListener('change', () => openTopic(topicPicker.value));
    topicLabel.append(topicPicker);
    chapterProgress = element('p', '', 'g8-chapter-progress');
    chapterProgress.id = boardId('Progress');
    previousTopic = button('← Previous lesson', () => {
      const position = topics.findIndex(topic => topic.id === currentTopicId);
      if (position > 0) openTopic(topics[position - 1].id);
    });
    previousTopic.id = boardId('Previous');
    nextTopic = button('Next lesson →', () => {
      const position = topics.findIndex(topic => topic.id === currentTopicId);
      if (position < topics.length - 1) openTopic(topics[position + 1].id);
    });
    nextTopic.id = boardId('Next');
    const actions = element('div', undefined, 'g8-strip-actions');
    actions.append(previousTopic, nextTopic, button('Both chapters', () => openChapters(currentCourse)));
    strip.append(chapterLabel, topicLabel, chapterProgress, actions);
    scene.append(teacher, strip);
  }

  function sync(prepared, state) {
    const course = courses.find(candidate => candidate.grade === prepared.grade && candidate.topics.some(topic => topic.id === prepared.id));
    if (!course) return clear();
    selectCourse(course);
    if (!active()) return clear();
    if (!scene) mount();
    if (!document.body.classList.contains(currentCourse.className)) document.body.classList.add(currentCourse.className, 'course-chalkboard');
    const chapter = chapters.find(candidate => candidate.sections.some(section => section.topics.some(topic => topic.id === prepared.id)));
    if (currentTopicId !== prepared.id) {
      currentTopicId = prepared.id;
      heading.textContent = chapter.title;
      subtitle.textContent = `Grade ${currentCourse.grade} · ${prepared.name}${prepared.pending ? ' · Research / AI connection needed' : ''}`;
      chapterPicker.value = chapter.id;
      topicPicker.replaceChildren();
      for (const section of chapter.sections) {
        const group = element('optgroup');
        group.label = section.title;
        for (const topic of section.topics) {
          const option = element('option', topic.title);
          option.value = topic.id;
          group.append(option);
        }
        topicPicker.append(group);
      }
      topicPicker.value = prepared.id;
    }
    const position = topics.findIndex(topic => topic.id === prepared.id);
    previousTopic.disabled = position === 0;
    nextTopic.disabled = position === topics.length - 1;
    const stats = statsFor(chapter);
    chapterProgress.textContent = `${stats.done} / ${stats.total} ${currentCourse.grade === 8 ? 'lessons assessed' : 'topics completed'} · ${currentCourse.grade === 8 ? 'Lesson' : 'Topic'} ${position + 1} of ${topics.length} across both chapters`;
    teacherStatus.textContent = prepared.pending ? 'AI teaching needed' : paused ? 'Paused' : speechBusy ? 'Explaining' : ['check', 'guided', 'exercise'].includes(state.stage) ? 'Your turn' : state.stage === 'summary' ? 'Class complete' : 'Ready to learn';
  }

  function openChapters(course = courses[0]) {
    saveCurrent();
    if (agentEnabled) endAgent(false);
    pauseAdvance(true);
    clear();
    selectCourse(course);
    if (course.grade === 8) {
      tutorStorage.setItem('ut-universal-grade', '8');
      ontUI.show('universal');
    } else {
      setupGrade9();
      ontUI.show('library');
    }
    const portal = ontUI.portal;
    portal.replaceChildren();
    const catalogue = element('section', undefined, 'g8-algebra-catalogue');
    catalogue.id = course.catalogueId;
    catalogue.append(element('p', `GRADE ${course.grade} · TWO ${course.grade === 8 ? 'COMPLETE COURSE' : 'ONTARIO'} CHAPTERS`, 'eyebrow'), element('h1', course.headline), element('p', 'A larger chalkboard, smaller writing, and your illustrated guide beside the board. Choose a topic, follow the worked steps, and practise at your pace.', 'g8-catalogue-intro'));
    const overview = element('div', undefined, 'g8-course-overview');
    if (course.grade === 8) overview.append(element('span', `${topics.length} lessons`), element('span', `${topics.length * 2} worked examples`), element('span', `${topics.length * 4} guided questions`), element('span', `${topics.length * 10} exercise questions`));
    else overview.append(element('span', `${topics.length} topics`), element('span', `${topics.filter(preparedTopic).length} prepared skill lessons`), element('span', '1 research / AI topic'), element('span', 'Chapter skill checks'));
    catalogue.append(overview);
    const list = element('div', undefined, 'g8-chapter-cards');
    for (const [position, chapter] of chapters.entries()) {
      const card = element('article', undefined, 'g8-chapter-card');
      card.dataset.chapter = chapter.id;
      const chapterTopics = chapter.sections.flatMap(section => section.topics);
      const stats = statsFor(chapter);
      card.append(element('p', `CHAPTER ${position + 1} OF 2 · ${chapterTopics.length} ${course.grade === 8 ? 'LESSONS' : 'TOPICS'}`, 'eyebrow'), element('h2', chapter.title), element('p', `${stats.done} / ${stats.total} ${course.grade === 8 ? 'lessons assessed' : 'topics completed'}`, 'g8-chapter-progress'));
      for (const section of chapter.sections) {
        card.append(element('h3', section.title));
        const lessonList = element('ul');
        for (const topic of section.topics) {
          const row = element('li');
          const result = resultFor(topic);
          const action = button(topic.title, () => openTopic(topic.id), 'g8-topic-link');
          action.dataset.topic = topic.id;
          const status = course.grade === 8 ? result ? `${result.correct}/10 · ${result.percent}%` : 'Not assessed' : !preparedTopic(topic) ? 'Research / reflection · AI connection needed' : result.completed ? 'Completed' : 'Prepared skill lesson';
          row.append(action, element('span', status, 'g8-topic-result'));
          lessonList.append(row);
        }
        card.append(lessonList);
      }
      const first = chapterTopics.find(topic => preparedTopic(topic) && (course.grade === 8 ? !resultFor(topic) : !resultFor(topic).completed)) || chapterTopics.find(preparedTopic) || chapterTopics[0];
      const start = button(stats.done ? 'Continue chapter →' : 'Start chapter →', () => openTopic(first.id), 'primary g8-start-chapter');
      start.dataset.startChapter = chapter.id;
      card.append(start);
      if (course.grade === 9) card.append(button('Chapter skill check', () => {
        saveCurrent();
        pauseAdvance(true);
        clear();
        setupGrade9();
        ontUI.show('library');
        grade9SkillExam(grade9Course, grade9Course.chapters.find(candidate => candidate.id === chapter.id));
      }, 'g8-chapter-check'));
      list.append(card);
    }
    catalogue.append(list, element('p', course.grade === 8 ? 'Two examples → understanding check → four guided questions → a ten-question exercise for every lesson. Results and checkpoints use your existing saved-learning service. A completed exercise is an attempt, not a guarantee of mastery.' : 'Nine prepared skill lessons include worked steps, guided practice, applications and three-question checks. Geometry and measurement across cultures is a research / reflection topic that needs the connected AI teacher for full teaching. No AI request starts automatically.', 'g8-catalogue-note'), element('p', course.grade === 8 ? 'These are complete chapters from the existing international Grade 8 course, not a claim of covering every national textbook. Voice uses your browser; the teacher illustration is not a talking avatar.' : 'All ten entries from these two Ontario Grade 9 chapters are included. Prepared lessons are skill introductions, not exhaustive curriculum coverage. Saved progress uses your existing classroom service. Financial examples are maths exercises, not personal financial advice.', 'g8-catalogue-note'), button(`Browse all Grade ${course.grade} chapters`, () => ontUI.show(course.grade === 8 ? 'universal' : 'library')));
    portal.append(catalogue);
  }

  window.Grade8AlgebraBoard = Object.freeze({ sync, clear, openChapters: () => openChapters(courses[0]), topics: courses[0].topics });
  window.Grade9Chalkboard = Object.freeze({ openChapters: () => openChapters(courses[1]), openTopic: id => { selectCourse(courses[1]); openTopic(id); }, topics: courses[1].topics });
  const navigation = button('Grade 8 algebra · Chalkboard', () => openChapters(courses[0]));
  navigation.id = 'grade8AlgebraNav';
  document.querySelector('.app-nav').append(navigation);
  const grade9Navigation = button('Grade 9 geometry & finance · Chalkboard', () => openChapters(courses[1]));
  grade9Navigation.id = 'grade9ChalkboardNav';
  document.querySelector('.app-nav').append(grade9Navigation);
  const previousRender = render;
  render = function (...args) {
    const result = previousRender(...args);
    if (lesson.grade === 9) sync(lesson, grade9State());
    return result;
  };
  const presence = document.querySelector('.teacher-presence');
  new MutationObserver(() => {
    if (!scene) return;
    if (!active() || !document.body.classList.contains('in-classroom')) return clear();
    const state = currentState();
    sync(lesson, state);
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  if (presence) new MutationObserver(() => {
    if (!scene) return;
    if (!active()) return clear();
    sync(lesson, currentState());
  }).observe(presence, { attributes: true, attributeFilter: ['data-state'] });
  if (new URLSearchParams(location.search).get('grade8-algebra') === '1') openChapters(courses[0]);
  if (new URLSearchParams(location.search).get('grade9-chalkboard') === '1') openChapters(courses[1]);
})();
