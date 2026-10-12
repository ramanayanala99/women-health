import { randomUUID, createHash } from 'node:crypto';

function sanitizeContext(value, depth = 0) {
  if (typeof value === 'string') return value.slice(0, 900);
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  if (value === null || depth > 3) return null;
  if (Array.isArray(value)) return value.slice(0, 8).map(item => sanitizeContext(item, depth + 1));
  if (typeof value === 'object') return Object.fromEntries(Object.entries(value).slice(0, 35).map(([key, item]) => [key.slice(0, 60), sanitizeContext(item, depth + 1)]));
  return null;
}

export function createTutorService({ loadProgress, saveProgress, clearProgress, reserveTurn, reply, ready }) {
  return async (request, clientAddress = 'unknown') => {
    const url = new URL(request.url);
    const path = url.pathname.replace(/^\/api\/tutor/, '') || '/';
    const responseHeaders = { 'Cache-Control': 'no-store' };
    const json = (body, status = 200) => Response.json(body, { status, headers: responseHeaders });
    const origin = request.headers.get('origin');
    if (origin && origin !== url.origin) return json({ error: 'Only this classroom can access the tutor.' }, 403);
    if (!['GET', 'HEAD'].includes(request.method) && !origin) return json({ error: 'A classroom origin is required.' }, 403);
    const cookie = request.headers.get('cookie')?.match(/(?:^|;\s*)maths_session=([a-f0-9-]{36})(?:;|$)/)?.[1];
    const session = cookie && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(cookie) ? cookie : randomUUID();
    if (session !== cookie) responseHeaders['Set-Cookie'] = `maths_session=${session}; Path=/; HttpOnly; SameSite=Strict; Max-Age=2592000${url.protocol === 'https:' ? '; Secure' : ''}`;
    if (path === '/health' && request.method === 'GET') return json({ ready: ready(), features: { transcription: false, photo: false, clone: false, avatar: false, sharedLessons: false, lessonGeneration: false }, voice: 'browser' });
    if (path !== '/progress' && path !== '/teacher') return json({ error: 'This feature is not connected. Use the prepared lessons and browser voice.' }, 501);
    if (path === '/teacher' && request.method !== 'POST') return json({ error: 'Use POST for a tutor question.' }, 405);
    if (path === '/progress' && !['GET', 'POST', 'DELETE'].includes(request.method)) return json({ error: 'Method not allowed.' }, 405);
    try {
      if (path === '/progress' && request.method === 'GET') return json({ values: await loadProgress(session) });
      if (path === '/progress' && request.method === 'DELETE') {
        await clearProgress(session);
        return json({ cleared: true });
      }
      const raw = await request.text();
      if (Buffer.byteLength(raw) > (path === '/progress' ? 350000 : 25000)) return json({ error: 'The submitted work is too large.' }, 413);
      let body;
      try { body = JSON.parse(raw); } catch { return json({ error: 'Send a valid JSON message.' }, 400); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) return json({ error: 'Send a valid classroom message.' }, 400);
      if (path === '/progress') {
        if (typeof body.key !== 'string' || !/^[^\u0000-\u001f]{1,250}$/.test(body.key) || (body.value !== null && typeof body.value !== 'string')) return json({ error: 'Invalid progress record.' }, 400);
        if (body.value?.length > 300000) return json({ error: 'This progress record is too large.' }, 413);
        await saveProgress(session, body.key, body.value);
        return json({ saved: true });
      }
      if (typeof body.message !== 'string' || !body.message.trim() || body.message.length > 1000 || !body.context || typeof body.context !== 'object' || Array.isArray(body.context) || !Array.isArray(body.history)) return json({ error: 'Send a topic and a short question of up to 1,000 characters.' }, 400);
      if (!ready()) return json({ error: 'The live AI connection is unavailable. You can still use every prepared lesson and browser voice.' }, 503);
      const hour = new Date().toISOString().slice(0, 13);
      const usageKey = createHash('sha256').update(`${clientAddress}:${hour}`).digest('hex');
      if (!(await reserveTurn(usageKey))) return json({ error: 'The hourly conversation limit is reached. Continue your prepared lesson or try again later.' }, 429);
      const context = sanitizeContext(body.context);
      const history = body.history.slice(-10).filter(item => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string').map(item => ({ role: item.role, content: item.content.slice(0, 1500) }));
      const turn = await reply({ message: body.message.trim(), context, history });
      if (!turn || typeof turn.message !== 'string' || typeof turn.question !== 'string' || !Array.isArray(turn.board_steps) || turn.board_steps.some(step => typeof step !== 'string') || !['unknown', 'understands', 'almost', 'confused', 'prerequisite'].includes(turn.understanding)) return json({ error: 'The tutor could not complete that reply. Please try again.' }, 502);
      return json({ message: turn.message.slice(0, 1200), question: turn.question.slice(0, 300), board_steps: turn.board_steps.slice(0, 4).map(step => step.slice(0, 150)), understanding: turn.understanding });
    } catch {
      return json({ error: path === '/progress' ? 'Your progress could not be saved or loaded. Please retry before leaving the classroom.' : 'The tutor connection is temporarily unavailable. Try again, or return to your prepared lesson.' }, 503);
    }
  };
}
