const Grade8Content = (() => {
  const sources = [
    { id: 'ccss', title: 'Common Core — Grade 8', url: 'https://www.thecorestandards.org/Math/Content/8/introduction/', status: 'Official Grade 8 overview checked on 9 October 2026. Domain coverage is not full standard certification.' },
    { id: 'england', title: 'England — Key Stage 3 mathematics', url: 'https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study', status: 'Stage-wide Years 7–9 content, not an official Year 8 sequence.' },
    { id: 'india', title: 'India — NCERT textbook portal (not verified in this update)', url: 'https://ncert.nic.in/textbook.php', status: 'The Grade 8 PDF could not be retrieved during this update. No edition-specific NCERT coverage is claimed; related topics are original lessons.' },
    { id: 'south-africa', title: 'South Africa — Senior Phase mathematics CAPS', url: 'https://www.education.gov.za/Portals/0/CD/National%20Curriculum%20Statements%20and%20Vocational/CAPS%20SP%20%20MATHEMATICS%20GR%207-9.pdf', status: 'Official PDF checked on 9 October 2026, including Grade 8 progression and teaching guidance. Some course topics extend beyond this grade.' }
  ];
  const chapters = [], lessons = {};
  const visual = text => ({ type: 'teaching_visuals', specs: [{ shape: 'equation', labels: { text: text.replace(/</g, ' less than ').replace(/>/g, ' greater than ').slice(0, 140) } }] });
  const question = (text, answer, hint, working, calculation, picture) => ({ q: text, a: answer, h: hint, why: working, calculation, visual: picture || visual(text), assessmentVisual: visual(text), lines: [text, hint, working] });
  const choice = (text, accepted, hint, working) => ({ ...question(text, null, hint, working, null), accepted: [accepted], answerChoices: [['rational', 'irrational'], ['linear', 'nonlinear'], ['positive', 'negative'], ['none', 'infinitely many']].find(choices => choices.includes(accepted)), answerFormat: 'Use the answer choices in the question.' });
  function chapter(title, references, extension = false) {
    const entry = { id: 'g8-ch-' + (chapters.length + 1), title, references, extension, sections: [] };
    chapters.push(entry);
    return entry;
  }
  function skill(entry, sectionTitle, slug, title, definition, hook, recipe, options = {}) {
    let section = entry.sections.find(item => item.title === sectionTitle);
    if (!section) { section = { id: entry.id + '-s' + (entry.sections.length + 1), title: sectionTitle, topics: [] }; entry.sections.push(section); }
    const id = 'g8-' + slug, questions = Array.from({ length: 16 }, (_, index) => recipe(index));
    const examples = questions.slice(0, 2).map(item => ({ q: item.q, visual: item.visual, answer: item.a, accepted: item.accepted || null, calculation: item.calculation, steps: item.lines.map(line => ({ board: line, voice: line, visual: item.visual })) }));
    const lesson = { id, grade: 8, name: title, chapter: entry.title, chapterId: entry.id, subchapter: section.title, subchapterId: section.id, goal: definition, hook, idea: definition, simple: definition, definition, prerequisite: options.prerequisite || 'Use the earlier lessons in this chapter if you need a refresher.', visual: questions[0].visual, conceptVisual: visual(definition), steps: questions[0].lines.map(line => [line, line]), narration: questions[0].lines, exampleVisuals: examples.map(item => item.visual), guided: questions.slice(2, 6), practice: questions.slice(2, 6), application: questions[6], mastery: questions.slice(6, 16), challenge: questions[15], classExercise: questions.slice(6), workedExamples: examples, alternateExample: examples[0], teachingScenes: [{ board: definition, voice: definition, visual: visual(definition) }], faqs: [{ keywords: ['meaning', 'what is', 'definition'], answer: definition }], oneToOne: true, pending: false, classVersion: 2, coverage: 'Original international skill lesson; not certification of an entire national standard.', curriculumSource: sources.find(source => entry.references.includes(source.id))?.url, ...options };
    lessons[id] = lesson;
    section.topics.push({ id, title, chapterId: entry.id, sectionId: section.id, family: slug, extension: entry.extension });
  }

  let entry = chapter('Rational and real numbers', ['ccss', 'india', 'south-africa']);
  skill(entry, 'Fractions and signed numbers', 'rational-add', 'Add rational numbers', 'Rational numbers can be written as fractions of integers. To add fractions, first give them the same denominator.', 'Adding a debt and a credit helps us understand positive and negative amounts.', index => {
    const numerator = index - 6;
    return question(`Calculate ${numerator}/4 + 1/2. Give a number or fraction.`, (numerator + 2) / 4, 'Rewrite one half as two quarters.', `(${numerator} + 2)/4 = ${numerator + 2}/4.`, `(${numerator}+2)/4`, { type: 'teaching_visuals', specs: [{ shape: 'number_line', labels: { min: -3, max: 4, point: numerator / 4, jump: .5 } }] });
  });
  skill(entry, 'Fractions and signed numbers', 'rational-multiply', 'Multiply and divide rational numbers', 'Multiply numerators and denominators. To divide by a nonzero fraction, multiply by its reciprocal; different signs give a negative result.', 'A fraction of a negative balance is still a negative amount.', index => {
    const numerator = index + 2, divide = index % 2 === 1;
    return question(`Calculate -${numerator}/3 ${divide ? '÷' : '×'} 2/5.`, divide ? -numerator * 5 / 6 : -numerator * 2 / 15, divide ? 'Multiply by 5/2, the reciprocal of 2/5.' : 'Multiply the numerators and denominators; keep the negative sign.', divide ? `-${numerator}/3 × 5/2 = -${numerator * 5}/6.` : `-${numerator}/3 × 2/5 = -${numerator * 2}/15.`, divide ? `-${numerator}*5/6` : `-${numerator}*2/15`);
  });
  skill(entry, 'Beyond fractions', 'irrational', 'Recognise irrational numbers', 'A rational decimal terminates or repeats. An irrational decimal never terminates or repeats; the square root of a non-square positive integer is irrational.', 'A square with area two square units has an irrational side length.', index => {
    const numbers = [2, 4, 3, 9, 5, 16, 6, 25, 7, 36, 8, 49, 10, 64, 11, 81], number = numbers[index], rational = Number.isInteger(Math.sqrt(number));
    return choice(`Is the square root of ${number} rational or irrational?`, rational ? 'rational' : 'irrational', 'Check whether the number is a perfect square.', rational ? `${number} is a perfect square, so its square root is an integer and rational.` : `${number} is not a perfect square, so its square root is irrational.`);
  });

  entry = chapter('Powers, roots and standard form', ['ccss', 'india', 'south-africa']);
  skill(entry, 'Index laws', 'powers', 'Combine powers and negative indices', 'When multiplying powers with the same base, add their exponents. A negative exponent means the reciprocal of the corresponding positive power.', 'Index laws make very large and very small quantities easier to calculate.', index => {
    const exponent = index - 7;
    return question(`Evaluate 2^${exponent} × 2^3.`, 2 ** (exponent + 3), 'Keep base two and add the exponents.', `2^(${exponent} + 3) = 2^${exponent + 3} = ${2 ** (exponent + 3)}.`, `2^(${exponent}+3)`);
  });
  skill(entry, 'Roots', 'roots', 'Square roots and cube roots', 'A square root reverses squaring. A cube root reverses cubing. The principal square root of a positive number is positive.', 'Roots recover lengths from areas and cube edge lengths from volumes.', index => {
    const root = index + 2, cube = index % 2 === 1, number = root ** (cube ? 3 : 2);
    return question(`Find the ${cube ? 'cube' : 'principal square'} root of ${number}.`, root, cube ? 'Find the number whose cube equals the given number.' : 'Find the positive number whose square equals the given number.', `${root}${cube ? '³' : '²'} = ${number}, so the root is ${root}.`, cube ? `${number}^(1/3)` : `sqrt(${number})`);
  });
  skill(entry, 'Standard form', 'scientific', 'Scientific notation calculations', 'Scientific notation writes a number as a factor from one up to, but not including, ten multiplied by a power of ten.', 'Scientists compare distances and tiny measurements using powers of ten.', index => {
    const factor = index + 2;
    const normalized = MathsNotation.scientific(factor * 200000);
    return question(`Calculate (${factor} × 10^3) × (2 × 10^2). Give an ordinary number.`, factor * 200000, 'Multiply the factors and add the powers of ten. Finish with a coefficient whose magnitude is at least one and less than ten.', `${factor} × 2 × 10^(3 + 2) = ${factor * 200000} = ${normalized.text}. A factor outside the standard range is intermediate working, not final scientific notation.`, `${factor}*2*10^5`);
  });

  entry = chapter('Factors, multiples and sets', ['england', 'south-africa']);
  skill(entry, 'Number structure', 'hcf', 'Highest common factor', 'The highest common factor is the largest positive integer that divides both numbers exactly.', 'The highest common factor finds the largest equal groups with nothing left over.', index => {
    const factor = index + 2;
    return question(`Find the highest common factor of ${factor * 3} and ${factor * 5}.`, factor, 'Three and five have no shared prime factor.', `Both numbers contain ${factor}; their remaining factors 3 and 5 are coprime. HCF = ${factor}.`, `${factor}`);
  });
  skill(entry, 'Number structure', 'lcm', 'Least common multiple', 'The least common multiple is the smallest positive number that is a multiple of both numbers.', 'Use a common multiple to find when two repeating events next happen together.', index => {
    const factor = index + 2;
    return question(`Two bells ring every ${2 * factor} and ${3 * factor} minutes. They ring together now. After how many minutes do they next ring together?`, 6 * factor, 'Find the smallest common multiple of the two intervals.', `LCM(${2 * factor}, ${3 * factor}) = 6 × ${factor} = ${6 * factor} minutes.`, `6*${factor}`);
  });
  skill(entry, 'Sets and Venn diagrams', 'sets', 'Count a union without double-counting', 'A union contains members of either set. Add the two set sizes and subtract the intersection once because it was counted twice.', 'Two clubs may share members; do not count those students twice.', index => {
    const first = index + 12, second = index + 8, overlap = index + 2;
    return question(`${first} learners study music, ${second} study art, and ${overlap} study both. How many study at least one?`, first + second - overlap, 'Add both totals, then subtract the overlap.', `${first} + ${second} − ${overlap} = ${first + second - overlap} learners.`, `${first}+${second}-${overlap}`);
  });

  entry = chapter('Ratio, rates and proportion', ['england', 'india', 'south-africa']);
  skill(entry, 'Ratios and rates', 'ratio-share', 'Share in a ratio', 'A ratio compares quantities in parts. Add the parts, divide the total by that sum, then multiply by the parts requested.', 'Share a budget or a mixture without losing the original ratio.', index => {
    const unit = index + 3;
    return question(`Share ${5 * unit} counters in the ratio 2:3. How many are in the smaller share?`, 2 * unit, 'There are five equal parts; the smaller share is two of them.', `${5 * unit} ÷ 5 × 2 = ${2 * unit} counters.`, `${5 * unit}/5*2`);
  });
  skill(entry, 'Ratios and rates', 'unit-rate', 'Unit rates and speed', 'A unit rate gives a quantity per one unit of another quantity. Average speed equals distance divided by elapsed time.', 'Compare journeys by kilometres per hour rather than distance alone.', index => {
    const speed = index + 18, time = index % 4 + 2;
    return question(`A cyclist covers ${speed * time} km in ${time} hours. Find the average speed in km/h.`, speed, 'Divide distance by time.', `${speed * time} ÷ ${time} = ${speed} km/h.`, `${speed * time}/${time}`);
  });
  skill(entry, 'Proportional relationships', 'inverse', 'Direct and inverse proportion', 'In direct proportion the ratio stays constant. In inverse proportion the product stays constant when one quantity increases as the other decreases.', 'More identical workers can finish a fixed job sooner if their work rates are equal.', index => {
    const time = index + 4;
    return question(`Four equally productive workers finish a job in ${time} hours. How many hours would eight workers need at the same rate?`, time / 2, 'Worker count times time stays constant for this fixed job.', `4 × ${time} ÷ 8 = ${time / 2} hours.`, `4*${time}/8`);
  });

  entry = chapter('Percentages and financial mathematics', ['england', 'india', 'south-africa']);
  skill(entry, 'Percentage changes', 'percentage', 'Discounts and percentage increase', 'A percentage change is calculated from the original amount. A discount subtracts that change; an increase adds it.', 'Read a sale price or a price increase using the correct starting amount.', index => {
    const price = (index + 5) * 20, increase = index % 2 === 1;
    return question(`An item costs ${price} currency units. Its price ${increase ? 'increases by' : 'is discounted by'} 15%. Find the new price.`, price * (increase ? 1.15 : .85), 'Find fifteen percent of the original price, then add or subtract it.', `${price} × ${increase ? '1.15' : '0.85'} = ${Number((price * (increase ? 1.15 : .85)).toFixed(2))} currency units.`, `${price}*${increase ? '1.15' : '0.85'}`);
  });
  skill(entry, 'Interest', 'simple-interest', 'Simple interest', 'Simple interest equals principal times the annual rate as a decimal times the number of years; it does not earn interest on earlier interest.', 'Separate the interest earned from the total amount in a savings example.', index => {
    const principal = (index + 4) * 100;
    return question(`Find only the simple interest on ${principal} currency units at 5% per year for three years.`, principal * .15, 'Use I = P × r × t, with r = 0.05.', `${principal} × 0.05 × 3 = ${principal * .15} currency units of interest.`, `${principal}*0.05*3`);
  });
  skill(entry, 'Interest', 'compound-interest', 'Repeated percentage growth', 'Compound growth applies a percentage to the current amount each period. Multiply by the growth factor once for each period.', 'Money and populations can grow by repeated percentages rather than equal additions.', index => {
    const principal = (index + 2) * 100;
    return question(`${principal} units grow by 10% each year for two years. Find the final amount.`, principal * 1.21, 'Multiply by 1.1 twice, not by 1.2 once.', `${principal} × 1.1² = ${Number((principal * 1.21).toFixed(2))} units.`, `${principal}*1.1^2`);
  });

  entry = chapter('Algebraic expressions and identities', ['england', 'india', 'south-africa']);
  skill(entry, 'Expressions', 'substitution', 'Substitute into expressions', 'Substitution replaces a variable by its value. Keep brackets around negative values and follow the order of operations.', 'An algebraic formula calculates many cases without writing a new rule each time.', index => {
    const value = index - 5;
    return question(`Evaluate 3x² − 2x + 1 when x = ${value}.`, 3 * value ** 2 - 2 * value + 1, 'Square x first; then multiply, subtract and add.', `3 × (${value})² − 2 × (${value}) + 1 = ${3 * value ** 2 - 2 * value + 1}.`, `3*(${value})^2-2*(${value})+1`);
  });
  skill(entry, 'Expansion and factorisation', 'expand', 'Expand a bracket', 'The distributive law multiplies every term inside a bracket by the factor outside. Combining like terms then simplifies the expression.', 'Expanding a bracket connects an area model to algebra.', index => {
    const factor = index + 2;
    return question(`After expanding ${factor}(3x + 4), what is the coefficient of x?`, factor * 3, 'Multiply the outside factor by the coefficient of x inside.', `${factor}(3x + 4) = ${factor * 3}x + ${factor * 4}; the coefficient is ${factor * 3}.`, `${factor}*3`);
  });
  skill(entry, 'Expansion and factorisation', 'factorise', 'Square identities', 'Factorising reverses expansion. A common factor divides every term. The identity (a + b)² = a² + 2ab + b² includes the cross term.', 'A square area model explains why squaring a sum is not the sum of two squares.', index => {
    const offset = index + 2;
    return question(`Expand (x + ${offset})². What is the coefficient of x?`, 2 * offset, 'The middle term is twice x times the constant.', `(x + ${offset})² = x² + ${2 * offset}x + ${offset ** 2}. The coefficient is ${2 * offset}.`, `2*${offset}`);
  });
  skill(entry, 'Expansion and factorisation', 'common-factor', 'Factorise by a common factor', 'Taking out a common factor means writing every term as that factor times a remaining term. Multiplying the bracket back out checks the result.', 'Factorisation reveals the repeated structure hidden inside a sum.', index => {
    const factor = index + 2, coefficient = index + 3;
    return question(`Factorise ${coefficient * factor}x + ${5 * factor} as ${factor}(Ax + 5). Find A.`, coefficient, 'Divide each original coefficient by the factor outside the bracket.', `${coefficient * factor}x + ${5 * factor} = ${factor}(${coefficient}x + 5); A = ${coefficient}.`, `${coefficient * factor}/${factor}`);
  });

  entry = chapter('Linear equations and inequalities', ['ccss', 'england', 'india', 'south-africa']);
  skill(entry, 'Equations', 'linear-equation', 'Solve multi-step linear equations', 'Keep an equation balanced by doing the same operation to both sides. Undo addition or subtraction before undoing multiplication.', 'An equation can recover an unknown starting quantity from a final total.', index => {
    const solution = index - 4;
    return question(`Solve 3x + 7 = ${3 * solution + 7}. Give x.`, solution, 'Subtract seven from both sides, then divide both sides by three.', `3x = ${3 * solution}; x = ${solution}. Check: 3 × (${solution}) + 7 = ${3 * solution + 7}.`, `(${3 * solution + 7}-7)/3`);
  });
  skill(entry, 'Equations', 'equation-solutions', 'One, none or infinitely many solutions', 'After simplifying a linear equation, a true identity has infinitely many solutions and a false statement has no solution; otherwise solve for the variable.', 'Not every equation produces exactly one answer.', index => {
    const offset = index + 2, same = index % 2 === 0;
    return choice(`For 2(x + ${offset}) = 2x + ${same ? 2 * offset : 2 * offset + 1}, say “infinitely many” or “none” for the number of solutions.`, same ? 'infinitely many' : 'none', 'Expand the left side, then subtract 2x from both sides.', same ? `Both sides become 2x + ${2 * offset}; every real x works.` : `This would require ${2 * offset} = ${2 * offset + 1}, which is false.`);
  });
  skill(entry, 'Inequalities', 'inequality', 'Integer solutions of inequalities', 'An inequality describes a range of values. Dividing or multiplying both sides by a negative number reverses the inequality sign.', 'A budget or maximum capacity gives a range of allowed values, not just one value.', index => {
    const boundary = index + 3;
    return question(`Find the greatest integer x satisfying 2x + 1 < ${2 * boundary + 1}.`, boundary - 1, 'Subtract one and divide by two to get x less than the boundary.', `x < ${boundary}, so the greatest integer is ${boundary - 1}.`, `${boundary}-1`);
  });

  entry = chapter('Coordinates and linear functions', ['ccss', 'england', 'south-africa']);
  skill(entry, 'Linear rules', 'function', 'Evaluate a linear function', 'A function assigns exactly one output to each allowed input. A linear rule y = mx + b has a constant rate of change m.', 'A starting fee plus a fee per kilometre is a linear relationship.', index => {
    const input = index - 5;
    return question(`For y = 2x + 3, find y when x = ${input}.`, 2 * input + 3, 'Multiply the input by two, then add three.', `y = 2 × (${input}) + 3 = ${2 * input + 3}.`, `2*(${input})+3`, { type: 'teaching_visuals', specs: [{ shape: 'graph', labels: { slope: 2, intercept: 3, xmin: -6, xmax: 12, ymin: -10, ymax: 30, point: input } }] });
  });
  skill(entry, 'Graphs and slope', 'slope', 'Slope from two points', 'Slope is change in y divided by change in x. A horizontal line has slope zero; a vertical line has undefined slope.', 'Slope measures the rate at which a graph rises or falls.', index => {
    const slope = index - 5;
    return question(`Find the slope through (1, 2) and (4, ${2 + slope * 3}).`, slope, 'Use the same point order for both differences.', `Slope = (${2 + slope * 3} − 2)/(4 − 1) = ${slope}.`, `(${2 + slope * 3}-2)/(4-1)`);
  });
  skill(entry, 'Graphs and slope', 'intercept', 'Find a linear rule’s intercept', 'The y-intercept is the output when x is zero. Given a slope m and a point, calculate b using b = y − mx.', 'The intercept separates a fixed starting amount from a changing amount.', index => {
    const intercept = index - 6, output = 6 + intercept;
    return question(`A line has slope 3 and passes through (2, ${output}). Find its y-intercept.`, intercept, 'Substitute the point into y = 3x + b.', `b = ${output} − 3 × 2 = ${intercept}.`, `${output}-3*2`);
  });
  skill(entry, 'Linear rules', 'linear-nonlinear', 'Distinguish linear and nonlinear functions', 'A linear function has a constant rate of change and a straight-line graph. A square term makes the change depend on the input, so the function is nonlinear.', 'Compare rules, tables and graphs rather than assuming every relationship is linear.', index => {
    const offset = index + 1, linear = index % 2 === 0;
    return choice(`Classify y = ${linear ? '3x' : 'x²'} + ${offset}: linear or nonlinear?`, linear ? 'linear' : 'nonlinear', 'Look for a constant rate of change; a square term does not have one.', linear ? 'The rate of change is always three: linear.' : 'The x-squared term has a changing rate: nonlinear.');
  });

  entry = chapter('Sequences and simultaneous equations', ['ccss', 'england', 'south-africa']);
  skill(entry, 'Sequences', 'sequence', 'Arithmetic sequence rules', 'An arithmetic sequence increases or decreases by a constant difference. Its nth term is first term plus (n − 1) times the difference.', 'A sequence rule predicts a later term without listing every earlier term.', index => {
    const position = index + 4;
    return question(`The sequence is 5, 8, 11, 14, … Find term ${position}.`, 5 + (position - 1) * 3, 'The first term is five and the difference is three.', `Term ${position} = 5 + (${position} − 1) × 3 = ${5 + (position - 1) * 3}.`, `5+(${position}-1)*3`);
  });
  skill(entry, 'Sequences', 'geometric-sequence', 'Geometric patterns', 'A geometric sequence multiplies by a fixed ratio to produce the next term. Its nth term is the first term multiplied by the ratio to the power n minus one.', 'Repeated doubling follows a multiplicative pattern, not a fixed additive difference.', index => {
    const first = index + 2;
    return question(`A sequence starts ${first}, ${first * 2}, ${first * 4}, … and doubles each time. Find its fifth term.`, first * 16, 'Four doublings take the first term to the fifth.', `${first} × 2^4 = ${first * 16}.`, `${first}*2^4`);
  });
  skill(entry, 'Two unknowns', 'simultaneous', 'Solve simultaneous equations', 'A simultaneous solution satisfies both equations. Elimination adds or subtracts equations to remove one variable.', 'Two totals can reveal the separate prices of two unknown items.', index => {
    const first = index + 3, second = index + 1;
    return question(`Solve x + y = ${first + second} and x − y = 2. Give x only.`, first, 'Add the equations to cancel y, then divide by two.', `2x = ${first + second + 2}; x = ${first}; y = ${second}. Both equations check.`, `(${first + second}+2)/2`);
  });
  skill(entry, 'Two unknowns', 'systems-type', 'Parallel lines and inconsistent systems', 'Two different parallel lines never meet, so their simultaneous equations have no common solution. Coincident lines have infinitely many common points.', 'A pair of equations may be inconsistent rather than difficult to solve.', index => {
    const intercept = index + 1, same = index % 2 === 0;
    return choice(`Compare y = 2x + ${intercept} with y = 2x + ${same ? intercept : intercept + 1}. How many simultaneous solutions: “none” or “infinitely many”?`, same ? 'infinitely many' : 'none', 'Compare the slopes and then the intercepts.', same ? 'The equations describe the same line: infinitely many common points.' : 'Equal slopes and different intercepts give distinct parallel lines: no common point.');
  });

  entry = chapter('Angles, polygons and quadrilaterals', ['england', 'india', 'south-africa']);
  skill(entry, 'Angle reasoning', 'angles', 'Angles on a straight line', 'Adjacent angles on a straight line sum to 180 degrees. Vertically opposite angles are equal.', 'Angle relationships let us calculate an angle without measuring it.', index => {
    const known = index * 5 + 25;
    return question(`Two adjacent angles form a straight line. One is ${known}°. Find the other in degrees.`, 180 - known, 'Subtract the known angle from 180 degrees.', `180 − ${known} = ${180 - known}°.`, `180-${known}`, { type: 'teaching_visuals', specs: [{ shape: 'angle', labels: { angle: known + '°' } }] });
  });
  skill(entry, 'Angle reasoning', 'parallel-angles', 'Parallel lines and transversals', 'When a transversal crosses parallel lines, corresponding angles are equal, alternate interior angles are equal, and co-interior angles sum to 180 degrees.', 'State which angle relationship you use; the lines must be parallel.', index => {
    const angle = index * 4 + 24, alternate = index % 2 === 0;
    return question(`A transversal crosses two parallel lines. One interior angle is ${angle}°. Find its ${alternate ? 'alternate interior' : 'co-interior'} partner in degrees.`, alternate ? angle : 180 - angle, alternate ? 'Alternate interior angles on parallel lines are equal.' : 'Co-interior angles on parallel lines sum to 180 degrees.', alternate ? `The alternate interior partner is ${angle}°.` : `180 − ${angle} = ${180 - angle}°.`, alternate ? `${angle}` : `180-${angle}`);
  });
  skill(entry, 'Polygons', 'polygon-sum', 'Interior and exterior angle sums', 'An n-sided polygon can be divided into n − 2 triangles, so its interior angles sum to (n − 2) × 180 degrees. Its exterior turning angles total 360 degrees.', 'Splitting a polygon into triangles explains the angle-sum rule.', index => {
    const sides = index + 3;
    return question(`Find the sum of the interior angles of a ${sides}-sided polygon, in degrees.`, (sides - 2) * 180, 'Use (number of sides minus two) times 180.', `(${sides} − 2) × 180 = ${(sides - 2) * 180}°.`, `(${sides}-2)*180`);
  });
  skill(entry, 'Quadrilaterals', 'parallelogram', 'Properties of parallelograms', 'A parallelogram has opposite sides parallel and equal, opposite angles equal, and adjacent angles supplementary. Its diagonals bisect one another.', 'Properties of quadrilaterals recover missing lengths and angles.', index => {
    const angle = index * 4 + 30;
    return question(`One angle of a parallelogram is ${angle}°. Find an adjacent angle.`, 180 - angle, 'Adjacent angles between parallel sides sum to 180 degrees.', `180 − ${angle} = ${180 - angle}°.`, `180-${angle}`);
  });

  entry = chapter('Congruence, similarity and constructions', ['ccss', 'england', 'india', 'south-africa']);
  skill(entry, 'Congruence and similarity', 'similarity', 'Scale factors in similar figures', 'Similar figures have equal corresponding angles and proportional corresponding lengths. Congruent figures have the same shape and size.', 'Scale drawings preserve shape while changing lengths by one factor.', index => {
    const length = index + 3;
    return question(`A triangle is enlarged by scale factor 3. A corresponding original side is ${length} cm. Find the new side length.`, length * 3, 'Multiply corresponding lengths by the scale factor.', `${length} × 3 = ${length * 3} cm.`, `${length}*3`);
  });
  skill(entry, 'Congruence and similarity', 'congruence', 'Congruent triangles and corresponding parts', 'Congruent triangles match in all corresponding sides and angles. SSS, SAS and ASA can establish congruence; three angles alone establish only similarity.', 'Match corresponding vertices before transferring a measurement.', index => {
    const length = index + 4;
    return question(`Triangle ABC is congruent to triangle DEF, with A matching D, B matching E, C matching F. If BC = ${length} cm, find EF in cm.`, length, 'BC corresponds to EF because the vertex order matches.', `Corresponding sides of congruent triangles are equal; EF = ${length} cm.`, `${length}`);
  });
  skill(entry, 'Compass and straightedge', 'construction', 'Perpendicular bisectors and angle bisectors', 'A perpendicular bisector passes through a segment’s midpoint at a right angle. Equal-radius compass arcs locate points equidistant from its endpoints.', 'Constructions explain exact relationships; a numerical check alone does not certify the drawing.', index => {
    const length = 2 * (index + 3);
    return question(`A perpendicular bisector meets a ${length} cm segment at its midpoint. How far is the midpoint from either endpoint?`, length / 2, 'A midpoint divides a segment into two equal lengths.', `${length} ÷ 2 = ${length / 2} cm.`, `${length}/2`);
  }, { practicalActivity: { prompt: 'Use a compass and straightedge to construct a perpendicular bisector of an 8 cm segment. Keep both arc intersections visible, then construct the bisector of a chosen angle. Describe each step in your notes.', steps: ['Draw and label an 8 cm segment.', 'Open the compass to more than half the segment length. From each endpoint, draw equal-radius arcs above and below the segment.', 'Join the two arc intersections using a straightedge. Check the midpoint and right angle.', 'For an angle bisector, draw an arc from the vertex cutting both rays. From those cuts, draw equal-radius intersecting arcs. Join the vertex to their intersection.', 'Record your construction steps and explain the equal-distance reasoning. Ask a teacher or parent to review your work.'], rubric: ['Equal-radius arcs from both endpoints are visible.', 'The line through both intersections meets the midpoint at a right angle.', 'Angle-bisector construction uses equal arcs and divides the angle equally.', 'The learner explains why the construction works.'], grading: 'manual review; supporting numerical questions do not certify a construction' } });

  entry = chapter('Transformations and symmetry', ['ccss', 'england', 'south-africa']);
  skill(entry, 'Rigid transformations', 'translation', 'Translate coordinates', 'A translation moves every point by the same vector without changing lengths or angles. Add its horizontal and vertical components to the coordinates.', 'A translation moves a shape without stretching or turning it.', index => {
    const coordinate = index - 6;
    return question(`Translate (${coordinate}, 2) by vector (3, −5). Give the new x-coordinate only.`, coordinate + 3, 'Add three to the horizontal coordinate.', `(${coordinate}, 2) becomes (${coordinate + 3}, −3); x = ${coordinate + 3}.`, `${coordinate}+3`);
  });
  skill(entry, 'Rigid transformations', 'reflection', 'Reflect and rotate points', 'Reflection in the y-axis changes the sign of x but not y. A quarter-turn anticlockwise about the origin maps (x, y) to (−y, x).', 'Coordinate rules describe mirror images and rotations precisely.', index => {
    const coordinate = index - 7, rotation = index % 2 === 1;
    return question(`${rotation ? 'Rotate' : 'Reflect'} (${coordinate}, ${index + 2}) ${rotation ? '90° anticlockwise about the origin' : 'in the y-axis'}. Give the new x-coordinate only.`, rotation ? -(index + 2) : -coordinate, rotation ? 'For a quarter-turn anticlockwise, new x is minus old y.' : 'For reflection in the y-axis, reverse the sign of x.', rotation ? `The new point is (${-(index + 2)}, ${coordinate}); x = ${-(index + 2)}.` : `The new point is (${-coordinate}, ${index + 2}); x = ${-coordinate}.`, rotation ? `-(${index}+2)` : `-(${coordinate})`);
  });
  skill(entry, 'Enlargement and symmetry', 'dilation-area', 'Area under enlargement', 'A length scale factor k gives an area scale factor k squared because both dimensions change by k.', 'Doubling every length makes the area four times as large, not twice as large.', index => {
    const area = index + 4;
    return question(`A shape has area ${area} cm². It is enlarged by length scale factor 3. Find the new area in cm².`, area * 9, 'Square the length scale factor before multiplying the area.', `${area} × 3² = ${area * 9} cm².`, `${area}*3^2`);
  });

  entry = chapter('Pythagoras and distance', ['ccss', 'england']);
  skill(entry, 'Right triangles', 'pythagoras', 'Find the hypotenuse', 'In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides. The hypotenuse is opposite the right angle.', 'Right triangles help measure a diagonal without measuring it directly.', index => {
    const scale = index + 1;
    return question(`A right triangle has legs ${3 * scale} cm and ${4 * scale} cm. Find the hypotenuse in cm.`, 5 * scale, 'Square the legs, add the squares, then take the positive square root.', `c = √(${3 * scale}² + ${4 * scale}²) = ${5 * scale} cm.`, `sqrt(${3 * scale}^2+${4 * scale}^2)`, { type: 'teaching_visuals', specs: [{ shape: 'triangle', labels: { kind: 'right', base: 3 * scale + ' cm', height: 4 * scale + ' cm', hypotenuse: '?' } }] });
  });
  skill(entry, 'Right triangles', 'pythagoras-leg', 'Find a missing leg', 'To find a leg in a right triangle, subtract the other leg’s square from the hypotenuse’s square, then take the positive square root.', 'Identify the longest side before deciding whether to add or subtract squares.', index => {
    const scale = index + 1;
    return question(`A right triangle has hypotenuse ${13 * scale} cm and one leg ${5 * scale} cm. Find the other leg.`, 12 * scale, 'Use b² = c² − a².', `b = √(${13 * scale}² − ${5 * scale}²) = ${12 * scale} cm.`, `sqrt(${13 * scale}^2-${5 * scale}^2)`);
  });
  skill(entry, 'Coordinate distance', 'distance', 'Distance between coordinates', 'The horizontal and vertical differences between points form a right triangle. Distance is the square root of the sum of their squared differences.', 'Map coordinates turn a distance problem into a Pythagoras calculation.', index => {
    const scale = index + 1;
    return question(`Find the distance from (1, 2) to (${1 + 3 * scale}, ${2 + 4 * scale}) in coordinate units.`, 5 * scale, 'Find the changes in x and y, then use Pythagoras.', `Distance = √(${3 * scale}² + ${4 * scale}²) = ${5 * scale}.`, `sqrt(${3 * scale}^2+${4 * scale}^2)`);
  });

  entry = chapter('Perimeter, area and circles', ['england', 'india', 'south-africa']);
  skill(entry, 'Areas of polygons', 'trapezium', 'Area of a trapezium or trapezoid', 'The area of a trapezium with one pair of parallel sides is half their sum times the perpendicular height. In some countries this shape is called a trapezoid.', 'Naming differs between countries; identify the parallel sides before using the formula.', index => {
    const first = index + 3, second = index + 7;
    return question(`A trapezium has parallel sides ${first} cm and ${second} cm and perpendicular height 4 cm. Find its area.`, (first + second) * 2, 'Use A = (a + b)h/2; do not use a sloping side as the height.', `(${first} + ${second}) × 4 ÷ 2 = ${(first + second) * 2} cm².`, `(${first}+${second})*4/2`);
  });
  skill(entry, 'Circles', 'circumference', 'Circumference of a circle', 'Circumference equals two pi times the radius, or pi times the diameter. The diameter is twice the radius.', 'A wheel travels one circumference in a complete turn.', index => {
    const radius = index + 2;
    return question(`Find the circumference of a circle of radius ${radius} cm. Use pi = 3.14 and give a decimal.`, 6.28 * radius, 'Multiply two times pi times radius.', `2 × 3.14 × ${radius} = ${Number((6.28 * radius).toFixed(2))} cm.`, `2*3.14*${radius}`);
  });
  skill(entry, 'Circles', 'circle-area', 'Area of a circle', 'Circle area equals pi times the radius squared. Squaring the diameter instead would give an area four times too large.', 'Area measures the space inside a circular boundary.', index => {
    const radius = index + 2;
    return question(`Find the area of a circle of radius ${radius} cm. Use pi = 3.14.`, 3.14 * radius ** 2, 'Square the radius first, then multiply by pi.', `3.14 × ${radius}² = ${Number((3.14 * radius ** 2).toFixed(2))} cm².`, `3.14*${radius}^2`);
  });

  entry = chapter('Surface area, volume and units', ['ccss', 'england', 'india', 'south-africa']);
  skill(entry, 'Prisms and nets', 'cuboid-surface', 'Surface area of a cuboid', 'A cuboid has three pairs of matching faces. Its total surface area is twice the sum of length times width, length times height, and width times height.', 'Surface area tells us how much material covers the outside of a box.', index => {
    const length = index + 3;
    return question(`Find the total surface area of a closed cuboid of length ${length} cm, width 3 cm and height 2 cm.`, 2 * (5 * length + 6), 'Add the areas of all six faces, not just three.', `2 × (${length} × 3 + ${length} × 2 + 3 × 2) = ${2 * (5 * length + 6)} cm².`, `2*(${length}*3+${length}*2+3*2)`);
  });
  skill(entry, 'Curved solids', 'cylinder-volume', 'Volumes of cylinders and cones', 'A cylinder’s volume is pi times radius squared times height. A cone with the same base and height has one third of that volume.', 'Compare the capacity of containers using the base area and height.', index => {
    const height = 3 * (index + 2), cone = index % 2 === 1;
    return question(`Find the volume of a ${cone ? 'cone' : 'cylinder'} of radius 2 cm and height ${height} cm. Use pi = 3.14.`, 3.14 * 4 * height / (cone ? 3 : 1), cone ? 'Use V = pi × r² × h / 3.' : 'Use V = pi × r² × h.', `3.14 × 2² × ${height}${cone ? ' ÷ 3' : ''} = ${Number((3.14 * 4 * height / (cone ? 3 : 1)).toFixed(2))} cm³.`, `3.14*2^2*${height}/${cone ? 3 : 1}`);
  });
  skill(entry, 'Curved solids', 'sphere-volume', 'Sphere volume and cubic units', 'A sphere’s volume is four thirds times pi times radius cubed. Cubic units measure three-dimensional space; one cubic centimetre equals one millilitre.', 'Check that the formula and the units both describe volume, not area.', index => {
    const radius = 3 * (index + 1);
    return question(`Find the volume of a sphere of radius ${radius} cm. Use pi = 3.14.`, 4 * 3.14 * radius ** 3 / 3, 'Use V = 4 × pi × r³ / 3.', `4 × 3.14 × ${radius}³ ÷ 3 = ${Number((4 * 3.14 * radius ** 3 / 3).toFixed(2))} cm³.`, `4*3.14*${radius}^3/3`);
  });
  skill(entry, 'Volume units', 'capacity', 'Convert volume and capacity', 'One litre equals one thousand cubic centimetres. A cubic metre is one million cubic centimetres because the length conversion factor is cubed.', 'Capacity and volume describe the same space using different units.', index => {
    const litres = index + 2;
    return question(`Convert ${litres * 1000} cm³ to litres.`, litres, 'Divide the number of cubic centimetres by one thousand.', `${litres * 1000} ÷ 1000 = ${litres} litres.`, `${litres * 1000}/1000`);
  });

  entry = chapter('Statistics and data displays', ['ccss', 'england', 'south-africa']);
  skill(entry, 'Describing a distribution', 'mean', 'Mean and range', 'The mean is the sum divided by the number of observations. The range is the largest value minus the smallest and measures spread, not centre.', 'Two groups can have the same mean but different variability.', index => {
    const base = index + 2, range = index % 2 === 1;
    return question(`For data ${base}, ${base + 2}, ${base + 4}, ${base + 6}, find the ${range ? 'range' : 'mean'}.`, range ? 6 : base + 3, range ? 'Subtract the smallest observation from the largest.' : 'Add all four observations and divide by four.', range ? `${base + 6} − ${base} = 6.` : `(${base} + ${base + 2} + ${base + 4} + ${base + 6}) ÷ 4 = ${base + 3}.`, range ? `${base + 6}-${base}` : `(${base}+${base + 2}+${base + 4}+${base + 6})/4`);
  });
  skill(entry, 'Describing a distribution', 'median', 'Median and ordered data', 'The median is the middle observation after sorting. With an even number of observations it is the mean of the two central values.', 'Sort the data before finding a median; the order in the question may not be sorted.', index => {
    const base = index + 1;
    return question(`Find the median of ${base + 8}, ${base}, ${base + 6}, ${base + 2}.`, base + 4, 'Order the data, then average the two central observations.', `Ordered: ${base}, ${base + 2}, ${base + 6}, ${base + 8}. Median = (${base + 2} + ${base + 6})/2 = ${base + 4}.`, `(${base + 2}+${base + 6})/2`);
  });
  skill(entry, 'Comparing two variables', 'scatter', 'Scatter plots and association', 'Scatter plots show paired numerical observations. Association describes a trend; it does not prove that one variable causes the other.', 'A relationship between two measurements is evidence to investigate, not automatic proof of cause.', index => {
    const start = index + 2, positive = index % 2 === 0;
    return choice(`Pairs are (1, ${start + (positive ? 0 : 6)}), (2, ${start + 3}), (3, ${start + (positive ? 6 : 0)}). Is the association positive or negative?`, positive ? 'positive' : 'negative', 'As x increases, check whether y generally rises or falls.', positive ? 'Both increase together: positive association. This alone does not establish causation.' : 'As x increases, y falls: negative association. This alone does not establish causation.');
  });
  skill(entry, 'Frequency displays', 'frequency', 'Read and combine frequencies', 'A frequency display counts observations in each category. Add all frequencies for the total; the most frequent category is the mode.', 'Read counts rather than assuming the tallest bar is the largest numerical value.', index => {
    const bus = index + 3, walk = index + 7, cycle = index + 2;
    return question(`Travel frequencies are bus ${bus}, walk ${walk}, cycle ${cycle}. How many learners are represented?`, bus + walk + cycle, 'Add the three category frequencies.', `${bus} + ${walk} + ${cycle} = ${bus + walk + cycle} learners.`, `${bus}+${walk}+${cycle}`, { type: 'teaching_visuals', specs: [{ shape: 'bar_chart', labels: { categories: 'Bus,Walk,Cycle', values: `${bus},${walk},${cycle}` } }] });
  });

  entry = chapter('Probability and two-way tables', ['ccss', 'england', 'south-africa']);
  skill(entry, 'Single events', 'probability', 'Theoretical and experimental probability', 'With equally likely outcomes, probability is favourable outcomes divided by all outcomes. Experimental probability uses observed successes divided by trials.', 'An experiment estimates a chance; a model calculates it under stated assumptions.', index => {
    const favourable = index + 2, total = favourable + 8;
    return question(`A bag has ${favourable} red and 8 blue counters. One is chosen at random. Find the probability of red as a number or fraction.`, favourable / total, 'Divide the number of red counters by the total number of counters.', `P(red) = ${favourable}/${total}.`, `${favourable}/${total}`);
  });
  skill(entry, 'Combined events', 'independent', 'Independent events and sample spaces', 'Independent events do not change one another’s probabilities. Multiply their probabilities to find the chance they both happen.', 'Replacement makes repeated draws independent when the bag is mixed each time.', index => {
    const red = index + 1, total = red + 3;
    return question(`A bag has ${red} red and 3 blue counters. Draw twice, replacing the counter after the first draw. Find the probability both are red.`, (red / total) ** 2, 'Replacement keeps the second probability the same; multiply the two probabilities.', `${red}/${total} × ${red}/${total} = ${red ** 2}/${total ** 2}.`, `(${red}/${total})^2`);
  });
  skill(entry, 'Two-way tables', 'two-way', 'Relative frequency in a two-way table', 'A two-way table groups observations by two categories. A conditional relative frequency uses only the group named in the question as its denominator.', 'Choose the correct row or column total before dividing.', index => {
    const first = index + 3, total = first + 7;
    return question(`Among ${total} bus travellers, ${first} arrive before 8 am and 7 arrive later. A separate 10 learners walk. What fraction of bus travellers arrive before 8 am?`, first / total, 'Use only bus travellers in the denominator, not all learners.', `${first}/${total}; the ten walkers are outside the group asked about.`, `${first}/${total}`);
  });

  entry = chapter('Modelling, measurement and algorithms', ['england', 'south-africa'], true);
  skill(entry, 'Measurement and estimation', 'units', 'Convert area units', 'Converting area units squares the length conversion factor. Since one metre is one hundred centimetres, one square metre is ten thousand square centimetres.', 'A length conversion factor is not enough when you are measuring an area.', index => {
    const area = index + 2;
    return question(`Convert ${area} m² to cm².`, area * 10000, 'Multiply by 100 squared.', `${area} × 100² = ${area * 10000} cm².`, `${area}*100^2`);
  });
  skill(entry, 'Modelling costs', 'model', 'Build and compare a cost model', 'A model uses assumptions and variables to describe a situation. A fixed cost plus a cost per unit gives a linear total; check the units and whether the assumptions apply.', 'Comparing prices requires including the fixed charge as well as the unit charge.', index => {
    const quantity = index + 2;
    return question(`Plan A costs 12 units plus 3 per visit. Plan B costs 4 units plus 5 per visit. For ${quantity} visits, calculate cost A minus cost B.`, 8 - 2 * quantity, 'Calculate each total, then subtract B from A; a negative result means A is cheaper.', `(12 + 3 × ${quantity}) − (4 + 5 × ${quantity}) = ${8 - 2 * quantity} units.`, `(12+3*${quantity})-(4+5*${quantity})`);
  });
  skill(entry, 'Algorithms', 'algorithm', 'Trace an iterative rule', 'An algorithm is a precise sequence of steps. When a rule repeats, update the current value each time rather than repeatedly using the original input.', 'Tracing a rule by hand is a first step toward mathematical coding.', index => {
    const start = index - 3;
    return question(`Start with ${start}. Apply “double the current value, then add one” twice. Find the final value.`, 4 * start + 3, 'First find 2 × start + 1; then apply the entire rule again.', `${start} → ${2 * start + 1} → ${4 * start + 3}.`, `2*(2*(${start})+1)+1`);
  });

  return { course: { title: 'Grade 8 · International voice course', grade: 8, mode: 'international', chapters, sources, notes: 'One original, unified course informed by selected international curricula. Grade placement and names vary by country. This is not every country’s syllabus or an official alignment certificate. Construction work requires human review; numerical exercises assess only the skill shown. The final modelling chapter is a stage-wide extension.' }, lessons };
})();
window.GRADE8_CLASS_COURSE = Grade8Content.course;
window.GRADE8_CLASS_LESSONS = Grade8Content.lessons;
