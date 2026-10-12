(() => {
  const chapters = Grade8Classes.course.chapters.filter(chapter => ['g8-ch-6', 'g8-ch-7'].includes(chapter.id));
  const topics = chapters.flatMap(chapter => chapter.sections.flatMap(section => section.topics));
  const topicIds = new Set(topics.map(topic => topic.id));
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

  function openTopic(id) {
    if (!topicIds.has(id)) return;
    if (OneToOneClass.active()) OneToOneClass.save();
    Grade8Classes.open(Grade8Classes.byId.get(id));
  }

  function clear() {
    document.body.classList.remove('grade8-algebra-board');
    if (!scene) return;
    scene.before(board);
    scene.remove();
    board.querySelector('.g8-board-heading')?.remove();
    scene = null;
    currentTopicId = null;
  }

  function mount() {
    scene = element('section', undefined, 'g8-board-scene');
    scene.id = 'grade8AlgebraScene';
    scene.setAttribute('aria-label', 'Grade 8 algebra chalkboard classroom');
    board.before(scene);
    scene.append(board);
    const titleArea = element('div', undefined, 'g8-board-heading');
    heading = element('h2');
    heading.id = 'grade8BoardHeading';
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
    teacherStatus.id = 'grade8BoardTeacherStatus';
    teacherStatus.setAttribute('role', 'status');
    teacher.append(portrait, teacherStatus, element('small', 'Illustrated guide'));

    const strip = element('nav', undefined, 'g8-class-strip');
    strip.setAttribute('aria-label', 'Grade 8 algebra chapter and lesson navigation');
    const chapterLabel = element('label', 'Grade 8 chapter');
    chapterPicker = element('select');
    chapterPicker.id = 'grade8BoardChapter';
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
    topicPicker.id = 'grade8BoardTopic';
    topicPicker.addEventListener('change', () => openTopic(topicPicker.value));
    topicLabel.append(topicPicker);
    chapterProgress = element('p', '', 'g8-chapter-progress');
    chapterProgress.id = 'grade8BoardProgress';
    previousTopic = button('← Previous lesson', () => {
      const position = topics.findIndex(topic => topic.id === currentTopicId);
      if (position > 0) openTopic(topics[position - 1].id);
    });
    previousTopic.id = 'grade8BoardPrevious';
    nextTopic = button('Next lesson →', () => {
      const position = topics.findIndex(topic => topic.id === currentTopicId);
      if (position < topics.length - 1) openTopic(topics[position + 1].id);
    });
    nextTopic.id = 'grade8BoardNext';
    const actions = element('div', undefined, 'g8-strip-actions');
    actions.append(previousTopic, nextTopic, button('Both chapters', openChapters));
    strip.append(chapterLabel, topicLabel, chapterProgress, actions);
    scene.append(teacher, strip);
  }

  function sync(prepared, state) {
    if (prepared.grade !== 8 || !topicIds.has(prepared.id) || !OneToOneClass.active()) return clear();
    if (!scene) mount();
    if (!document.body.classList.contains('grade8-algebra-board')) document.body.classList.add('grade8-algebra-board');
    const chapter = chapters.find(candidate => candidate.id === prepared.chapterId);
    if (currentTopicId !== prepared.id) {
      currentTopicId = prepared.id;
      heading.textContent = chapter.title;
      subtitle.textContent = 'Grade 8 · ' + prepared.name;
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
    const stats = Grade8Classes.chapterStats(chapter);
    chapterProgress.textContent = `${stats.done} / ${stats.total} lessons assessed · Lesson ${position + 1} of ${topics.length} across both chapters`;
    teacherStatus.textContent = paused ? 'Paused' : speechBusy ? 'Explaining' : ['check', 'guided', 'exercise'].includes(state.stage) ? 'Your turn' : state.stage === 'summary' ? 'Class complete' : 'Ready to learn';
  }

  function openChapters() {
    if (OneToOneClass.active()) OneToOneClass.save();
    if (agentEnabled) endAgent(false);
    pauseAdvance(true);
    clear();
    tutorStorage.setItem('ut-universal-grade', '8');
    ontUI.show('universal');
    const portal = ontUI.portal;
    portal.replaceChildren();
    const catalogue = element('section', undefined, 'g8-algebra-catalogue');
    catalogue.id = 'grade8AlgebraChapters';
    catalogue.append(element('p', 'GRADE 8 · TWO COMPLETE COURSE CHAPTERS', 'eyebrow'), element('h1', 'Algebra. On your chalkboard.'), element('p', 'Every lesson from these two chapters, with your illustrated guide beside the board. Learn the idea, follow two examples, then practise at your pace.', 'g8-catalogue-intro'));
    const overview = element('div', undefined, 'g8-course-overview');
    overview.append(element('span', `${topics.length} lessons`), element('span', `${topics.length * 2} worked examples`), element('span', `${topics.length * 4} guided questions`), element('span', `${topics.length * 10} exercise questions`));
    catalogue.append(overview);
    const list = element('div', undefined, 'g8-chapter-cards');
    for (const [position, chapter] of chapters.entries()) {
      const card = element('article', undefined, 'g8-chapter-card');
      card.dataset.chapter = chapter.id;
      const chapterTopics = chapter.sections.flatMap(section => section.topics);
      const stats = Grade8Classes.chapterStats(chapter);
      card.append(element('p', `CHAPTER ${position + 1} OF 2 · ${chapterTopics.length} LESSONS`, 'eyebrow'), element('h2', chapter.title), element('p', `${stats.done} / ${stats.total} lessons assessed`, 'g8-chapter-progress'));
      for (const section of chapter.sections) {
        card.append(element('h3', section.title));
        const lessonList = element('ul');
        for (const topic of section.topics) {
          const row = element('li');
          const result = Grade8Classes.latest(topic.id);
          const action = button(topic.title, () => openTopic(topic.id), 'g8-topic-link');
          action.dataset.topic = topic.id;
          row.append(action, element('span', result ? `${result.correct}/10 · ${result.percent}%` : 'Not assessed', 'g8-topic-result'));
          lessonList.append(row);
        }
        card.append(lessonList);
      }
      const first = chapterTopics.find(topic => !Grade8Classes.latest(topic.id)) || chapterTopics[0];
      const start = button(stats.done ? 'Continue chapter →' : 'Start chapter →', () => openTopic(first.id), 'primary g8-start-chapter');
      start.dataset.startChapter = chapter.id;
      card.append(start);
      list.append(card);
    }
    catalogue.append(list, element('p', 'Two examples → understanding check → four guided questions → a ten-question exercise for every lesson. Results and checkpoints use your existing saved-learning service. A completed exercise is an attempt, not a guarantee of mastery.', 'g8-catalogue-note'), element('p', 'These are complete chapters from the existing international Grade 8 course, not a claim of covering every national textbook. Voice uses your browser; the teacher illustration is not a talking avatar.', 'g8-catalogue-note'), button('Browse all Grade 8 chapters', () => ontUI.show('universal')));
    portal.append(catalogue);
  }

  window.Grade8AlgebraBoard = Object.freeze({ sync, clear, openChapters, topics });
  const navigation = button('Grade 8 algebra · Chalkboard', openChapters);
  navigation.id = 'grade8AlgebraNav';
  document.querySelector('.app-nav').append(navigation);
  const presence = document.querySelector('.teacher-presence');
  new MutationObserver(() => {
    if (!scene) return;
    if (!OneToOneClass.active() || !document.body.classList.contains('in-classroom')) return clear();
    const state = OneToOneClass.state();
    sync(lesson, state);
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  if (presence) new MutationObserver(() => {
    if (!scene) return;
    if (!OneToOneClass.active()) return clear();
    sync(lesson, OneToOneClass.state());
  }).observe(presence, { attributes: true, attributeFilter: ['data-state'] });
  if (new URLSearchParams(location.search).get('grade8-algebra') === '1') openChapters();
})();
