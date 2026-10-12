(() => {
  const board = document.getElementById('boardContents');
  const explanation = document.getElementById('explanation');
  const teacherStatus = document.getElementById('teacherStatus');
  const voiceStatus = document.getElementById('voiceStatus');
  const previous = document.getElementById('previousStep');
  const next = document.getElementById('nextStep');
  const listen = document.getElementById('listenStep');
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const voiceAvailable = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const steps = [
    {
      lines: ['Measurement and Geometry strand', 'Grade 9'],
      explanation: 'Today we’ll find the missing side of a right triangle. Start with the idea, follow an example, then try one yourself.',
    },
    {
      lines: ['A right triangle has a 90° angle.', 'The longest side is the hypotenuse.', 'a² + b² = c²'],
      equation: 2,
      diagram: ['a', 'b', 'c'],
      explanation: 'The little square marks the right angle. The side opposite it, c, is the hypotenuse. Pythagoras says: a squared plus b squared equals c squared. This rule only works for right triangles.',
    },
    {
      lines: ['Let’s find the missing side.', 'a = 3 cm     b = 4 cm', 'c = ?'],
      equation: 2,
      diagram: ['3 cm', '4 cm', 'c = ?'],
      explanation: 'Our right triangle has shorter sides of three centimetres and four centimetres. We want the length of the hypotenuse, c. First, square the two known lengths.',
    },
    {
      lines: ['c² = 3² + 4²', 'c² = 9 + 16', 'c² = 25'],
      equation: 2,
      explanation: 'Three squared is nine. Four squared is sixteen. Add them: nine plus sixteen is twenty-five. We have found c squared, not c yet.',
    },
    {
      lines: ['c = √25', 'c = 5 cm', 'Check: 3² + 4² = 5²'],
      equation: 1,
      diagram: ['3 cm', '4 cm', '5 cm'],
      explanation: 'Take the positive square root of twenty-five. The missing length is five centimetres. Check: nine plus sixteen equals twenty-five, and five is longer than either shorter side.',
    },
    {
      lines: ['Your turn.', 'Shorter sides: 5 cm and 12 cm', 'Find the hypotenuse.'],
      practice: true,
      explanation: 'Try a new right triangle with shorter sides of five and twelve centimetres. Square both lengths, add them, then take the positive square root. Enter the missing length in centimetres.',
    },
  ];
  let currentStep = 0;
  let arrivalTimer;
  let currentUtterance;

  function stopVoice() {
    const wasSpeaking = Boolean(currentUtterance);
    currentUtterance = null;
    if (voiceAvailable && wasSpeaking) window.speechSynthesis.cancel();
    listen.textContent = 'Listen to explanation';
    listen.setAttribute('aria-pressed', 'false');
    if (wasSpeaking) {
      teacherStatus.textContent = 'Ready to explain';
      voiceStatus.textContent = 'Explanation stopped. Read the board or listen again.';
    }
  }

  function triangle(labels) {
    const host = document.createElement('div');
    host.innerHTML = '<svg class="chalk-triangle" viewBox="0 0 270 210" role="img"><title></title><path d="M60 30 V170 H230"/><path class="hypotenuse" d="M60 30 230 170"/><polyline points="60,151 79,151 79,170"/><text x="17" y="108"></text><text x="127" y="200"></text><text x="153" y="85" fill="#e5d597"></text></svg>';
    const diagram = host.firstElementChild;
    diagram.querySelector('title').textContent = `Right triangle with shorter sides ${labels[0]} and ${labels[1]}, and hypotenuse ${labels[2]}.`;
    diagram.querySelectorAll('text').forEach((label, index) => { label.textContent = labels[index]; });
    return diagram;
  }

  function practice() {
    const form = document.createElement('form');
    form.className = 'practice-form';
    form.noValidate = true;
    const label = document.createElement('label');
    label.htmlFor = 'practiceAnswer';
    label.textContent = 'Hypotenuse length (cm)';
    const entry = document.createElement('div');
    entry.className = 'practice-entry';
    const answer = document.createElement('input');
    answer.id = 'practiceAnswer';
    answer.type = 'text';
    answer.inputMode = 'decimal';
    answer.autocomplete = 'off';
    answer.setAttribute('aria-describedby', 'practiceFeedback');
    const check = document.createElement('button');
    check.type = 'submit';
    check.textContent = 'Check answer';
    const feedback = document.createElement('p');
    feedback.id = 'practiceFeedback';
    feedback.className = 'practice-feedback';
    feedback.setAttribute('role', 'status');
    entry.append(answer, check);
    form.append(label, entry, feedback);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const value = answer.value.trim();
      const numeric = /^\d+(?:\.\d+)?$/.test(value) ? Number(value) : NaN;
      const valid = Number.isFinite(numeric) && numeric > 0;
      answer.setAttribute('aria-invalid', String(!valid));
      if (!valid) {
        feedback.textContent = 'Enter a positive number, such as 10. Use centimetres without typing the unit.';
        answer.focus();
      } else if (numeric === 13) {
        feedback.textContent = 'Correct! 5² + 12² = 25 + 144 = 169. √169 = 13 cm.';
        teacherStatus.textContent = 'Nicely worked out';
      } else {
        feedback.textContent = 'Not quite. Start with 5² + 12² = 169. Which positive number multiplied by itself makes 169?';
        teacherStatus.textContent = 'Try another step';
      }
    });
    return form;
  }

  function render() {
    stopVoice();
    window.clearTimeout(arrivalTimer);
    const step = steps[currentStep];
    board.replaceChildren();
    board.className = `board-contents${step.diagram ? ' has-diagram' : ''}`;
    const writing = document.createElement('div');
    writing.className = 'chalk-writing';
    step.lines.forEach((text, index) => {
      const line = document.createElement('p');
      line.className = `chalk-line${index === step.equation ? ' equation emphasis' : ''}`;
      line.style.setProperty('--chalk-delay', `${index * 170}ms`);
      line.textContent = text;
      writing.append(line);
    });
    if (step.practice) writing.append(practice());
    board.append(writing);
    if (step.diagram) board.append(triangle(step.diagram));
    explanation.textContent = step.explanation;
    document.getElementById('stepCounter').textContent = `${currentStep + 1} / ${steps.length}`;
    document.getElementById('boardFootnote').textContent = currentStep === 0 ? 'Today: right triangles and Pythagoras' : 'For right triangles only · a and b are the shorter sides';
    previous.disabled = currentStep === 0;
    next.disabled = currentStep === steps.length - 1;
    next.textContent = currentStep === steps.length - 2 ? 'Your turn →' : currentStep === steps.length - 1 ? 'Last step' : 'Next step →';
    if (reducedMotion || step.practice) {
      teacherStatus.textContent = step.practice ? 'Your turn to try' : 'Ready to explain';
    } else {
      void board.offsetWidth;
      board.classList.add('is-arriving');
      teacherStatus.textContent = 'Writing on the board';
      arrivalTimer = window.setTimeout(() => {
        board.classList.remove('is-arriving');
        if (!currentUtterance) teacherStatus.textContent = 'Ready to explain';
      }, 1000);
    }
  }

  previous.addEventListener('click', () => { if (currentStep > 0) { currentStep--; render(); } });
  next.addEventListener('click', () => { if (currentStep < steps.length - 1) { currentStep++; render(); } });
  document.getElementById('restartClass').addEventListener('click', () => { currentStep = 0; render(); });
  listen.addEventListener('click', () => {
    if (currentUtterance) { stopVoice(); return; }
    if (!voiceAvailable) {
      voiceStatus.textContent = 'This browser does not offer spoken explanations. You can read every explanation below the board.';
      return;
    }
    const utterance = new window.SpeechSynthesisUtterance(steps[currentStep].explanation);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    currentUtterance = utterance;
    listen.textContent = 'Stop explanation';
    listen.setAttribute('aria-pressed', 'true');
    teacherStatus.textContent = 'Preparing explanation';
    voiceStatus.textContent = 'Starting the browser voice…';
    utterance.onstart = () => {
      if (currentUtterance !== utterance) return;
      teacherStatus.textContent = 'Explaining this step';
      voiceStatus.textContent = 'Reading this explanation aloud. You can stop it at any time.';
    };
    const finish = failed => {
      if (currentUtterance !== utterance) return;
      currentUtterance = null;
      listen.textContent = 'Listen to explanation';
      listen.setAttribute('aria-pressed', 'false');
      teacherStatus.textContent = steps[currentStep].practice ? 'Your turn to try' : 'Ready to explain';
      voiceStatus.textContent = failed ? 'The browser voice could not play. Read the explanation or try listening again.' : 'Explanation finished. Move to the next step when you’re ready.';
    };
    utterance.onend = () => finish(false);
    utterance.onerror = () => finish(true);
    try { window.speechSynthesis.speak(utterance); } catch { finish(true); }
  });
  window.addEventListener('pagehide', () => { stopVoice(); window.clearTimeout(arrivalTimer); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopVoice(); });
  render();
})();
