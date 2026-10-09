(function (root) {
  const definitions = {
    fraction: { title: 'See the equal parts', hint: 'Change the whole’s equal parts and the number shaded. The denominator counts all parts; the numerator counts shaded parts.', fields: [['denominator', 'Equal parts', 2, 12, 1, 4], ['numerator', 'Shaded parts', 0, 12, 1, 3]] },
    number_line: { title: 'Follow a signed move', hint: 'A positive move travels right; a negative move travels left. Change the starting point or the move.', fields: [['start', 'Start', -10, 10, .25, -2], ['jump', 'Move', -10, 10, .25, 5]] },
    graph: { title: 'Make the line change', hint: 'The slope changes how steep the line is. The intercept moves its crossing of the y-axis. Change x to move the highlighted point.', fields: [['slope', 'Slope m', -5, 5, .5, 2], ['intercept', 'Intercept b', -8, 8, 1, 3], ['input', 'Input x', -5, 5, .5, 1]] },
    equation: { title: 'Keep both sides equal', hint: 'The two sides stay equal. Subtract the same constant from both sides, then divide both sides by the same nonzero coefficient.', fields: [['coefficient', 'Coefficient', 1, 6, 1, 3], ['constant', 'Added constant', 0, 12, 1, 6], ['solution', 'Model value of x', -6, 6, 1, 4]] },
    area: { title: 'Build area from a rectangle', hint: 'Compare a triangle with a rectangle of the same base and perpendicular height. The triangle occupies half the rectangle.', fields: [['base', 'Base (cm)', 1, 12, 1, 6], ['height', 'Perpendicular height (cm)', 1, 10, 1, 4]] },
    circle: { title: 'Radius changes two measurements', hint: 'Circumference grows with the radius. Area grows with the square of the radius. These decimals use π and are approximate. Your exercise may specify a different approximation for π.', fields: [['radius', 'Radius (cm)', 1, 10, .5, 3]] },
    angle: { title: 'Turn a ray and compare angles', hint: 'The two adjacent angles complete a straight angle of 180 degrees. Change one and watch the other change.', fields: [['angle', 'First angle (degrees)', 10, 170, 5, 60]] },
    pythagoras: { title: 'Connect lengths to squares', hint: 'Only a right triangle satisfies this relationship. The square on the hypotenuse has the combined area of the squares on the two legs.', fields: [['first', 'First leg (cm)', 1, 12, 1, 3], ['second', 'Second leg (cm)', 1, 12, 1, 4]] },
    scientific: { title: 'Move through powers of ten', hint: 'Scientific notation is a × 10ⁿ, where 1 ≤ |a| < 10 for nonzero numbers. Positive exponents move the decimal right; negative exponents move it left.', fields: [['coefficient', 'Coefficient a', 1, 9.9, .1, 4.2], ['exponent', 'Exponent n', -6, 6, 1, -3]] },
    data: { title: 'Compare a small data set', hint: 'Change any of the three observations. The mean describes their centre; the range describes their spread.', fields: [['first', 'Observation A', 0, 20, 1, 4], ['second', 'Observation B', 0, 20, 1, 7], ['third', 'Observation C', 0, 20, 1, 10]] }
  };
  const number = value => String(Number(value.toPrecision(12)));
  const format = value => root.MathsNotation ? root.MathsNotation.display(value) : String(value);
  let serial = 0;
  function mount(host, options = {}) {
    if (!host || !host.ownerDocument || !Object.hasOwn(definitions, options.kind)) throw new TypeError('Choose a supported visual model and a DOM host.');
    const definition = definitions[options.kind], document = host.ownerDocument, values = {}, controls = new Map();
    const instanceId = ++serial;
    let teachingStep = 0, destroyed = false;
    function element(tag, text, className) { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; }
    const panel = element('section', undefined, 'mvt-lab'); panel.dataset.model = options.kind;
    panel.setAttribute('aria-label', definition.title);
    const eyebrow = element('span', 'WATCH · CHANGE · UNDERSTAND', 'mvt-eyebrow'), title = element('h3', definition.title), hint = element('p', definition.hint);
    const picture = element('div'), equation = element('p', undefined, 'mvt-equation'), status = element('p', undefined, 'mvt-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    const actions = element('div', undefined, 'mvt-actions'), replay = element('button', 'Replay drawing'), reset = element('button', 'Reset model'); replay.type = reset.type = 'button'; actions.append(replay, reset);
    const inputs = element('div', undefined, 'mvt-controls');
    for (const [key, labelText, minimum, maximum, step, initial] of definition.fields) {
      const requested = options.values?.[key];
      values[key] = Number.isFinite(requested) ? Math.max(minimum, Math.min(maximum, Math.round((requested - minimum) / step) * step + minimum)) : initial;
      const label = element('label', labelText), output = element('output'), input = element('input'); input.type = 'range'; input.min = minimum; input.max = maximum; input.step = step; input.value = values[key]; input.id = 'mvt-' + instanceId + '-' + key; output.htmlFor = input.id;
      input.setAttribute('aria-label', labelText); input.dataset.parameter = key; label.append(output, input); inputs.append(label); controls.set(key, { input, output });
      input.addEventListener('input', () => { if (destroyed) return; values[key] = Number(input.value); if (options.kind === 'fraction' && key === 'denominator') values.numerator = Math.min(values.numerator, values.denominator); render(); options.onChange?.({ kind: options.kind, values: { ...values } }); });
    }
    if (options.kind === 'fraction') values.numerator = Math.min(values.numerator, values.denominator);
    const initialValues = { ...values }; panel.append(eyebrow, title, hint, picture, equation, status, actions, inputs); host.append(panel);
    function render() {
      if (destroyed) return;
      for (const [key, control] of controls) { if (options.kind === 'fraction' && key === 'numerator') control.input.max = values.denominator; control.input.value = values[key]; control.output.value = number(values[key]); }
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 480 285'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', definition.title); svg.classList.add('mvt-drawing');
      let sequence = 0;
      function add(tag, attributes, text, part = 0) {
        const node = document.createElementNS(svg.namespaceURI, tag);
        for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
        if (text !== undefined) node.textContent = format(text);
        if (tag === 'path' && !String(attributes.class || '').includes('mvt-grid')) { node.setAttribute('pathLength', '1'); node.style.setProperty('--mvt-delay', Math.min(sequence++ * .07, .5) + 's'); }
        node.dataset.teachingPart = part; svg.append(node); return node;
      }
      const label = (horizontal, vertical, text, part = 0) => add('text', { x: horizontal, y: vertical, 'text-anchor': 'middle' }, text, part);
      const path = (data, highlight = false, part = 0) => add('path', { d: data, class: 'mvt-line' + (highlight ? ' mvt-highlight' : '') }, undefined, part);
      const region = (horizontal, vertical, width, height, part = 1) => add('rect', { x: horizontal, y: vertical, width, height, class: 'mvt-region' }, undefined, part);
      const point = (horizontal, vertical, part = 1) => add('circle', { cx: horizontal, cy: vertical, r: 5, class: 'mvt-point' }, undefined, part);
      let equationText = '', statusText = '';
      if (options.kind === 'fraction') {
        const denominator = values.denominator, numerator = values.numerator, width = 360 / denominator;
        for (let index = 0; index < denominator; index++) add('rect', { x: 60 + index * width, y: 95, width: width - 3, height: 95, class: 'mvt-cell' + (index < numerator ? ' is-filled' : '') }, undefined, index < numerator ? 1 : 0);
        label(240, 65, denominator + ' equal parts'); label(240, 228, numerator + ' shaded parts', 1);
        equationText = `${numerator}/${denominator} = ${number(numerator / denominator)}`;
        if (!Number.isInteger(numerator / denominator * 1000000000000)) equationText = `${numerator}/${denominator} ≈ ${number(numerator / denominator)}`;
        statusText = `The whole remains one whole. ${numerator} out of ${denominator} equal parts are shaded.`;
      }
      if (options.kind === 'number_line') {
        const horizontal = value => 50 + (value + 20) * 9.5, end = values.start + values.jump;
        path('M40 170 H440'); for (let tick = -20; tick <= 20; tick += 5) { path(`M${horizontal(tick)} 164 V176`); label(horizontal(tick), 200, tick); }
        point(horizontal(values.start), 170, 0); point(horizontal(end), 170, 2);
        path(`M${horizontal(values.start)} 150 Q${(horizontal(values.start) + horizontal(end)) / 2} 35 ${horizontal(end)} 150`, true, 1);
        label(horizontal(values.start), 237, 'Start: ' + number(values.start)); label(horizontal(end), 65, 'End: ' + number(end), 2);
        equationText = `${number(values.start)} + (${number(values.jump)}) = ${number(end)}`; statusText = `Move ${Math.abs(values.jump)} units ${values.jump < 0 ? 'left' : values.jump > 0 ? 'right' : 'nowhere'}.`;
      }
      if (options.kind === 'graph') {
        const extent = Math.max(10, Math.abs(values.slope * 5) + Math.abs(values.intercept) + 2), horizontal = value => 240 + value * 35, vertical = value => 140 - value * 110 / extent;
        for (let tick = -5; tick <= 5; tick++) { add('path', { d: `M${horizontal(tick)} 25 V250`, class: 'mvt-grid' }); label(horizontal(tick), 269, tick); }
        for (let tick = -2; tick <= 2; tick++) { const value = tick * extent / 2; add('path', { d: `M65 ${vertical(value)} H415`, class: 'mvt-grid' }); label(40, vertical(value) + 5, number(value)); }
        path('M65 140 H435'); path('M240 250 V20'); label(445, 146, 'x'); label(251, 18, 'y');
        path(`M${horizontal(-5)} ${vertical(-5 * values.slope + values.intercept)} L${horizontal(5)} ${vertical(5 * values.slope + values.intercept)}`, true, 1);
        const output = values.slope * values.input + values.intercept;
        point(horizontal(values.input), vertical(output), 2); label(horizontal(values.input), Math.max(35, vertical(output) - 14), `(${number(values.input)}, ${number(output)})`, 2);
        equationText = `y = ${number(values.slope)}x ${values.intercept < 0 ? '−' : '+'} ${Math.abs(values.intercept)}`; statusText = `At x = ${number(values.input)}, y = ${number(output)}. The y-axis window rescales to keep the line visible.`;
      }
      if (options.kind === 'equation') {
        const total = values.coefficient * values.solution + values.constant;
        region(40, 70, 175, 75, 0); region(265, 70, 175, 75, 0); label(127, 115, `${values.coefficient}x + ${values.constant}`); label(240, 115, '='); label(352, 115, total);
        path('M45 175 H435', false, 1); label(240, 200, `Subtract ${values.constant} from BOTH sides`, 1); label(240, 226, `${values.coefficient}x = ${total - values.constant}`, 1); label(240, 259, `Divide BOTH sides by ${values.coefficient}: x = ${values.solution}`, 2);
        equationText = `${values.coefficient} × (${values.solution}) + ${values.constant} = ${total}`; statusText = 'This is an adjustable worked model, not the answer to your current question.';
      }
      if (options.kind === 'area') {
        const scale = Math.min(330 / values.base, 170 / values.height), width = values.base * scale, height = values.height * scale, left = 240 - width / 2, top = 220 - height;
        region(left, top, width, height, 0); add('path', { d: `M${left} 220 L${left + width} 220 L${left} ${top} Z`, class: 'mvt-region' }, undefined, 1); path(`M${left} ${top} L${left + width} 220`, true, 1);
        label(240, 250, 'Base = ' + values.base + ' cm'); label(240, 30, 'Perpendicular height = ' + values.height + ' cm');
        equationText = `Rectangle: ${values.base * values.height} cm² · Triangle: ${values.base * values.height / 2} cm²`; statusText = 'Triangle area = base × perpendicular height ÷ 2.';
      }
      if (options.kind === 'circle') {
        const radius = values.radius * 10;
        add('circle', { cx: 240, cy: 145, r: radius, class: 'mvt-region' }, undefined, 1); path(`M${240 + radius} 145 A${radius} ${radius} 0 1 1 ${240 - radius} 145 A${radius} ${radius} 0 1 1 ${240 + radius} 145`, true);
        path(`M240 145 H${240 + radius}`, true, 2); point(240, 145); label(240 + radius / 2, 128, number(values.radius) + ' cm', 2);
        equationText = `C = 2πr ≈ ${(2 * Math.PI * values.radius).toFixed(2)} cm · A = πr² ≈ ${(Math.PI * values.radius ** 2).toFixed(2)} cm²`; statusText = 'Double the radius: circumference doubles, but area becomes four times as large.';
      }
      if (options.kind === 'angle') {
        const radians = values.angle * Math.PI / 180, endHorizontal = 240 + 140 * Math.cos(radians), endVertical = 215 - 140 * Math.sin(radians);
        path('M65 215 H415'); path(`M240 215 L${endHorizontal} ${endVertical}`, true, 1);
        path(`M290 215 A50 50 0 0 0 ${240 + 50 * Math.cos(radians)} ${215 - 50 * Math.sin(radians)}`, true, 1);
        label(335, 195, values.angle + '°', 1); label(130, 195, 180 - values.angle + '°', 2);
        equationText = `${values.angle}° + ${180 - values.angle}° = 180°`; statusText = 'The adjacent angles always fill one straight angle.';
      }
      if (options.kind === 'pythagoras') {
        const scale = Math.min(200 / values.first, 160 / values.second), width = values.first * scale, height = values.second * scale, hypotenuse = Math.hypot(values.first, values.second);
        path(`M65 205 H${65 + width} L65 ${205 - height} Z`, true); path('M65 190 H80 V205');
        label(65 + width / 2, 230, values.first + ' cm'); label(65 + width / 2 + 12, 205 - height / 2 - 12, 'c'); label(65, 29, values.second + ' cm');
        const squares = [values.first ** 2, values.second ** 2, values.first ** 2 + values.second ** 2], maximum = squares[2];
        squares.forEach((value, index) => { region(325, 55 + index * 55, 100 * value / maximum, 25, index === 2 ? 2 : 1); label(375, 98 + index * 55, ['a²', 'b²', 'c²'][index] + ' = ' + value, index === 2 ? 2 : 1); });
        equationText = `${values.first}² + ${values.second}² = c² = ${squares[2]}`; statusText = `c = √${squares[2]} ${Number.isInteger(hypotenuse) ? '=' : '≈'} ${number(Number(hypotenuse.toFixed(4)))} cm. Bar lengths compare square areas.`;
      }
      if (options.kind === 'scientific') {
        const coefficient = Number(values.coefficient.toFixed(1)), exponent = values.exponent, value = coefficient * 10 ** exponent;
        label(240, 62, `${coefficient} × 10^${exponent}`); path('M75 140 H405', true, 1);
        for (let index = -6; index <= 6; index++) { const horizontal = 75 + (index + 6) * 27.5; path(`M${horizontal} 135 V145`); label(horizontal, 169, index); }
        point(75 + (exponent + 6) * 27.5, 140, 2); label(240, 224, exponent === 0 ? 'Decimal stays in place' : `Move decimal ${Math.abs(exponent)} places ${exponent < 0 ? 'left' : 'right'}`, 2);
        equationText = `${coefficient} × 10^${exponent} = ${number(value)}`; statusText = 'The highlighted position is the exponent, not a point on an ordinary value axis.';
      }
      if (options.kind === 'data') {
        const measurements = [values.first, values.second, values.third], sum = measurements.reduce((total, value) => total + value, 0), range = Math.max(...measurements) - Math.min(...measurements), ordered = [...measurements].sort((first, second) => first - second);
        path('M65 225 H425'); path('M65 225 V25'); for (let tick = 0; tick <= 20; tick += 5) label(45, 230 - tick * 9, tick);
        measurements.forEach((value, index) => { region(100 + index * 110, 225 - value * 9, 70, value * 9, 1); label(135 + index * 110, Math.max(30, 210 - value * 9), value, 1); label(135 + index * 110, 253, ['A', 'B', 'C'][index]); });
        equationText = `Mean ${sum % 3 === 0 ? '=' : '≈'} ${number(sum / 3)} · Median = ${ordered[1]} · Range = ${range}`; statusText = 'These bars show three numerical observations, not category frequencies.';
      }
      equation.textContent = format(equationText); status.textContent = format(statusText); picture.replaceChildren(svg); setTeachingStep(teachingStep);
    }
    function setTeachingStep(step) { teachingStep = Math.max(0, Math.min(2, Number(step) || 0)); for (const node of picture.querySelectorAll('[data-teaching-part]')) { const part = Number(node.dataset.teachingPart); node.classList.toggle('mvt-current', part === teachingStep); node.style.opacity = part > teachingStep ? '.3' : '1'; } }
    replay.onclick = render; reset.onclick = () => { Object.assign(values, initialValues); render(); options.onChange?.({ kind: options.kind, values: { ...values } }); };
    render();
    return Object.freeze({ setTeachingStep, setInteractive: enabled => { inputs.hidden = !enabled; reset.hidden = !enabled; }, getValues: () => ({ ...values }), replay: render, destroy: () => { destroyed = true; replay.onclick = reset.onclick = null; panel.remove(); }, panel });
  }
  root.MathsVisualTeaching = Object.freeze({ mount, kinds: Object.keys(definitions), version: 1 });
})(globalThis);
