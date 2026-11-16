import { useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';
import { BrandLogo } from './BrandLogo';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Carwash', href: '#carwash' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Book Now', href: '#book-now', isCta: true },
  { label: 'Contact Us', href: '#contact' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          <a
            href="#home"
            aria-label="Dice Empire (Pty) Ltd Home"
            className="inline-flex items-center focus-visible:outline-2 focus-visible:outline-blue-600 rounded-lg shrink-0"
          >
            <BrandLogo variant="light-bg" size="sm" />
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700"
          >
            {NAV_ITEMS.map((item) =>
              item.isCta ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors whitespace-nowrap shrink-0"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  className="whitespace-nowrap shrink-0 py-1 hover:text-[#0B1E3D] transition-colors border-b-2 border-transparent hover:border-blue-600"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <nav
            aria-label="Mobile navigation"
            className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1.5"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={
                  item.isCta
                    ? 'mt-1 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-center text-base font-bold transition-colors'
                    : 'px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-50 hover:text-blue-700 transition-colors'
                }
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
              <a
                href={BUSINESS_CONFIG.officePhone.telHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 tabular-nums"
              >
                <Phone className="w-4 h-4 text-blue-700" aria-hidden="true" />
                <span>{BUSINESS_CONFIG.officePhone.display}</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
