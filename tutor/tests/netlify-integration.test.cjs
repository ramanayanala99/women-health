const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { JSDOM, requestInterceptor, VirtualConsole } = require('jsdom');

const classroomResources = {
  interceptors: [requestInterceptor(request => {
    const pathname = new URL(request.url).pathname;
    if (!pathname.startsWith('/tutor/')) throw new Error('Unexpected external resource');
    return new Response(fs.readFileSync(path.join(process.cwd(), 'public', pathname)), {
      headers: { 'Content-Type': pathname.endsWith('.css') ? 'text/css' : 'application/javascript' },
    });
  })],
};

async function waitFor(predicate) {
  const deadline = Date.now() + 6000;
  while (!predicate()) {
    if (Date.now() > deadline) throw new Error('Classroom startup timed out');
    await new Promise(resolve => setTimeout(resolve, 25));
  }
}

function classroom({ failProgress = false, nativeMicrophone = false, denyMicrophone = false, browserSpeech = false, liveReady = true } = {}) {
  const requests = [];
  const errors = [];
  const microphones = [];
  const microphoneEvents = { permissionRequests: 0, stoppedTracks: 0 };
  const speechEvents = { utterances: [], cancellations: 0 };
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', error => errors.push(error));
  const dom = new JSDOM(fs.readFileSync('public/tutor/index.html', 'utf8'), {
    url: 'https://classroom.test/tutor/index.html',
    runScripts: 'dangerously',
    resources: classroomResources,
    virtualConsole,
    beforeParse(window) {
      window.AbortSignal = AbortSignal;
      window.AbortController = AbortController;
      window.scrollTo = () => {};
      window.HTMLElement.prototype.scrollIntoView = () => {};
      window.HTMLCanvasElement.prototype.getContext = () => new Proxy({}, { get: () => () => {} });
      window.HTMLMediaElement.prototype.pause = () => {};
      if (browserSpeech) {
        let currentUtterance;
        window.SpeechSynthesisUtterance = function (text) { this.text = text; };
        window.speechSynthesis = {
          getVoices: () => [{ voiceURI: 'test-voice', lang: 'en-US' }],
          addEventListener: () => {},
          speak: utterance => {
            speechEvents.utterances.push(utterance);
            currentUtterance = utterance;
            utterance.onstart?.();
          },
          cancel: () => {
            speechEvents.cancellations++;
            const cancelled = currentUtterance;
            currentUtterance = null;
            cancelled?.onerror?.({ error: 'canceled' });
          },
          finish: () => {
            const finished = currentUtterance;
            currentUtterance = null;
            finished?.onend?.();
          },
        };
      }
      if (nativeMicrophone) {
        window.SpeechRecognition = function () {
          microphones.push(this);
          this.start = () => this.onstart?.();
          this.stop = () => this.onend?.();
          this.abort = () => this.onend?.();
        };
        Object.defineProperty(window.navigator, 'mediaDevices', { value: {
          getUserMedia: async () => {
            microphoneEvents.permissionRequests++;
            if (denyMicrophone) throw Object.assign(new Error('Denied'), { name: 'NotAllowedError' });
            return { getTracks: () => [{ stop: () => { microphoneEvents.stoppedTracks++; } }] };
          },
        } });
      }
      window.fetch = async (url, options = {}) => {
        const body = options.body ? JSON.parse(options.body) : undefined;
        requests.push({ url, method: options.method || 'GET', body });
        if (url === '/api/tutor/progress') {
          if (failProgress) return Response.json({ error: 'Unavailable' }, { status: 503 });
          return Response.json(options.method === 'GET' ? { values: { 'ut-integration-check': 'restored' } } : { saved: true });
        }
        if (url === 'https://classroom.test/api/tutor/health') return Response.json({ ready: liveReady, voice: 'browser' });
        if (url === 'https://classroom.test/api/tutor/teacher') return Response.json({ message: 'Let’s use equal groups.', board_steps: ['3 × 4 = 12'], question: 'How many in three groups of four?', understanding: 'unknown' });
        throw new Error('Unexpected request: ' + url);
      };
    },
  });
  return { dom, requests, errors, microphones, microphoneEvents, speechEvents };
}

