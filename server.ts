import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import {
  ChatApiError,
  generateWebsiteChatReply,
  type ChatTurnInput,
} from './server/geminiChat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'tshiamotee720@gmail.com';
const DATA_DIR = path.join(__dirname, 'data');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

interface QuotePayload {
  fullName: string;
  phone: string;
  email?: string;
  service: string;
  propertyOrVehicleType: string;
  location: string;
  preferredDate: string;
  additionalInfo?: string;
}

interface ContactPayload {
  fullName: string;
  phone: string;
  email?: string;
  locationPreference?: string;
  subject: string;
  message: string;
}

interface StoredRecord {
  referenceId: string;
  type: 'quote' | 'contact';
  createdAt: string;
  emailDispatched: boolean;
  deliveryMode: 'resend' | 'smtp' | 'formsubmit' | 'recorded';
  payload: QuotePayload | ContactPayload;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function persistEnquiry(record: StoredRecord): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    let existing: StoredRecord[] = [];
    try {
      const raw = await fs.readFile(ENQUIRIES_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        existing = parsed as StoredRecord[];
      }
    } catch {
      existing = [];
    }
    existing.unshift(record);
    await fs.writeFile(ENQUIRIES_FILE, JSON.stringify(existing.slice(0, 500), null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to persist enquiry locally:', err);
  }
}

async function dispatchBusinessEmail(options: {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
  senderName?: string;
  originUrl?: string;
}): Promise<{ dispatched: boolean; mode: 'resend' | 'smtp' | 'formsubmit' | 'recorded' }> {
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const fromAddress = process.env.SMTP_FROM?.trim() || 'Dice Empire Website <onboarding@resend.dev>';

  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [BUSINESS_EMAIL],
          reply_to: options.replyTo || undefined,
          subject: options.subject,
          text: options.text,
          html: options.html,
        }),
      });
      if (res.ok) {
        return { dispatched: true, mode: 'resend' };
      }
      console.error('Resend API returned status:', res.status, await res.text());
    } catch (err) {
      console.error('Resend email dispatch error:', err);
    }
  }

  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure = process.env.SMTP_SECURE === 'true';

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
      await transporter.sendMail({
        from: process.env.SMTP_FROM?.trim() || smtpUser,
        to: BUSINESS_EMAIL,
        replyTo: options.replyTo || undefined,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      return { dispatched: true, mode: 'smtp' };
    } catch (err) {
      console.error('SMTP email dispatch error:', err);
    }
  }

  try {
    const referer = options.originUrl || process.env.APP_URL || 'https://diceempire.co.za';
    const formRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(BUSINESS_EMAIL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Referer: referer,
        Origin: referer,
      },
      body: JSON.stringify({
        name: options.senderName || 'Dice Empire Website Visitor',
        email: options.replyTo || BUSINESS_EMAIL,
        _subject: options.subject,
        _replyto: options.replyTo || undefined,
        _template: 'box',
        _captcha: 'false',
        message: options.text,
      }),
    });
    if (formRes.ok) {
      const formJson = (await formRes.json().catch(() => null)) as
        | { success?: string | boolean; message?: string }
        | null;
      if (formJson && (formJson.success === true || formJson.success === 'true')) {
        return { dispatched: true, mode: 'formsubmit' };
      }
      if (formJson?.message) {
        console.info('FormSubmit response:', formJson.message);
      }
    }
  } catch (err) {
    console.error('FormSubmit email dispatch fallback error:', err);
  }

  return { dispatched: false, mode: 'recorded' };
}

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
    const body = (req.body || {}) as Partial<QuotePayload>;
    const fullName = String(body.fullName || '').trim();
    const phone = String(body.phone || '').trim();
    const email = String(body.email || '').trim();
    const service = String(body.service || '').trim();
    const propertyOrVehicleType = String(body.propertyOrVehicleType || '').trim();
    const location = String(body.location || '').trim();
    const preferredDate = String(body.preferredDate || '').trim();
    const additionalInfo = String(body.additionalInfo || '').trim();

    if (fullName.length < 2) {
      res.status(400).json({ ok: false, error: 'Please enter your full name.' });
      return;
    }
    if (!isValidPhone(phone)) {
      res.status(400).json({ ok: false, error: 'Please enter a valid South African phone or WhatsApp number.' });
      return;
    }
    if (email && !isValidEmail(email)) {
      res.status(400).json({ ok: false, error: 'Please enter a valid email address or leave it blank.' });
      return;
    }
    if (!service) {
      res.status(400).json({ ok: false, error: 'Please select the service you require.' });
      return;
    }
    if (propertyOrVehicleType.length < 2) {
      res.status(400).json({ ok: false, error: 'Please specify the property or vehicle type.' });
      return;
    }
    if (location.length < 3) {
      res.status(400).json({ ok: false, error: 'Please enter the service address or area.' });
      return;
    }
    if (!preferredDate) {
      res.status(400).json({ ok: false, error: 'Please choose your preferred booking date.' });
      return;
    }

    const referenceId = `DE-Q-${Date.now().toString(36).toUpperCase()}`;
    const payload: QuotePayload = {
      fullName,
      phone,
      email: email || undefined,
      service,
      propertyOrVehicleType,
      location,
      preferredDate,
      additionalInfo: additionalInfo || undefined,
    };

    const subject = `[Dice Empire Quote Request ${referenceId}] ${service} — ${fullName}`;
    const text = [
      `New Quotation & Booking Request (${referenceId})`,
      `Business: Dice Empire (Pty) Ltd`,
      `--------------------------------------------------`,
      `Customer Name: ${fullName}`,
      `Phone / WhatsApp: ${phone}`,
      `Email: ${email || 'Not provided'}`,
      `Service Required: ${service}`,
      `Property / Vehicle Type: ${propertyOrVehicleType}`,
      `Address / Service Location: ${location}`,
      `Preferred Date: ${preferredDate}`,
      `Additional Details: ${additionalInfo || 'None provided'}`,
      `--------------------------------------------------`,
      `Note: Customer was informed that bookings are only confirmed once Dice Empire responds.`,
    ].join('\n');

    const html = `
      <div style="font-family: Arial, sans-serif; color: #0f172a; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0b1e3d; color: #ffffff; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 18px;">New Quote &amp; Booking Request</h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #cbd5e1;">Reference: ${escapeHtml(referenceId)}</p>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #64748b; width: 180px;">Customer Name</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(fullName)}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Phone / WhatsApp</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(phone)}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Email Address</td><td style="padding: 8px 0;">${escapeHtml(email || 'Not provided')}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Service Required</td><td style="padding: 8px 0; font-weight: 600; color: #1d4ed8;">${escapeHtml(service)}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Property / Vehicle</td><td style="padding: 8px 0;">${escapeHtml(propertyOrVehicleType)}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Service Location</td><td style="padding: 8px 0;">${escapeHtml(location)}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;">Preferred Date</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(preferredDate)}</td></tr>
          </table>
          <div style="margin-top: 16px; padding: 14px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Additional Information</div>
            <div style="font-size: 14px; white-space: pre-wrap;">${escapeHtml(additionalInfo || 'None provided')}</div>
          </div>
        </div>
      </div>
    `;

    const dispatch = await dispatchBusinessEmail({
      subject,
      text,
      html,
      replyTo: email || undefined,
      senderName: fullName,
      originUrl: req.headers.origin || undefined,
    });

    await persistEnquiry({
      referenceId,
      type: 'quote',
      createdAt: new Date().toISOString(),
      emailDispatched: dispatch.dispatched,
      deliveryMode: dispatch.mode,
      payload,
    });

    res.status(201).json({
      ok: true,
      referenceId,
      emailDispatched: dispatch.dispatched,
      deliveryMode: dispatch.mode,
      recipientEmail: BUSINESS_EMAIL,
    });
  });

  app.post('/api/contact', async (req: Request, res: Response) => {
    const body = (req.body || {}) as Partial<ContactPayload>;
    const fullName = String(body.fullName || '').trim();
    const phone = String(body.phone || '').trim();
    const email = String(body.email || '').trim();
    const locationPreference = String(body.locationPreference || '').trim();
    const subjectLine = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    if (fullName.length < 2) {
      res.status(400).json({ ok: false, error: 'Please enter your name.' });
      return;
    }
    if (!isValidPhone(phone)) {
      res.status(400).json({ ok: false, error: 'Please enter a valid contact phone number.' });
      return;
    }
    if (email && !isValidEmail(email)) {
      res.status(400).json({ ok: false, error: 'Please enter a valid email address or leave it blank.' });
      return;
    }
    if (message.length < 5) {
      res.status(400).json({ ok: false, error: 'Please enter a short message explaining how we can help.' });
      return;
    }

    const referenceId = `DE-C-${Date.now().toString(36).toUpperCase()}`;
    const payload: ContactPayload = {
      fullName,
      phone,
      email: email || undefined,
      locationPreference: locationPreference || 'General',
      subject: subjectLine || 'Customer Enquiry',
      message,
    };

    const emailSubject = `[Dice Empire Enquiry ${referenceId}] ${payload.subject} — ${fullName}`;
    const text = [
      `New Customer Contact Enquiry (${referenceId})`,
      `--------------------------------------------------`,
      `Name: ${fullName}`,
      `Phone: ${phone}`,
      `Email: ${email || 'Not provided'}`,
      `Preferred Office: ${payload.locationPreference}`,
      `Subject: ${payload.subject}`,
      `Message:\n${message}`,
    ].join('\n');

    const html = `
      <div style="font-family: Arial, sans-serif; color: #0f172a; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #1d4ed8; color: #ffffff; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 18px;">New Customer Enquiry</h2>
          <p style="margin: 4px 0 0; font-size: 13px; color: #dbeafe;">Reference: ${escapeHtml(referenceId)}</p>
        </div>
        <div style="padding: 24px;">
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(fullName)}</p>
          <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
          <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email || 'Not provided')}</p>
          <p style="margin: 0 0 8px;"><strong>Preferred Office:</strong> ${escapeHtml(payload.locationPreference || 'General')}</p>
          <p style="margin: 0 0 16px;"><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p>
          <div style="padding: 14px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap;">${escapeHtml(message)}</div>
        </div>
      </div>
    `;

    const dispatch = await dispatchBusinessEmail({
      subject: emailSubject,
      text,
      html,
      replyTo: email || undefined,
      senderName: fullName,
      originUrl: req.headers.origin || undefined,
    });

    await persistEnquiry({
      referenceId,
      type: 'contact',
      createdAt: new Date().toISOString(),
      emailDispatched: dispatch.dispatched,
      deliveryMode: dispatch.mode,
      payload,
    });

    res.status(201).json({
      ok: true,
      referenceId,
      emailDispatched: dispatch.dispatched,
      deliveryMode: dispatch.mode,
      recipientEmail: BUSINESS_EMAIL,
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    app.use(express.static(path.join(__dirname, 'public')));
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
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
