(function () {
  const host = document.createElement('section'); host.id = 'visualTeaching'; host.hidden = true; host.setAttribute('aria-label', 'Animated and interactive maths teaching'); $('visual').after(host);
  const tools = document.createElement('div'); tools.className = 'mvt-actions';
  const explore = document.createElement('button'); explore.id = 'exploreVisualModel'; explore.type = 'button'; explore.textContent = 'Try the model'; explore.setAttribute('aria-pressed', 'false');
  const resume = document.createElement('button'); resume.id = 'returnFromVisualModel'; resume.type = 'button'; resume.textContent = 'Return to voice lesson'; resume.hidden = true;
  const description = document.createElement('p'); description.className = 'mvt-notation-note'; description.textContent = 'Related concept model, not your current question’s answer. Exploration does not change scores. Use the keyboard or touch controls.';
  const slot = document.createElement('div');
  let model = null, signature = '', exploring = false;
  const finite = (value, minimum, maximum) => { const parsed = value == null ? NaN : typeof value === 'string' ? Number.parseFloat(value.match(/-?\d+(?:\.\d+)?/)?.[0]) : Number(value); return Number.isFinite(parsed) && parsed >= minimum && parsed <= maximum ? parsed : undefined; };
  function teachingStep(lesson, state) {
    if (state.stage === 'examples') { let position = state.cursor; for (const example of lesson.workedExamples) { if (position < example.steps.length) return Math.min(2, position); position -= example.steps.length; } }
    return Math.min(2, state.cursor);
  }
  function select(lesson, picture) {
    const name = (lesson.name + ' ' + lesson.id).toLowerCase();
    if (picture?.kind === 'triangle_area') return { kind: 'area', values: { base: finite(picture.base, 1, 12), height: finite(picture.height, 1, 10) } };
    if (/scientific|standard form|decimal_powers_ten/.test(name)) return { kind: 'scientific' };
    if (/pythagor|hypotenuse|g8-distance/.test(name)) { const labels = picture?.specs?.find(spec => spec.shape === 'triangle')?.labels; return { kind: 'pythagoras', values: { first: finite(labels?.base, 1, 12), second: finite(labels?.height, 1, 12) } }; }
    if (picture?.kind === 'balance' && /equation/.test(name)) {
      const match = /^([1-6])x\s*\+\s*(\d+)$/.exec(picture.left || ''), total = Number(picture.right);
      if (match && Number.isFinite(total)) { const solution = (total - Number(match[2])) / Number(match[1]); if (Number.isInteger(solution)) return { kind: 'equation', values: { coefficient: Number(match[1]), constant: finite(match[2], 0, 12), solution: finite(solution, -6, 6) } }; }
    }
    for (const spec of picture?.specs || []) {
      const labels = spec.labels || {};
      if (spec.shape === 'graph') return { kind: 'graph', values: { slope: finite(labels.slope, -5, 5), intercept: finite(labels.intercept, -8, 8), input: finite(labels.point, -5, 5) } };
      if (spec.shape === 'number_line') return { kind: 'number_line', values: { start: finite(labels.point, -10, 10), jump: finite(labels.jump, -10, 10) } };
      if (spec.shape === 'fraction') return { kind: 'fraction', values: { numerator: finite(labels.numerator, 0, 12), denominator: finite(labels.denominator, 2, 12) } };
      if (spec.shape === 'circle') return { kind: 'circle', values: { radius: finite(labels.radius, 1, 10) } };
      if (spec.shape === 'angle') return { kind: 'angle', values: { angle: finite(labels.angle, 10, 170) } };
      if (['triangle', 'rectangle', 'square'].includes(spec.shape) && /area/.test(name)) return { kind: 'area', values: { base: finite(labels.base || labels.width, 1, 12), height: finite(labels.height, 1, 10) } };
    }
    if (/fraction|reciprocal|probability|g8-independent|rational-add|rational-multiply/.test(name)) return { kind: 'fraction' };
    if (/linear function|slope|intercept|g8-function|graph.*linear/.test(name)) return { kind: 'graph' };
    if (/equation|equation_balance|equation_two_step/.test(name) && !/simultaneous|no solution|solution types/.test(name)) return { kind: 'equation' };
    if (/circle area|circumference|radius|circle-area/.test(name)) return { kind: 'circle' };
    if (/triangle area|area.*triangle|triangle_area|rectangle area|rectangle_area/.test(name)) return { kind: 'area' };
    if (/straight line|linear_pairs|cointerior|angles on|angles around|angle bisector/.test(name)) return { kind: 'angle' };
    if (/mean|median|data range|g8-mean|mean_equal_share|data_range|outlier/.test(name)) return { kind: 'data' };
    if (/integer|decimal_number_line|decimal number line|directed motion|signed/.test(name)) return { kind: 'number_line' };
    return null;
  }
  function hide() { model?.destroy(); model = null; signature = ''; exploring = false; host.hidden = true; }
  function show(lesson, state, picture) {
    if (![7, 8].includes(lesson.grade) || !OneToOneClass.active() || ['exerciseReady', 'exercise', 'summary'].includes(state.stage) || agentEnabled) return hide();
    const config = select(lesson, picture);
    if (!config) return hide();
    const nextSignature = lesson.id + ':' + state.stage + ':' + JSON.stringify(config);
    if (signature !== nextSignature) {
      model?.destroy(); exploring = false; signature = nextSignature; slot.replaceChildren();
      model = MathsVisualTeaching.mount(slot, config); model.setInteractive(false);
      host.replaceChildren(slot); tools.replaceChildren(explore, resume); model.panel.append(tools, description);
      explore.setAttribute('aria-pressed', 'false'); resume.hidden = true;
    }
    model.setTeachingStep(teachingStep(lesson, state)); host.hidden = false;
    for (const label of $('visual').querySelectorAll('text')) label.textContent = MathsNotation.display(label.textContent);
  }
  explore.onclick = () => {
    if (!model || !OneToOneClass.active()) return;
    OneToOneClass.interrupt(); pauseAdvance(true); exploring = true; model.setInteractive(true); model.setTeachingStep(2); explore.setAttribute('aria-pressed', 'true'); resume.hidden = false;
    $('turnStatus').textContent = 'Visual exploration · Your lesson is paused at the same step. Change the model, then return to the voice lesson.';
  };
  resume.onclick = () => {
    if (!exploring || !OneToOneClass.active()) return hide();
    exploring = false; model.setInteractive(false); explore.setAttribute('aria-pressed', 'false'); resume.hidden = true;
    paused = false; manualPause = false;
    if (['intro', 'examples', 'repair'].includes(OneToOneClass.state().stage)) OneToOneClass.resume(); else OneToOneClass.schedule();
  };
  const previousStep = step;
  step = function(text, note = '', animate = true) { return previousStep(MathsNotation.display(text), note, animate); };
  const previousWrite = writeBoard;
  writeBoard = function(node, text) { return previousWrite(node, MathsNotation.display(text)); };
  function sync(lesson, state) { if (![7, 8].includes(lesson.grade) || agentEnabled || ['exerciseReady', 'exercise', 'summary'].includes(state.stage)) hide(); else model?.setTeachingStep(exploring ? 2 : teachingStep(lesson, state)); }
  window.VisualClassroom = Object.freeze({ show, hide, sync });
  const navigation = document.createElement('button'); navigation.id = 'visualLabNav'; navigation.textContent = 'Visual maths lab'; navigation.onclick = () => window.open('visual-teaching-demo.html', '_blank', 'noopener'); document.querySelector('.app-nav').append(navigation);
})();
