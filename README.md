# Dice Empire (Pty) Ltd — Website & Email Enquiry Server

Official website for **Dice Empire (Pty) Ltd** (Cleaning & Carwash Solutions), serving Pampierstad (Phokwane Municipality), Kimberley, and surrounding areas.

## Key Features
- Branded homepage, cleaning services (Residential, Couch & Upholstery, Carpet, Mattress, Office & Commercial, School), and dedicated Carwash showcase
- Official dual-logo presentation (`/public/assets/aistudio/4_030e035f.png` & `/public/assets/aistudio/Primary_Logo_1cf39809.png`)
- Dual WhatsApp number chooser (`083 739 9542` and `068 020 9959`) with pre-filled messages
- Online Booking & Quotation Request form (`POST /api/quote`) that emails quote requests to the configured business email
- Integrated Customer Contact Enquiry form (`POST /api/contact`)
- Interactive Google Maps embed & directions for both official addresses (Pampierstad & Kimberley)
- SEO metadata and `LocalBusiness` JSON-LD structured data

## Environment Variables (`.env`)
Copy `.env.example` to `.env` and configure email delivery:

```env
APP_URL="https://your-domain.co.za"
BUSINESS_EMAIL="tshiamotee720@gmail.com"

# Option 1: Resend API (recommended for cloud hosting)
RESEND_API_KEY="re_..."
SMTP_FROM="Dice Empire Website <no-reply@your-verified-domain.co.za>"

# Option 2: Standard SMTP (e.g. Gmail App Password, cPanel/Afrihost/Domains.co.za mail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

When neither `RESEND_API_KEY` nor `SMTP_*` is configured, enquiries are still validated and safely logged to `data/enquiries.json`, and customers are provided one-click WhatsApp and `mailto:` options on confirmation.

## Activating Official Social Media URLs
Once official Facebook and TikTok pages are live, add their URLs to `src/config/business.ts` under `BUSINESS_CONFIG.social.facebookUrl` and `BUSINESS_CONFIG.social.tiktokUrl`.

## Development & Deployment
```bash
npm install
npm run dev      # Starts Express + Vite dev server on port 3000
npm run build    # Builds production frontend into dist/
npm start        # Runs production server (node server.ts) on port 3000
```

## Netlify Hosting (`netlify.toml` & `netlify/functions/`)
This project includes `netlify.toml` and serverless Netlify Functions for `/api/chat`, `/api/quote`, `/api/contact`, and `/api/health`.

1. Deploy the full repository to Netlify via Git or `netlify deploy --build` (rather than uploading only the static `dist/` folder), so `netlify/functions/` are deployed alongside `dist/`.
2. In **Netlify → Site configuration → Environment variables**, add `GEMINI_API_KEY` (and optional `RESEND_API_KEY` or `SMTP_*` variables) so the AI chatbot and email routes run server-side.

