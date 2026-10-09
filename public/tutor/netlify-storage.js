(function () {
  const values = Object.create(null);
  const pending = new Map();
  let connected = false;
  let loadingFailed = false;
  let flushing = false;
  let saveTimer;
  const status = text => {
    const element = document.getElementById('platformStatus');
    if (element) element.textContent = text;
  };
  const request = async (method, body) => {
    const response = await fetch('/api/tutor/progress', {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Progress connection unavailable.');
    return result;
  };
  async function flush() {
    if (!connected || flushing || pending.size === 0) return;
    flushing = true;
    status('Saving your learning…');
    try {
      while (pending.size) {
        const [key, value] = pending.entries().next().value;
        await request('POST', { key, value });
        if (pending.get(key) === value) pending.delete(key);
      }
      status('Your learning is saved securely · Available with this browser for 30 days.');
    } catch {
      status('Your latest changes are not saved. Choose Retry saving before leaving.');
    } finally {
      flushing = false;
    }
  }
  window.tutorStorage = {
    get length() { return Object.keys(values).length; },
    key(index) { return Object.keys(values)[index] ?? null; },
    get connected() { return connected; },
    get unsaved() { return pending.size > 0; },
    getItem(key) { return values[String(key)] ?? null; },
    setItem(key, value) {
      key = String(key);
      value = String(value);
      values[key] = value;
      pending.set(key, value);
      if (connected) {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(flush, 250);
      }
    },
    removeItem(key) {
      key = String(key);
      delete values[key];
      pending.set(key, null);
      if (connected) {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(flush, 250);
      }
    },
    async hydrate() {
      try {
        const result = await request('GET');
        if (!result.values || typeof result.values !== 'object') throw new Error('Invalid progress response.');
        for (const [key, value] of Object.entries(result.values)) {
          if (!pending.has(key) && typeof value === 'string') values[key] = value;
        }
        connected = true;
        loadingFailed = false;
        status('Your classroom is ready · Learning is saved securely for 30 days.');
        await flush();
      } catch {
        loadingFailed = true;
        status('Progress is unavailable. Lessons still work, but your changes are not saved. Choose Retry saving to reconnect.');
      }
    },
    async retry() {
      if (loadingFailed) {
        status('Reconnecting your saved learning…');
        await this.hydrate();
        if (connected) {
          await flush();
          if (!pending.size) location.reload();
        }
      } else {
        await flush();
      }
    },
    async clear() {
      if (flushing) throw new Error('Please wait for the current save to finish.');
      clearTimeout(saveTimer);
      await request('DELETE');
      pending.clear();
      Object.keys(values).forEach(key => delete values[key]);
      location.reload();
    },
  };
  window.addEventListener('beforeunload', event => {
    if (pending.size) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
})();
