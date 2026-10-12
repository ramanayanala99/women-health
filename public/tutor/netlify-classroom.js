(function () {
  if (!document.currentScript) return;
  const endpoint = document.getElementById('agentEndpoint');
  const password = document.getElementById('agentPassword');
  endpoint.value = location.origin + '/api/tutor';
  password.value = 'netlify-managed';
  agentBase = () => location.origin + '/api/tutor';
  const settings = endpoint.closest('details');
  if (settings) settings.hidden = true;
  document.getElementById('agentVoice').checked = true;
  const voiceLabel = document.getElementById('agentVoice').closest('label');
  if (voiceLabel) {
    for (const child of voiceLabel.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) child.textContent = ' Read AI replies aloud using browser voice';
    }
  }
  let voiceRevision = 0;
  let currentUtterance = null;
  const priorStopSpeech = stopSpeech;
  stopSpeech = function (...args) {
    voiceRevision++;
    currentUtterance = null;
    return priorStopSpeech(...args);
  };
  playAgentVoice = async (text, generation) => {
    if (generation !== agentGeneration || !agentEnabled) return;
    animateAgentDiagrams();
    if (document.getElementById('agentVoice').checked && 'speechSynthesis' in window && window.SpeechSynthesisUtterance) {
      stopSpeech();
      const revision = voiceRevision;
      const spoken = window.MathsNotation?.speech(text) || text;
      const utterance = new SpeechSynthesisUtterance(spoken);
      currentUtterance = utterance;
      utterance.lang = document.getElementById('language').value || 'en-US';
      utterance.rate = Number(document.getElementById('speechRate').value || 0.9);
      const voices = speechSynthesis.getVoices();
      const chosen = voices.find(voice => voice.voiceURI === document.getElementById('teacherVoice').value) || voices.find(voice => voice.lang.toLowerCase().startsWith(utterance.lang.slice(0, 2).toLowerCase()));
      if (chosen) utterance.voice = chosen;
      const active = () => revision === voiceRevision && generation === agentGeneration && agentEnabled;
      const finish = error => {
        if (!active()) return;
        clearTimeout(speechWatchdog);
        speechBusy = false;
        currentUtterance = null;
        ClassroomConversation.setAudio('listening');
        if (error) document.getElementById('speechStatus').textContent = 'The tutor could not play audio. Press Hear it again, or read the reply on the board.';
      };
      speechBusy = true;
      utterance.onstart = () => {
        if (active()) ClassroomConversation.setAudio('teacher_speaking');
      };
      utterance.onend = () => finish(false);
      utterance.onerror = () => finish(true);
      speechWatchdog = setTimeout(() => {
        if (!active()) return;
        speechSynthesis.cancel();
        finish(true);
      }, Math.min(60000, Math.max(15000, text.length * 110)));
      ClassroomLiveMic.rememberTutor(text);
      ClassroomLiveMic.rememberTutor(spoken);
      try { speechSynthesis.speak(currentUtterance); } catch { finish(true); }
    } else {
      queueAgentTurn(agentQuestion ? 10000 : 120);
    }
  };
  const originalRequest = agentRequest;
  agentRequest = (path, body, signal) => {
    if (path === '/voice') return Promise.reject(new Error('Use browser voice in this classroom.'));
    return originalRequest(path, body, signal);
  };
  queueAgentTurn = () => {
    clearTimeout(agentTurnTimer);
    agentTurnTimer = null;
  };
  document.getElementById('agentStatus').textContent = 'AI conversation uses a secure Netlify connection. Prepared lessons are always available.';
  document.getElementById('settingsNotice').textContent = 'Voice uses your browser. Microphone support depends on your browser and permission. AI conversations use Netlify AI credits. Do not share private information.';
  document.getElementById('workStatus').textContent = 'Your scratchpad stays in this session. Type your working to share it with the tutor; handwriting recognition is not connected.';
  const controls = document.createElement('div');
  controls.className = 'platform-controls';
  const retry = document.createElement('button');
  retry.textContent = 'Retry saving';
  retry.onclick = async () => {
    retry.disabled = true;
    await tutorStorage.retry();
    retry.disabled = false;
  };
  const clear = document.createElement('button');
  clear.textContent = 'Delete my saved learning';
  const confirmation = document.createElement('div');
  confirmation.hidden = true;
  confirmation.className = 'platform-delete-confirmation';
  const warning = document.createElement('span');
  warning.textContent = 'Delete all saved lessons, answers, and settings for this browser? This cannot be undone. ';
  const confirm = document.createElement('button');
  confirm.textContent = 'Yes, delete my learning';
  confirm.onclick = async () => {
    confirm.disabled = true;
    try { await tutorStorage.clear(); } catch (error) {
      document.getElementById('platformStatus').textContent = error.message;
      confirm.disabled = false;
    }
  };
  const cancel = document.createElement('button');
  cancel.textContent = 'Keep my learning';
  cancel.onclick = () => { confirmation.hidden = true; };
  clear.onclick = () => { confirmation.hidden = false; confirm.focus(); };
  confirmation.append(warning, confirm, cancel);
  controls.append(retry, clear, confirmation);
  document.getElementById('platformStatus').after(controls);
  const note = document.createElement('p');
  note.className = 'classroom-safety-note';
  note.textContent = 'Your AI tutor is a learning companion, not a human teacher. Check important answers with a teacher or trusted adult. Learning is linked to a secure browser cookie, not an account; clearing cookies loses access. Names, answers, and lesson history are saved for up to 30 days. Your question and recent lesson context are sent to the AI service when you use conversation. Microphone recognition may use your browser’s speech service. Use a nickname, not personal details.';
  document.body.appendChild(note);
})();
