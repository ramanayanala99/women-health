(function () {
  if (!document.currentScript) return;
  const input = document.getElementById('studentMessage');
  const panel = document.createElement('section');
  panel.className = 'one-to-one-controls';
  panel.setAttribute('aria-labelledby', 'oneToOneHeading');
  const heading = document.createElement('h3');
  heading.id = 'oneToOneHeading';
  heading.textContent = 'A conversation, just for you';
  const description = document.createElement('p');
  description.textContent = 'Talk naturally with your maths tutor. Ask a question, hear a short answer, and try the tutor’s follow-up question. You can interrupt or type whenever you like.';
  const actions = document.createElement('div');
  actions.className = 'one-to-one-actions';
  const chat = document.createElement('button');
  chat.id = 'startOneToOne';
  chat.type = 'button';
  chat.textContent = 'Start one-to-one chat';
  const talking = document.createElement('button');
  talking.id = 'startSpokenConversation';
  talking.type = 'button';
  talking.className = 'primary';
  talking.textContent = 'Start talking with your tutor';
  const stopTalking = document.createElement('button');
  stopTalking.id = 'stopSpokenConversation';
  stopTalking.type = 'button';
  stopTalking.textContent = 'Stop conversation';
  stopTalking.hidden = true;
  const spokenStatus = document.createElement('p');
  spokenStatus.id = 'spokenConversationStatus';
  spokenStatus.setAttribute('role', 'status');
  spokenStatus.textContent = 'Spoken conversation checks the live tutor connection, then asks for microphone permission. No listening starts automatically.';
  const microphone = document.createElement('button');
  microphone.id = 'conversationMic';
  microphone.type = 'button';
  microphone.setAttribute('aria-controls', 'conversationMicStatus conversationMicHelp');
  const typing = document.createElement('button');
  typing.id = 'conversationText';
  typing.type = 'button';
  typing.textContent = 'Type instead';
  const status = document.createElement('p');
  status.id = 'conversationMicStatus';
  status.className = 'conversation-mic-status';
  status.setAttribute('role', 'status');
  const help = document.createElement('details');
  help.id = 'conversationMicHelp';
  const summary = document.createElement('summary');
  summary.textContent = 'Microphone off or blocked?';
  const instructions = document.createElement('p');
  instructions.textContent = 'Click Turn microphone on, then choose Allow in the browser prompt. If access was blocked, open this site’s permissions beside the address bar, allow Microphone, and try again. Check your device is not muted. Typing works without microphone access.';
  const open = document.createElement('a');
  open.href = location.href;
  open.target = '_blank';
  open.rel = 'noopener noreferrer';
  open.textContent = 'Open classroom in a new tab';
  help.append(summary, instructions, open);
  actions.append(talking, stopTalking, chat, microphone, typing);
  panel.append(heading, description, actions, spokenStatus, status, help);
  document.getElementById('teacherReply').prepend(panel);
  let requesting = false;
  let dedicatedChat = false;
  let spokenConversation = false;
  let startingSpokenConversation = false;
  let spokenRun = 0;
  window.NetlifyOneToOne = { isActive: () => dedicatedChat && agentEnabled };
  const priorEndAgent = endAgent;
  endAgent = function (...args) {
    const wasSpoken = spokenConversation || startingSpokenConversation;
    const result = priorEndAgent(...args);
    dedicatedChat = false;
    spokenConversation = false;
    startingSpokenConversation = false;
    if (wasSpoken) {
      spokenRun++;
      ClassroomLiveMic.stop();
      stopManualRecognition();
      spokenStatus.textContent = 'Spoken conversation ended. The microphone is off.';
    }
    renderSpokenControls();
    return result;
  };
  const priorContext = agentContext;
  agentContext = function () {
    const context = priorContext();
    if (dedicatedChat && agentEnabled) {
      context.purpose = 'one_to_one_conversation';
      context.conversation_mode = spokenConversation ? 'spoken' : 'typed';
    }
    return context;
  };
  const priorAsk = askAgent;
  askAgent = async function (text) {
    if (spokenConversation) ClassroomConversation.setAudio('processing');
    return priorAsk(text);
  };
  document.getElementById('agentBegin').addEventListener('click', () => { dedicatedChat = false; });
  document.getElementById('agentEnd').addEventListener('click', () => { dedicatedChat = false; });
  const recognitionAvailable = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  function stopManualRecognition() {
    if (!recognition) return;
    const activeRecognition = recognition;
    recognition = null;
    try { activeRecognition.abort(); } catch {
      try { activeRecognition.stop(); } catch {}
    }
    document.getElementById('mic').textContent = 'Speak';
  }
  function updateMicrophone() {
    const enabled = Boolean(window.ClassroomLiveMic?.isEnabled());
    const manualListening = !enabled && Boolean(recognition);
    microphone.disabled = requesting;
    microphone.textContent = requesting ? 'Requesting microphone…' : enabled ? 'Turn microphone off' : manualListening ? 'Stop listening' : 'Turn microphone on';
    microphone.setAttribute('aria-pressed', String((enabled || manualListening) && !requesting));
    if (requesting) status.textContent = 'Choose Allow in your browser’s microphone prompt. You can still type.';
    else if (enabled) status.textContent = 'Microphone on · Speak your question or answer. Use headphones to avoid echo.';
    else if (manualListening) status.textContent = 'Microphone listening · Speak this reply, or choose Type instead.';
    else if (!recognitionAvailable) status.textContent = 'Voice recognition is unavailable in this browser. Your one-to-one chat still works by typing.';
    else status.textContent = 'Microphone off · You can still have a one-to-one conversation by typing below.';
  }
  chat.onclick = async () => {
    dedicatedChat = true;
    if (agentEnabled) {
      UniversalClassroom.openPanel('tutor');
      input.focus();
      return;
    }
    chat.disabled = true;
    chat.textContent = 'Starting your conversation…';
    try {
      await document.getElementById('agentBegin').onclick('Start a one-to-one conversation about my selected maths topic. Briefly introduce the idea, then ask me one easy question and wait for my reply. I can type if my microphone is off.');
      UniversalClassroom.openPanel('tutor');
      document.querySelector('.history').open = true;
    } finally {
      chat.disabled = false;
      chat.textContent = agentEnabled ? 'Continue my conversation' : 'Start one-to-one chat';
    }
  };
  function renderSpokenControls() {
    talking.disabled = startingSpokenConversation;
    talking.textContent = startingSpokenConversation ? 'Connecting your spoken tutor…' : spokenConversation ? 'Continue talking' : 'Start talking with your tutor';
    talking.setAttribute('aria-pressed', String(spokenConversation));
    stopTalking.hidden = !spokenConversation && !startingSpokenConversation;
  }
  function stopSpokenConversation() {
    spokenRun++;
    spokenConversation = false;
    startingSpokenConversation = false;
    dedicatedChat = false;
    ClassroomLiveMic.stop();
    stopManualRecognition();
    if (agentEnabled) endAgent(false);
    pauseAdvance(true);
    ClassroomConversation.setAudio('paused');
    spokenStatus.textContent = 'Conversation stopped. The microphone is off. Start again whenever you are ready.';
    updateMicrophone();
    renderSpokenControls();
  }
  stopTalking.onclick = stopSpokenConversation;
  talking.onclick = async () => {
    const run = ++spokenRun;
    if (!recognitionAvailable || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      spokenStatus.textContent = 'This browser does not support both listening and spoken replies. You can use one-to-one typed chat instead.';
      help.open = true;
      return;
    }
    const blocked = ClassroomAccess.blocked();
    if (blocked) {
      spokenStatus.textContent = blocked + ' Open the classroom in a new tab, then press Start talking there.';
      help.open = true;
      return;
    }
    startingSpokenConversation = true;
    spokenStatus.textContent = 'Checking that the live tutor is connected…';
    renderSpokenControls();
    try {
      const response = await agentRequest('/health', null, AbortSignal.timeout(10000));
      const health = await response.json();
      if (run !== spokenRun) return;
      if (!health.ready) throw new Error('Tutor unavailable');
      if (!ClassroomLiveMic.isEnabled()) await microphone.onclick();
      if (run !== spokenRun) return;
      if (!ClassroomLiveMic.isEnabled()) {
        spokenStatus.textContent = 'Microphone access is needed to talk. Allow it in your browser, or continue by typing.';
        return;
      }
      spokenConversation = true;
      dedicatedChat = true;
      document.getElementById('agentVoice').checked = true;
      if (!agentEnabled) await document.getElementById('agentBegin').onclick('Greet me warmly and start a natural spoken maths conversation. Ask what I would like help with, or offer one simple question about my selected topic. Answer my questions directly and ask just one follow-up at a time. Wait for me to speak.');
      else await askAgent('Let’s continue our conversation by speaking. Answer naturally and ask me one short question, then wait for my reply.');
      if (run !== spokenRun) return;
      UniversalClassroom.openPanel('tutor');
      document.querySelector('.history').open = true;
      if (document.getElementById('turnStatus').textContent.startsWith('You can retry')) {
        ClassroomLiveMic.stop();
        spokenConversation = false;
        spokenStatus.textContent = 'The live tutor could not answer. Retry when the Netlify AI connection is available; your prepared lessons still work.';
      } else {
        spokenStatus.textContent = 'You can talk normally now. The tutor answers aloud, asks a question, and waits for you. Interrupt to ask something else, or press Stop conversation to finish.';
      }
    } catch {
      if (run !== spokenRun) return;
      ClassroomLiveMic.stop();
      spokenConversation = false;
      spokenStatus.textContent = 'The live tutor is not connected yet. The Netlify tutor endpoint must be deployed with AI enabled before spoken conversation can answer you. Prepared lessons are still available.';
    } finally {
      if (run === spokenRun) {
        startingSpokenConversation = false;
        renderSpokenControls();
        updateMicrophone();
      }
    }
  };
  const priorStudent = studentTurn;
  studentTurn = function (text) {
    if (spokenConversation && /^(?:stop|end|finish)(?: (?:the|our|this))? (?:conversation|chat|talking)[.!]?$/i.test(String(text).trim())) return stopSpokenConversation();
    return priorStudent(text);
  };
  microphone.onclick = async () => {
    if (ClassroomLiveMic.isEnabled()) {
      ClassroomLiveMic.stop();
      updateMicrophone();
      return;
    }
    if (recognition) {
      stopManualRecognition();
      updateMicrophone();
      return;
    }
    if (!recognitionAvailable) {
      updateMicrophone();
      help.open = true;
      input.focus();
      return;
    }
    requesting = true;
    updateMicrophone();
    try {
      await document.getElementById('classMicrophone').onclick();
    } finally {
      requesting = false;
      updateMicrophone();
      if (!ClassroomLiveMic.isEnabled()) {
        status.textContent = document.getElementById('speechStatus').textContent + ' You can continue by typing below.';
        help.open = true;
      }
    }
  };
  typing.onclick = () => {
    ClassroomLiveMic.stop();
    stopManualRecognition();
    spokenConversation = false;
    spokenStatus.textContent = 'Listening is off. You can continue the same conversation by typing.';
    renderSpokenControls();
    updateMicrophone();
    UniversalClassroom.openPanel('tutor');
    input.focus();
  };
  const liveToggle = document.getElementById('classMicrophone');
  new MutationObserver(updateMicrophone).observe(liveToggle, { childList: true, attributes: true, attributeFilter: ['aria-pressed'] });
  const speechStatus = document.getElementById('speechStatus');
  new MutationObserver(() => {
    updateMicrophone();
    if (requesting || ClassroomLiveMic.isEnabled()) return;
    if (/microphone|recognition|secure HTTPS|embedded view/i.test(speechStatus.textContent) && /unavailable|blocked|denied|could not|not-allowed|audio-capture|secure HTTPS|embedded view/i.test(speechStatus.textContent)) {
      status.textContent = speechStatus.textContent + ' You can continue by typing below.';
      help.open = true;
    }
  }).observe(speechStatus, { childList: true, characterData: true, subtree: true });
  document.getElementById('replyConnection').hidden = true;
  const conversationIndicator = document.getElementById('classConversationStatus');
  new MutationObserver(() => {
    if (spokenConversation) spokenStatus.textContent = conversationIndicator.textContent;
  }).observe(conversationIndicator, { childList: true, characterData: true, subtree: true });
  document.getElementById('agentEnd').addEventListener('click', () => {
    if (spokenConversation || startingSpokenConversation) stopSpokenConversation();
  });
  window.addEventListener('pagehide', () => {
    spokenRun++;
    spokenConversation = false;
    stopSpeech();
  });
  input.placeholder = 'Type your answer or maths question — microphone optional';
  updateMicrophone();
})();
