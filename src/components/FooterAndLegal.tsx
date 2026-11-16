import { useEffect, useState } from 'react';
import { ExternalLink, Mail, MessageCircle, Phone, X } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { BrandLogo } from './BrandLogo';
import { FacebookIcon, TikTokIcon } from './ContactAndSocialSection';

interface FooterAndLegalProps {
  onOpenWhatsApp: (message: string, title?: string) => void;
}

type LegalDoc = 'privacy' | 'terms' | null;

export function FooterAndLegal({ onOpenWhatsApp }: FooterAndLegalProps) {
  const [legalDoc, setLegalDoc] = useState<LegalDoc>(null);
  const [footerSocialNotice, setFooterSocialNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!legalDoc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLegalDoc(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [legalDoc]);

  return (
    <>
      <footer className="bg-[#0B1E3D] text-slate-200 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-4">
              <a href="#home" aria-label="Dice Empire (Pty) Ltd Home" className="inline-block">
                <BrandLogo variant="dark-bg" size="md" />
              </a>
              <div>
                <h2 className="font-display text-lg font-bold text-white tracking-wide">
                  DICE EMPIRE (PTY) LTD
                </h2>
                <p className="text-sm text-blue-200 font-medium">
                  Cleaning &amp; Carwash Solutions
                </p>
                <p className="mt-1 text-sm text-emerald-300 font-semibold">
                  &ldquo;{BUSINESS_CONFIG.tagline}&rdquo;
                </p>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                Youth-owned residential, commercial, school and vehicle cleaning company (including
                house call carwash services) based in Pampierstad, within Phokwane Municipality, and
                Kimberley, South Africa.
              </p>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Contact &amp; Representatives
              </h3>
              <p className="text-sm text-slate-300">
                Representatives:{' '}
                <span className="font-semibold text-white">
                  {BUSINESS_CONFIG.representatives}
                </span>
              </p>
              <div className="space-y-2 text-sm">
                <a
                  href={BUSINESS_CONFIG.officePhone.telHref}
                  className="flex items-center gap-2 text-slate-200 hover:text-emerald-300 transition-colors tabular-nums"
                >
                  <Phone className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
                  <span>{BUSINESS_CONFIG.officePhone.display}</span>
                </a>
                {BUSINESS_CONFIG.whatsappNumbers.map((num) => (
                  <a
                    key={num.id}
                    href={`${num.url}?text=${encodeURIComponent(
                      'Hello Dice Empire, I would like to enquire about your services.',
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-200 hover:text-emerald-300 transition-colors tabular-nums"
                  >
                    <MessageCircle
                      className="w-4 h-4 text-emerald-400 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{num.display} </span>
                  </a>
                ))}
                <a
                  href={`mailto:${BUSINESS_CONFIG.businessEmail}`}
                  className="flex items-center gap-2 text-slate-200 hover:text-emerald-300 transition-colors break-all"
                >
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
                  <span>{BUSINESS_CONFIG.businessEmail}</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Our Locations
              </h3>
              <div className="space-y-3.5 text-sm text-slate-300">
                {BUSINESS_CONFIG.locations.map((loc) => (
                  <div key={loc.id}>
                    <div className="font-semibold text-white">
                      {loc.id === 'pampierstad' ? 'Pampierstad' : 'Kimberley'}
                    </div>
                    <p className="leading-relaxed">{loc.fullAddress}.</p>
                    <a
                      href={loc.mapsDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>
                  <a href="#home" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#carwash" className="hover:text-white transition-colors">
                    Carwash
                  </a>
                </li>
                <li>
                  <a href="#gallery" className="hover:text-white transition-colors">
                    Gallery
                  </a>
                </li>
                <li>
                  <a href="#book-now" className="hover:text-white transition-colors">
                    Book Now
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>

              <div className="pt-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Social Media
                </div>
                <div className="flex items-center gap-2.5">
                  {BUSINESS_CONFIG.social.facebookUrl ? (
                    <a
                      href={BUSINESS_CONFIG.social.facebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow Dice Empire on Facebook"
                      className="p-2 rounded-lg bg-white/10 hover:bg-blue-600 text-white transition-colors"
                    >
                      <FacebookIcon className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setFooterSocialNotice(
                          'Our official Facebook page is being finalised. Please contact us on WhatsApp or via the enquiry form in the meantime.',
                        )
                      }
                      aria-label="Facebook updates"
                      className="p-2 rounded-lg bg-white/10 hover:bg-blue-600 text-white transition-colors"
                    >
                      <FacebookIcon className="w-4 h-4" />
                    </button>
                  )}

                  {BUSINESS_CONFIG.social.tiktokUrl ? (
                    <a
                      href={BUSINESS_CONFIG.social.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Follow Dice Empire on TikTok"
                      className="p-2 rounded-lg bg-white/10 hover:bg-blue-600 text-white transition-colors"
                    >
                      <TikTokIcon className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setFooterSocialNotice(
                          'Our official TikTok profile is being finalised. Please contact us on WhatsApp or via the enquiry form in the meantime.',
                        )
                      }
                      aria-label="TikTok updates"
                      className="p-2 rounded-lg bg-white/10 hover:bg-blue-600 text-white transition-colors"
                    >
                      <TikTokIcon className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      onOpenWhatsApp(
                        'Hello Dice Empire, I would like to enquire about your cleaning or carwash services.',
                        'WhatsApp Dice Empire',
                      )
                    }
                    aria-label="Contact Dice Empire on WhatsApp"
                    className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
                {footerSocialNotice && (
                  <p className="mt-2 text-xs text-blue-200 leading-relaxed">{footerSocialNotice}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 Dice Empire (Pty) Ltd. All Rights Reserved.</p>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => setLegalDoc('privacy')}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => setLegalDoc('terms')}
                className="hover:text-white transition-colors"
              >
                Terms &amp; Conditions
              </button>
            </div>
          </div>
        </div>
      </footer>

      {legalDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
          aria-label={legalDoc === 'privacy' ? 'Privacy Policy' : 'Terms and Conditions'}
          onClick={() => setLegalDoc(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 text-slate-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Dice Empire (Pty) Ltd
                </div>
                <h3 className="font-display text-2xl font-bold text-[#0B1E3D] mt-1">
                  {legalDoc === 'privacy' ? 'Privacy Policy (POPIA Notice)' : 'Terms & Conditions'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLegalDoc(null)}
                aria-label="Close legal notice"
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {legalDoc === 'privacy' ? (
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600">
                <p>
                  Dice Empire (Pty) Ltd respects your personal information in accordance with the
                  Protection of Personal Information Act (POPIA) of South Africa.
                </p>
                <p>
                  <strong className="text-slate-900">Information We Collect:</strong> When you
                  submit a booking request, quotation request or customer enquiry, we collect your
                  name, phone number, optional email address, service location and service details
                  solely to respond to your enquiry, prepare quotations and schedule requested
                  services.
                </p>
                <p>
                  <strong className="text-slate-900">How We Use Your Data:</strong> Your details
                  are sent to our business representatives (CharLotte &amp; Kitso) and are never
                  sold, rented or shared with unrelated third-party marketers.
                </p>
                <p>
                  <strong className="text-slate-900">Access &amp; Removal:</strong> You may request
                  to update or delete your enquiry details at any time by calling 053 831 2561 or
                  messaging 083 739 9542.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600">
                <p>
                  <strong className="text-slate-900">Quotations &amp; Bookings:</strong> Submitting
                  an online booking or quotation request does not constitute an automatic booking
                  confirmation. A booking is only confirmed once a Dice Empire (Pty) Ltd
                  representative confirms availability, scope and quotation with you directly.
                </p>
                <p>
                  <strong className="text-slate-900">Pricing:</strong> Service pricing varies
                  according to property size, fabric/stain condition, vehicle type and location.
                  Final quotations are confirmed directly prior to work commencing.
                </p>
                <p>
                  <strong className="text-slate-900">Service Locations:</strong> Services operate
                  across Pampierstad (Phokwane Municipality), Kimberley and surrounding areas from
                  our official offices at 32B Pampierstad, Ward 3, Mangope Avenue, 8566 and Twin
                  Palm Complex, No. 1 Harley Street, Belgravia, Kimberley, 8301.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
