export default async (): Promise<Response> => {
  return new Response(
    JSON.stringify({
      ok: true,
      business: 'Dice Empire (Pty) Ltd',
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY?.trim()),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};
