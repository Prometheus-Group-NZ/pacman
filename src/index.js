// Cloudflare Worker — Tester Comments API
// POST /api/comments  — submit a comment
// GET  /api/comments  — retrieve all comments
// Auth: Bearer <API_SECRET> in Authorization header

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/api/comments') {
      return new Response('Not found', { status: 404 });
    }

    // Verify API secret
    const auth = request.headers.get('Authorization');
    if (auth !== `Bearer ${env.API_SECRET}`) {
      return new Response('Unauthorized', { status: 401, headers: CORS_HEADERS });
    }

    if (request.method === 'POST') {
      return handlePost(request, env, ctx);
    }

    if (request.method === 'GET') {
      return handleGet(env);
    }

    return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
  },
};

async function handlePost(request, env, ctx) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: CORS_HEADERS });
  }

  const { name, email, category, message } = body;
  if (!message || !message.trim()) {
    return new Response('Message is required', { status: 400, headers: CORS_HEADERS });
  }

  const comment = {
    id: crypto.randomUUID(),
    name: (name || 'Anonymous').trim().slice(0, 50),
    email: (email || '').trim().slice(0, 100),
    category: (category || 'general').trim().slice(0, 20),
    message: message.trim(),
    timestamp: Date.now(),
    date: new Date().toISOString(),
  };

  // Fetch existing comments from KV
  let comments = [];
  try {
    const stored = await env.COMMENTS.get('all', 'json');
    if (Array.isArray(stored)) comments = stored;
  } catch {}

  comments.push(comment);

  // Cap at 500 most recent to stay within KV value limits
  if (comments.length > 500) comments = comments.slice(-500);

  await env.COMMENTS.put('all', JSON.stringify(comments));

  return new Response(JSON.stringify({ ok: true, id: comment.id }), {
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

async function handleGet(env) {
  let comments = [];
  try {
    const stored = await env.COMMENTS.get('all', 'json');
    if (Array.isArray(stored)) comments = stored;
  } catch {}

  // Sort newest first
  comments.sort((a, b) => b.timestamp - a.timestamp);

  return new Response(JSON.stringify({ comments }), {
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}
