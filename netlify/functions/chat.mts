import {
  ChatApiError,
  generateWebsiteChatReply,
  type ChatTurnInput,
} from '../../server/geminiChat.ts';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export default async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405);
  }

  let body: { message?: unknown; history?: unknown } = {};
  try {
    body = (await req.json()) as { message?: unknown; history?: unknown };
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON request body.' }, 400);
  }

  const message = typeof body.message === 'string' ? body.message : '';
  const history = Array.isArray(body.history) ? (body.history as ChatTurnInput[]) : [];

  try {
    const reply = await generateWebsiteChatReply(message, history);
    return jsonResponse({ ok: true, reply }, 200);
  } catch (err) {
    if (err instanceof ChatApiError) {
      return jsonResponse({ ok: false, error: err.message }, err.status);
    }
    console.error('Netlify /api/chat error:', err);
    return jsonResponse(
      {
        ok: false,
        error:
          'Unable to respond right now. Please contact us on WhatsApp (083 739 9542 / 068 020 9959) or call 053 831 2561.',
      },
      500,
    );
  }
};
