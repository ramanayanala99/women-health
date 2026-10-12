(function (root) {
  const superscripts = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '+': '⁺', n: 'ⁿ' };
  const ordinary = Object.fromEntries(Object.entries(superscripts).map(([plain, raised]) => [raised, plain]));
  const smallNumbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const exponentName = value => value.startsWith('-') ? 'minus ' + exponentName(value.slice(1)) : value.startsWith('+') ? exponentName(value.slice(1)) : smallNumbers[Number(value)] || value;
  function display(value) {
    return String(value).replace(/\b(\d+(?:\.\d+)?)[eE]([+-]?\d+)\b/g, (_, coefficient, exponent) => `${coefficient} × 10^${Number(exponent)}`).replace(/\^\(([\dn]+\s*[+-]\s*[\dn]+)\)/g, (_, expression) => [...expression.replace(/\s/g, '')].map(character => superscripts[character]).join('')).replace(/\^(?:\(([+-]?\d+|n)\)|([+-]?\d+|n)(?![\dA-Za-z.]))/g, (_, bracketed, plain) => [...(bracketed || plain)].map(character => superscripts[character]).join('')).replace(/\bsqrt\(/g, '√(').replace(/\bpi\b/g, 'π');
  }
  function scientific(value) {
    if (!Number.isFinite(value)) throw new TypeError('Scientific notation needs a finite number.');
    if (value === 0) return { coefficient: 0, exponent: 0, text: '0' };
    const [coefficient, exponent] = value.toExponential().split('e');
    return { coefficient: Number(coefficient), exponent: Number(exponent), text: display(`${Number(coefficient)} × 10^${Number(exponent)}`) };
  }
  function speechWithMap(value) {
    const source = String(value);
    let text = source, positions = Array.from({ length: source.length }, (_, index) => index);
    function replace(pattern, replacement) {
      let result = '', mapping = [], cursor = 0;
      for (const match of text.matchAll(pattern)) {
        result += text.slice(cursor, match.index); mapping.push(...positions.slice(cursor, match.index));
        const changed = replacement(...match);
        result += changed; mapping.push(...Array(changed.length).fill(positions[match.index] ?? source.length)); cursor = match.index + match[0].length;
      }
      result += text.slice(cursor); mapping.push(...positions.slice(cursor)); text = result; positions = mapping;
    }
    replace(/(\d+(?:\.\d+)?\s*)(km|cm|mm|m)(?:\^([23])|([²³]))|\b(km|cm|mm)(?:\^([23])|([²³]))/g, (_, quantity, unit, power, raised, alternateUnit, alternatePower, alternateRaised) => {
      const names = { km: 'kilometres', cm: 'centimetres', mm: 'millimetres', m: 'metres' };
      return (quantity ? quantity.trim() + ' ' : '') + (power === '3' || raised === '³' || alternatePower === '3' || alternateRaised === '³' ? 'cubic ' : 'square ') + names[unit || alternateUnit];
    });
    replace(/\b(in|to|from|of)\s+m(?:\^([23])|([²³]))/g, (_, prefix, power, raised) => prefix + (power === '3' || raised === '³' ? ' cubic metres' : ' square metres'));
    replace(/\b(\d+(?:\.\d+)?\s*)(km|cm|mm|m)\b/g, (_, quantity, unit) => quantity.trim() + ' ' + ({ km: 'kilometres', cm: 'centimetres', mm: 'millimetres', m: 'metres' })[unit]);
    replace(/(?:sqrt|√)\(([^()]+)\)|√([\d.]+|[a-zA-Z])/g, (_, expression, simple) => {
      const body = expression || simple;
      return /[+*/×÷^²³]|[\dx-z]\s*[-−]/.test(body) ? ' square root of the quantity ' + body + ' end quantity ' : ' square root of ' + body + ' ';
    });
    replace(/\b(\d+(?:\.\d+)?)[eE]([+-]?\d+)\b/g, (_, coefficient, exponent) => `${coefficient} × 10^${Number(exponent)}`);
    replace(/([\d.]+|[a-zA-Z])\^\(([\dn]+\s*[+-]\s*[\dn]+)\)/g, (_, base, expression) => (base === '10' ? 'ten' : base) + ' to the power of the quantity ' + expression);
    replace(/([\d.]+|[a-zA-Z])(?:\^\(([+-]?\d+|n)\)|\^([+-]?\d+|n)(?![\dA-Za-z.])|([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺ⁿ]+))/g, (_, base, bracketed, plain, raised) => {
      const exponent = bracketed || plain || [...raised].map(character => ordinary[character]).join('');
      return (base === '10' ? 'ten' : base) + (exponent === '2' ? ' squared' : exponent === '3' ? ' cubed' : ' to the power of ' + (/[\dn][+-][\dn]/.test(exponent) ? 'the quantity ' + exponent : exponentName(exponent)));
    });
    replace(/(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)/g, (_, numerator, denominator) => numerator + ' over ' + denominator);
    replace(/[½¼¾⅓⅔]/g, fraction => ({ '½': 'one half', '¼': 'one quarter', '¾': 'three quarters', '⅓': 'one third', '⅔': 'two thirds' })[fraction]);
    replace(/\b(\d+)\.(\d+)\b/g, (_, whole, digits) => whole + ' point ' + [...digits].map(digit => smallNumbers[Number(digit)]).join(' '));
    replace(/\bpi\b|π/g, () => ' pi ');
    replace(/×|\*/g, () => ' times '); replace(/÷|\//g, () => ' divided by ');
    replace(/≤/g, () => ' is less than or equal to '); replace(/≥/g, () => ' is greater than or equal to ');
    replace(/≠/g, () => ' is not equal to '); replace(/≈/g, () => ' is approximately '); replace(/=/g, () => ' equals ');
    replace(/</g, () => ' is less than '); replace(/>/g, () => ' is greater than ');
    replace(/\+/g, () => ' plus '); replace(/−/g, () => ' minus ');
    replace(/(?<=[\d)xyz])\s*-\s*(?=[\d(xyz])/g, () => ' minus '); replace(/(?<!\w)-(?=\d)/g, () => 'minus ');
    replace(/°/g, () => ' degrees '); replace(/%/g, () => ' percent ');
    for (let depth = 0; depth < 8 && /\([^()]*\)/.test(text); depth++) replace(/\(([^()]*)\)/g, (_, body) => /\d|[+*/×÷−=]|\b[xyzabmn]\b/.test(body) ? ' open bracket ' + body + ' close bracket ' : ' ' + body + ' ');
    replace(/\s+/g, () => ' ');
    const leading = text.length - text.trimStart().length; text = text.trim(); positions = positions.slice(leading, leading + text.length);
    return { text, sourceIndex: index => positions[Math.max(0, Math.min(positions.length, index))] ?? source.length };
  }
  root.MathsNotation = Object.freeze({ display, scientific, speech: value => speechWithMap(value).text, speechWithMap });
})(globalThis);
