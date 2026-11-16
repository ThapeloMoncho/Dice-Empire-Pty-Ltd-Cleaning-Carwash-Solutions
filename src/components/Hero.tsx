import { useEffect, useRef } from 'react';
import { ArrowRight, MessageCircle, ShieldCheck } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { MEDIA_ASSETS } from '../data/media';
import { FacebookIcon, TikTokIcon } from './ContactAndSocialSection';

interface HeroProps {
  onOpenWhatsApp: (message: string, title?: string) => void;
}

export function Hero({ onOpenWhatsApp }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }, []);

  return (
    <section id="home" className="relative bg-slate-950 text-white">
      <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={MEDIA_ASSETS.heroPoster}
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          >
            <source src={MEDIA_ASSETS.heroVideo} type="video/mp4" />
          </video>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#0B1E3D]/65 via-[#0B1E3D]/55 to-[#0B1E3D]/25"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-emerald-300 mb-4">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>100% Youth-Owned Business</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-blue-200">Pampierstad &amp; Kimberley</span>
            </div>

            <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.12] text-white [text-wrap:balance]">
              NEED YOUR HOME, OFFICE OR VEHICLE DEEP CLEANED?
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-200 leading-relaxed max-w-xl">
              Dice Empire (Pty) Ltd provides reliable cleaning and carwash solutions — including
              house call carwash services — to homes, businesses, schools, guesthouses and vehicle
              owners.{' '}
              <span className="font-semibold text-white">
                {BUSINESS_CONFIG.slogan}
              </span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href="#book-now"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm sm:text-base font-semibold transition-colors shadow-lg whitespace-nowrap shrink-0"
              >
                <span>Book a Cleaning Service</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={() =>
                  onOpenWhatsApp(
                    'Hello Dice Empire, I would like to enquire about your cleaning services. Please provide more information and a quotation.',
                    'Chat With Dice Empire on WhatsApp',
                  )
                }
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm sm:text-base font-semibold transition-colors shadow-lg whitespace-nowrap shrink-0"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>WhatsApp Us</span>
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-3">
                <a
                  href={BUSINESS_CONFIG.social.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Dice Empire on Facebook"
                  className="inline-flex items-center justify-center p-2 rounded-lg bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white transition-colors"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
                <a
                  href={BUSINESS_CONFIG.social.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Dice Empire on TikTok"
                  className="inline-flex items-center justify-center p-2 rounded-lg bg-white/10 text-blue-200 hover:bg-white/20 hover:text-white transition-colors"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0B1E3D] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" />
      </div>
    </section>
  );
}
