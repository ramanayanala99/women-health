(function () {
  const container = document.getElementById('visualDemoModels'), status = document.getElementById('demoVoiceStatus'), models = [];
  for (const kind of MathsVisualTeaching.kinds) {
    const host = document.createElement('div'); container.append(host);
    const model = MathsVisualTeaching.mount(host, { kind }); model.setTeachingStep(2); models.push(model);
    const read = document.createElement('button'); read.type = 'button'; read.textContent = 'Read this model'; model.panel.querySelector('.mvt-actions').append(read);
    read.onclick = () => {
      if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) { status.textContent = 'Speech is unavailable in this browser. The diagrams and controls still work.'; return; }
      speechSynthesis.cancel();
      const text = model.panel.querySelector('.mvt-equation').textContent + '. ' + model.panel.querySelector('.mvt-status').textContent;
      const utterance = new SpeechSynthesisUtterance(MathsNotation.speech(text)); utterance.lang = 'en-US'; utterance.rate = .9;
      utterance.onend = () => { status.textContent = 'Model read aloud. Change a value and compare again.'; };
      utterance.onerror = () => { status.textContent = 'Audio did not play. You can still read and explore the model.'; };
      status.textContent = 'Reading the current model…'; speechSynthesis.speak(utterance);
    };
  }
  window.addEventListener('pagehide', () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); for (const model of models) model.destroy(); });
})();