test('classroom navigation omits California and England shortcuts while retaining voice classes', async () => {
  const { dom, errors } = classroom();
  try {
    await waitFor(() => dom.window.document.querySelector('.platform-controls'));
    const navigation = dom.window.document.querySelector('.app-nav');
    assert.deepEqual(errors, []);
    assert.equal(navigation.querySelector('#california-8Nav'), null);
    assert.equal(navigation.querySelector('#england-ks3Nav'), null);
    assert.doesNotMatch(navigation.textContent, /California Grade 8|England Key Stage 3/);
    for (const buttonId of ['indiaMathsNav', 'grade7ClassNav', 'grade8ClassNav', 'visualLabNav']) {
      assert.ok(navigation.querySelector(`#${buttonId}`));
    }
  } finally {
    dom.window.close();
  }
});

test('saved learning loads before lessons; the full classroom connects to same-origin AI', async () => {
  const { dom, requests, errors } = classroom();
  try {
    const window = dom.window;
    await waitFor(() => window.document.querySelector('.platform-controls'));
    assert.deepEqual(errors, []);
    assert.equal(window.tutorStorage.getItem('ut-integration-check'), 'restored');
    assert.equal(requests[0].url, '/api/tutor/progress');
    assert.equal(window.eval('agentBase()'), 'https://classroom.test/api/tutor');
    assert.equal(window.document.getElementById('agentEndpoint').closest('details').hidden, true);
    window.eval("$('topic').value=LESSONS[0].id");
    window.document.getElementById('start').click();
    await window.document.getElementById('agentBegin').onclick('Explain equal groups to me');
    assert.ok(requests.some(request => request.url.endsWith('/api/tutor/teacher') && request.body.message === 'Explain equal groups to me'));
    assert.ok(window.document.getElementById('currentTurn').textContent.includes('equal groups'));
    window.eval('queueAgentTurn(0)');
    assert.equal(window.eval('agentTurnTimer'), null);
    window.tutorStorage.setItem('ut-integration-answer', '12');
    await waitFor(() => requests.some(request => request.body?.key === 'ut-integration-answer'));
    assert.ok(!requests.some(request => request.url.includes('workers.dev')));
    assert.equal(window.localStorage.length, 0);
  } finally {
    dom.window.close();
  }
});

test('a progress outage does not block prepared lessons or falsely report a successful save', async () => {
  const { dom, errors } = classroom({ failProgress: true });
  try {
    await waitFor(() => dom.window.document.querySelector('.platform-controls'));
    assert.deepEqual(errors, []);
    assert.equal(dom.window.tutorStorage.connected, false);
    assert.match(dom.window.document.getElementById('platformStatus').textContent, /not saved/);
    assert.ok(dom.window.eval('LESSONS.length') > 0);
    assert.ok(dom.window.document.querySelector('.classroom-safety-note'));
  } finally {
    dom.window.close();
  }
});

