import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Mail,
  MessageCircle,
  Send,
  Share2,
} from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

interface ContactAndSocialSectionProps {
  onOpenWhatsApp: (message: string, title?: string) => void;
}

export function FacebookIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06z" />
    </svg>
  );
}

export function TikTokIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.05.86.14V9.01a6.34 6.34 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.28 6.34 6.34 0 0 0 9.34 21.6a6.34 6.34 0 0 0 6.34-6.34V8.69a8.26 8.26 0 0 0 4.78 1.52V6.76c-.3 0-.59-.02-.87-.07z" />
    </svg>
  );
}

export function ContactAndSocialSection({ onOpenWhatsApp }: ContactAndSocialSectionProps) {
  const [selectedMapId, setSelectedMapId] = useState<'pampierstad' | 'kimberley'>('pampierstad');
  const [socialNotice, setSocialNotice] = useState<'facebook' | 'tiktok' | null>(null);

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [officeChoice, setOfficeChoice] = useState('Pampierstad Branch');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSuccess, setContactSuccess] = useState<{
    referenceId: string;
    recipientEmail: string;
    emailDispatched: boolean;
  } | null>(null);

  const activeLocation =
    BUSINESS_CONFIG.locations.find((loc) => loc.id === selectedMapId) ||
    BUSINESS_CONFIG.locations[0];

  function handleSocialClick(platform: 'facebook' | 'tiktok') {
    setSocialNotice((prev) => (prev === platform ? null : platform));
  }

  async function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    setContactError(null);

    if (contactName.trim().length < 2) {
      setContactError('Please enter your name.');
      return;
    }
    const digits = contactPhone.replace(/[^\d+]/g, '');
    if (digits.length < 9 || digits.length > 15) {
      setContactError('Please enter a valid contact phone number.');
      return;
    }
    if (contactEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
      setContactError('Please enter a valid email address or leave it blank.');
      return;
    }
    if (contactMessage.trim().length < 5) {
      setContactError('Please enter a message explaining how our team can help.');
      return;
    }

    setContactSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: contactName.trim(),
          phone: contactPhone.trim(),
          email: contactEmail.trim() || undefined,
          locationPreference: officeChoice,
          subject: contactSubject.trim() || 'General Customer Enquiry',
          message: contactMessage.trim(),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setContactError(data.error || 'Could not send your enquiry. Please try again.');
        return;
      }

      setContactSuccess({
        referenceId: data.referenceId,
        recipientEmail: data.recipientEmail || BUSINESS_CONFIG.businessEmail,
        emailDispatched: Boolean(data.emailDispatched),
      });
    } catch {
      setContactError('Network error while sending your enquiry. Please call 053 831 2561 or WhatsApp us.');
    } finally {
      setContactSubmitting(false);
    }
  }

  return (
    <>
      <section className="py-12 sm:py-16 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                <Share2 className="w-4 h-4" aria-hidden="true" />
                <span>Social Media</span>
              </div>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight">
                Follow Dice Empire (Pty) Ltd
              </h2>
              <p className="mt-2 text-sm sm:text-base text-blue-100 leading-relaxed">
                {BUSINESS_CONFIG.social.message}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3.5 shrink-0">
              {BUSINESS_CONFIG.social.facebookUrl ? (
                <a
                  href={BUSINESS_CONFIG.social.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white text-[#0B1E3D] hover:bg-blue-50 text-sm font-bold transition-colors whitespace-nowrap"
                >
                  <FacebookIcon className="w-5 h-5 text-blue-700" />
                  <span>Follow Us on Facebook</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSocialClick('facebook')}
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white text-[#0B1E3D] hover:bg-blue-50 text-sm font-bold transition-colors whitespace-nowrap"
                >
                  <FacebookIcon className="w-5 h-5 text-blue-700" />
                  <span>Follow Us on Facebook</span>
                </button>
              )}

              {BUSINESS_CONFIG.social.tiktokUrl ? (
                <a
                  href={BUSINESS_CONFIG.social.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#0B1E3D] text-white hover:bg-slate-900 border border-white/20 text-sm font-bold transition-colors whitespace-nowrap"
                >
                  <TikTokIcon className="w-5 h-5 text-emerald-400" />
                  <span>Follow Us on TikTok</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSocialClick('tiktok')}
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#0B1E3D] text-white hover:bg-slate-900 border border-white/20 text-sm font-bold transition-colors whitespace-nowrap"
                >
                  <TikTokIcon className="w-5 h-5 text-emerald-400" />
                  <span>Follow Us on TikTok</span>
                </button>
              )}
            </div>
          </div>

          {socialNotice && (
            <div
              role="status"
              className="mt-5 rounded-xl bg-[#0B1E3D]/70 border border-white/15 px-4 py-3 text-sm text-blue-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <span>
                Our official{' '}
                <span className="font-semibold text-white">
                  {socialNotice === 'facebook' ? 'Facebook' : 'TikTok'}
                </span>{' '}
                profile link is currently being finalised. For latest updates or direct service
                enquiries, message us on WhatsApp or submit an enquiry below.
              </span>
              <button
                type="button"
                onClick={() =>
                  onOpenWhatsApp(
                    'Hello Dice Empire, I would like to connect with you for updates and service enquiries.',
                    'Connect on WhatsApp',
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Contact Us
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1E3D]">
              Speak With CharLotte &amp; Kitso
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Reach Dice Empire (Pty) Ltd by telephone, WhatsApp, email enquiry or visit either of
              our official offices in Pampierstad and Kimberley.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8">
                <h3 className="font-display text-xl font-bold text-[#0B1E3D]">
                  Customer Enquiry Form
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Have a question about residential, commercial, school, carwash or house call
                  vehicle washing services? Send an enquiry directly to{' '}
                  <a
                    href={`mailto:${BUSINESS_CONFIG.businessEmail}`}
                    className="font-semibold text-blue-700 hover:underline"
                  >
                    {BUSINESS_CONFIG.businessEmail}
                  </a>
                  .
                </p>

                {contactSuccess ? (
                  <div
                    role="status"
                    className="mt-5 rounded-xl bg-white border border-emerald-200 p-6 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                          Enquiry Sent · Ref {contactSuccess.referenceId}
                        </div>
                        <h4 className="font-display text-lg font-bold text-[#0B1E3D] mt-0.5">
                          Message Received
                        </h4>
                        <p className="text-sm text-slate-600 mt-1">
                          {contactSuccess.emailDispatched
                            ? `Your message has been delivered to ${contactSuccess.recipientEmail}.`
                            : `Your message has been recorded for ${contactSuccess.recipientEmail}.`}{' '}
                          Our team will get back to you shortly.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <a
                        href={`mailto:${contactSuccess.recipientEmail}?subject=${encodeURIComponent(
                          `Dice Empire Enquiry (${contactSuccess.referenceId})${contactSubject ? ` - ${contactSubject}` : ''}`,
                        )}&body=${encodeURIComponent(
                          `Name: ${contactName}\nPhone: ${contactPhone}\nBranch: ${officeChoice}\n\n${contactMessage}`,
                        )}`}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                          contactSuccess.emailDispatched
                            ? 'text-blue-700 hover:text-blue-800'
                            : 'px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white'
                        }`}
                      >
                        <Mail className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {contactSuccess.emailDispatched
                            ? 'Send copy via your email app'
                            : `Send Email to ${contactSuccess.recipientEmail}`}
                        </span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setContactSuccess(null);
                          setContactName('');
                          setContactPhone('');
                          setContactEmail('');
                          setContactSubject('');
                          setContactMessage('');
                        }}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        Send another enquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} noValidate className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="block text-sm font-semibold text-slate-800 mb-1"
                        >
                          Full Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="block text-sm font-semibold text-slate-800 mb-1"
                        >
                          Phone / WhatsApp <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="e.g. 083 000 0000"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="block text-sm font-semibold text-slate-800 mb-1"
                        >
                          Email <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-office"
                          className="block text-sm font-semibold text-slate-800 mb-1"
                        >
                          Nearest Branch
                        </label>
                        <select
                          id="contact-office"
                          value={officeChoice}
                          onChange={(e) => setOfficeChoice(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          <option value="Pampierstad Branch">Pampierstad Branch (Ward 3)</option>
                          <option value="Kimberley Office">Kimberley Office (Belgravia)</option>
                          <option value="General Enquiry">General / Surrounding Areas</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-subject"
                        className="block text-sm font-semibold text-slate-800 mb-1"
                      >
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        type="text"
                        value={contactSubject}
                        onChange={(e) => setContactSubject(e.target.value)}
                        placeholder="e.g. School cleaning contract, Guesthouse enquiry, Carwash"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="block text-sm font-semibold text-slate-800 mb-1"
                      >
                        Message <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        rows={3}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="How can Dice Empire help you?"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {contactError && (
                      <div
                        role="alert"
                        className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{contactError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors"
                    >
                      <Send className="w-4 h-4" aria-hidden="true" />
                      <span>{contactSubmitting ? 'Sending Message...' : 'Send Enquiry'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-[#0B1E3D]">
                      Office Locations Map
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{activeLocation.fullAddress}</p>
                  </div>

                  <div className="inline-flex p-1 rounded-xl bg-slate-100 self-start">
                    {BUSINESS_CONFIG.locations.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setSelectedMapId(loc.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                          selectedMapId === loc.id
                            ? 'bg-white text-[#0B1E3D] shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {loc.id === 'pampierstad' ? 'Pampierstad' : 'Kimberley'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative h-80 lg:h-96 w-full bg-slate-200">
                  <iframe
                    title={`Google Maps location for ${activeLocation.name}`}
                    src={activeLocation.mapsEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="px-5 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-600">{activeLocation.badge}</span>
                  <a
                    href={activeLocation.mapsDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-blue-700 hover:text-blue-800"
                  >
                    <span>Get Directions in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
