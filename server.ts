import 'dotenv/config';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleContactSubmission, handleQuoteSubmission } from './server/enquiries.ts';
import {
  ChatApiError,
  generateWebsiteChatReply,
  type ChatTurnInput,
} from './server/geminiChat.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolvePort(): number {
  const portFlagIndex = process.argv.indexOf('--port');
  if (portFlagIndex !== -1 && process.argv[portFlagIndex + 1]) {
    const parsed = Number(process.argv[portFlagIndex + 1]);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return Number(process.env.PORT || 3000);
}

const PORT = resolvePort();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, business: 'Dice Empire (Pty) Ltd' });
  });

  app.post('/api/chat', async (req: Request, res: Response) => {
    const body = (req.body || {}) as {
      message?: unknown;
      history?: unknown;
    };
    const message = typeof body.message === 'string' ? body.message : '';
    const history = Array.isArray(body.history) ? (body.history as ChatTurnInput[]) : [];

    try {
      const reply = await generateWebsiteChatReply(message, history);
      res.json({ ok: true, reply });
    } catch (err) {
      if (err instanceof ChatApiError) {
        res.status(err.status).json({ ok: false, error: err.message });
        return;
      }
      console.error('Unexpected /api/chat error:', err);
      res.status(500).json({
        ok: false,
        error:
          'Unable to respond right now. Please contact us on WhatsApp (083 739 9542 / 068 020 9959) or call 053 831 2561.',
      });
    }
  });

  app.post('/api/quote', async (req: Request, res: Response) => {
    const result = await handleQuoteSubmission(req.body, req.headers.origin || undefined);
    res.status(result.status).json(result.body);
  });

  app.post('/api/contact', async (req: Request, res: Response) => {
    const result = await handleContactSubmission(req.body, req.headers.origin || undefined);
    res.status(result.status).json(result.body);
  });

  if (process.env.NODE_ENV !== 'production') {
    app.use(express.static(path.join(__dirname, 'public')));

    const vitePromise = import('vite').then(({ createServer: createViteServer }) =>
      createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      }),
    );

    app.use(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir, { index: false }));
    app.get('*', async (req: Request, res: Response) => {
      const indexPath = path.join(distDir, 'index.html');
      try {
        let html = await fs.readFile(indexPath, 'utf8');
        const proto = req.get('x-forwarded-proto') || req.protocol;
        const rawOrigin = process.env.APP_URL?.trim() || `${proto}://${req.get('host')}`;
        const origin = rawOrigin.replace(/\/+$/, '');
        if (/^https?:\/\//i.test(origin)) {
          html = html.replaceAll(
            'https://ais-pre-hhhzqa4duffhwrgfwo7zbf-340805023640.europe-west2.run.app',
            origin,
          );
        }
        res.type('html').send(html);
      } catch {
        res.sendFile(indexPath);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dice Empire (Pty) Ltd server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