test('one-to-one typed conversation works while the microphone stays off, with follow-up history', async () => {
  const { dom, requests, microphoneEvents } = classroom({ nativeMicrophone: true });
  try {
    const window = dom.window;
    await waitFor(() => window.document.getElementById('startOneToOne'));
    assert.match(window.document.getElementById('conversationMicStatus').textContent, /Microphone off/);
    await window.document.getElementById('startOneToOne').onclick();
    assert.equal(microphoneEvents.permissionRequests, 0);
    const before = requests.filter(request => request.url.endsWith('/teacher')).length;
    window.document.getElementById('studentMessage').value = 'Why do we use equal groups?';
    window.document.getElementById('talkForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    await waitFor(() => requests.filter(request => request.url.endsWith('/teacher')).length > before && !window.eval('agentBusy'));
    const turn = requests.filter(request => request.url.endsWith('/teacher')).at(-1).body;
    assert.equal(turn.message, 'Why do we use equal groups?');
    assert.ok(turn.history.some(message => message.role === 'assistant'));
    assert.equal(microphoneEvents.permissionRequests, 0);
    assert.equal(window.ClassroomLiveMic.isEnabled(), false);
    assert.equal(window.document.querySelector('.history').open, true);
  } finally {
    dom.window.close();
  }
});

test('microphone requests permission only on click, can send a spoken turn, and stops for typing', async () => {
  const { dom, requests, microphones, microphoneEvents } = classroom({ nativeMicrophone: true });
  try {
    const window = dom.window;
    await waitFor(() => window.document.getElementById('startOneToOne'));
    await window.document.getElementById('startOneToOne').onclick();
    assert.equal(microphoneEvents.permissionRequests, 0);
    await window.document.getElementById('conversationMic').onclick();
    assert.equal(microphoneEvents.permissionRequests, 1);
    assert.equal(microphoneEvents.stoppedTracks, 1);
    assert.equal(window.ClassroomLiveMic.isEnabled(), true);
    assert.equal(window.document.getElementById('conversationMic').getAttribute('aria-pressed'), 'true');
    const before = requests.filter(request => request.url.endsWith('/teacher')).length;
    microphones.at(-1).onresult({ resultIndex: 0, results: [Object.assign([{ transcript: 'How do I multiply equal groups?' }], { isFinal: true })] });
    await waitFor(() => requests.filter(request => request.url.endsWith('/teacher')).length > before);
    window.document.getElementById('conversationText').onclick();
    assert.equal(window.ClassroomLiveMic.isEnabled(), false);
    assert.equal(window.document.activeElement.id, 'studentMessage');
    assert.match(window.document.getElementById('conversationMicStatus').textContent, /Microphone off/);
  } finally {
    dom.window.close();
  }
});

test('denied microphone access gives recovery instructions and keeps typed chat available', async () => {
  const { dom, microphoneEvents } = classroom({ nativeMicrophone: true, denyMicrophone: true });
  try {
    const window = dom.window;
    await waitFor(() => window.document.getElementById('startOneToOne'));
    await window.document.getElementById('conversationMic').onclick();
    assert.equal(microphoneEvents.permissionRequests, 1);
    assert.equal(window.ClassroomLiveMic.isEnabled(), false);
    assert.match(window.document.getElementById('conversationMicStatus').textContent, /blocked/);
    assert.equal(window.document.getElementById('conversationMicHelp').open, true);
    assert.equal(window.document.getElementById('conversationMic').disabled, false);
    await window.document.getElementById('startOneToOne').onclick();
    assert.equal(window.eval('agentEnabled'), true);
  } finally {
    dom.window.close();
  }
});

test('unsupported voice input does not request recorded audio or prevent conversation', async () => {
  const { dom, requests } = classroom();
  try {
    const window = dom.window;
    await waitFor(() => window.document.getElementById('startOneToOne'));
    await window.document.getElementById('conversationMic').onclick();
    assert.match(window.document.getElementById('conversationMicStatus').textContent, /unavailable/);
    assert.equal(window.document.activeElement.id, 'studentMessage');
    assert.ok(!requests.some(request => request.url.endsWith('/transcribe')));
    await window.document.getElementById('startOneToOne').onclick();
    assert.equal(window.eval('agentEnabled'), true);
  } finally {
    dom.window.close();
  }
});

test('the microphone indicator also follows the existing single-reply Speak button', async () => {
  const { dom, microphones } = classroom({ nativeMicrophone: true });
  try {
    const window = dom.window;
    await waitFor(() => window.document.getElementById('startOneToOne'));
    await window.document.getElementById('startOneToOne').onclick();
    window.document.getElementById('mic').click();
    await waitFor(() => microphones.length > 0 && window.document.getElementById('conversationMic').textContent === 'Stop listening');
    assert.match(window.document.getElementById('conversationMicStatus').textContent, /Microphone listening/);
    await window.document.getElementById('conversationMic').onclick();
    assert.equal(window.eval('recognition'), null);
    assert.equal(window.document.getElementById('conversationMic').getAttribute('aria-pressed'), 'false');
  } finally {
    dom.window.close();
  }
});

test('spoken conversation answers aloud, asks a question, listens, and accepts interruptions with history', async () => {
  const { dom, requests, microphones, microphoneEvents, speechEvents } = classroom({ nativeMicrophone: true, browserSpeech: true });
  try {
    const window = dom.window;
    await waitFor(() => window.document.getElementById('startSpokenConversation'));
    assert.equal(microphoneEvents.permissionRequests, 0);
    await window.document.getElementById('startSpokenConversation').onclick();
    assert.equal(microphoneEvents.permissionRequests, 1);
    assert.equal(window.ClassroomLiveMic.isEnabled(), true);
    assert.equal(window.document.getElementById('stopSpokenConversation').hidden, false);
    assert.match(speechEvents.utterances.at(-1).text, /Let’s use equal groups.*How many in three groups of four/);
    const first = requests.filter(request => request.url.endsWith('/teacher')).at(-1).body;
    assert.equal(first.context.purpose, 'one_to_one_conversation');
    assert.equal(first.context.conversation_mode, 'spoken');
    const cancellations = speechEvents.cancellations;
    const count = requests.filter(request => request.url.endsWith('/teacher')).length;
    microphones.at(-1).onresult({ resultIndex: 0, results: [Object.assign([{ transcript: 'What does multiplication mean?' }], { isFinal: true })] });
    await waitFor(() => requests.filter(request => request.url.endsWith('/teacher')).length > count && !window.eval('agentBusy'));
    const second = requests.filter(request => request.url.endsWith('/teacher')).at(-1).body;
    assert.equal(second.message, 'What does multiplication mean?');
    assert.ok(second.history.some(message => message.role === 'assistant'));
    assert.ok(speechEvents.cancellations > cancellations);
    assert.ok(speechEvents.utterances.length >= 2);
    window.speechSynthesis.finish();
    await waitFor(() => window.document.getElementById('spokenConversationStatus').textContent.includes('listening'));
    assert.equal(window.eval('speechBusy'), false);
    assert.equal(window.eval('agentTurnTimer'), null);
    assert.equal(window.ClassroomLiveMic.isEnabled(), true);
  } finally {
    dom.window.close();
  }
});

test('spoken stop command stops microphone and audio without making another AI request', async () => {
  const { dom, requests, microphones, speechEvents } = classroom({ nativeMicrophone: true, browserSpeech: true });
  try {
    const window = dom.window;
    await waitFor(() => window.document.getElementById('startSpokenConversation'));
    await window.document.getElementById('startSpokenConversation').onclick();
    const count = requests.filter(request => request.url.endsWith('/teacher')).length;
    const cancellations = speechEvents.cancellations;
    microphones.at(-1).onresult({ resultIndex: 0, results: [Object.assign([{ transcript: 'Stop conversation' }], { isFinal: true })] });
    assert.equal(window.ClassroomLiveMic.isEnabled(), false);
    assert.equal(window.eval('agentEnabled'), false);
    assert.equal(window.eval('speechBusy'), false);
    assert.equal(requests.filter(request => request.url.endsWith('/teacher')).length, count);
    assert.ok(speechEvents.cancellations > cancellations);
    assert.equal(window.document.getElementById('stopSpokenConversation').hidden, true);
    assert.match(window.document.getElementById('spokenConversationStatus').textContent, /Conversation stopped/);
  } finally {
    dom.window.close();
  }
});

test('a missing live AI connection is reported before requesting microphone permission', async () => {
  const { dom, requests, microphoneEvents } = classroom({ nativeMicrophone: true, browserSpeech: true, liveReady: false });
  try {
    const window = dom.window;
    await waitFor(() => window.document.getElementById('startSpokenConversation'));
    await window.document.getElementById('startSpokenConversation').onclick();
    assert.equal(microphoneEvents.permissionRequests, 0);
    assert.equal(window.ClassroomLiveMic.isEnabled(), false);
    assert.ok(!requests.some(request => request.url.endsWith('/teacher')));
    assert.match(window.document.getElementById('spokenConversationStatus').textContent, /not connected yet/);
    assert.equal(window.document.getElementById('startSpokenConversation').disabled, false);
  } finally {
    dom.window.close();
  }
});

test('blocked embedded previews are explained without attempting audio capture or inference', async () => {
  const { dom, requests, microphoneEvents } = classroom({ nativeMicrophone: true, browserSpeech: true });
  try {
    const window = dom.window;
    await waitFor(() => window.document.getElementById('startSpokenConversation'));
    window.document.permissionsPolicy = { allowsFeature: () => false };
    await window.document.getElementById('startSpokenConversation').onclick();
    assert.equal(microphoneEvents.permissionRequests, 0);
    assert.ok(!requests.some(request => request.url.endsWith('/teacher')));
    assert.match(window.document.getElementById('spokenConversationStatus').textContent, /new tab/);
    assert.equal(window.document.getElementById('conversationMicHelp').open, true);
  } finally {
    dom.window.close();
  }
});

test('typing can continue the same spoken conversation with the microphone turned off', async () => {
  const { dom, requests } = classroom({ nativeMicrophone: true, browserSpeech: true });
  try {
    const window = dom.window;
    await waitFor(() => window.document.getElementById('startSpokenConversation'));
    await window.document.getElementById('startSpokenConversation').onclick();
    window.document.getElementById('conversationText').onclick();
    assert.equal(window.ClassroomLiveMic.isEnabled(), false);
    assert.equal(window.eval('agentEnabled'), true);
    const count = requests.filter(request => request.url.endsWith('/teacher')).length;
    window.document.getElementById('studentMessage').value = 'Can you explain that more simply?';
    window.document.getElementById('talkForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
    await waitFor(() => requests.filter(request => request.url.endsWith('/teacher')).length > count && !window.eval('agentBusy'));
    const turn = requests.filter(request => request.url.endsWith('/teacher')).at(-1).body;
    assert.equal(turn.context.conversation_mode, 'typed');
    assert.ok(turn.history.some(message => message.role === 'assistant'));
  } finally {
    dom.window.close();
  }
});

test('leaving live AI mode stops the spoken microphone and clears conversation-specific context', async () => {
  const { dom } = classroom({ nativeMicrophone: true, browserSpeech: true });
  try {
    const window = dom.window;
    await waitFor(() => window.document.getElementById('startSpokenConversation'));
    await window.document.getElementById('startSpokenConversation').onclick();
    window.document.getElementById('agentEnd').click();
    assert.equal(window.ClassroomLiveMic.isEnabled(), false);
    assert.equal(window.NetlifyOneToOne.isActive(), false);
    assert.notEqual(window.eval('agentContext().purpose'), 'one_to_one_conversation');
    assert.equal(window.document.getElementById('stopSpokenConversation').hidden, true);
  } finally {
    dom.window.close();
  }
});

test('denied permission never starts a spoken AI conversation', async () => {
  const { dom, requests, microphoneEvents } = classroom({ nativeMicrophone: true, browserSpeech: true, denyMicrophone: true });
  try {
    const window = dom.window;
    await waitFor(() => window.document.getElementById('startSpokenConversation'));
    await window.document.getElementById('startSpokenConversation').onclick();
    assert.equal(microphoneEvents.permissionRequests, 1);
    assert.equal(window.ClassroomLiveMic.isEnabled(), false);
    assert.ok(!requests.some(request => request.url.endsWith('/teacher')));
    assert.match(window.document.getElementById('spokenConversationStatus').textContent, /Microphone access is needed/);
  } finally {
    dom.window.close();
  }
});
