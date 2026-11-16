import { useEffect } from 'react';
import { MessageCircle, Phone, X, ArrowUpRight } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

interface WhatsAppModalProps {
  isOpen: boolean;
  message: string;
  title?: string;
  onClose: () => void;
}

export function buildWhatsAppHref(e164: string, message: string): string {
  return `https://wa.me/${e164}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppModal({
  isOpen,
  message,
  title = 'Choose a WhatsApp Number',
  onClose,
}: WhatsAppModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Dice Empire WhatsApp
            </p>
            <h3 id="wa-modal-title" className="text-xl font-bold text-slate-900 mt-1">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close WhatsApp options"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Select either official WhatsApp line below to start a conversation with{' '}
          <span className="font-semibold text-slate-900">{BUSINESS_CONFIG.representatives}</span>.
        </p>

        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 mb-5">
          <div className="text-xs font-medium text-slate-500 mb-1">Pre-filled message</div>
          <p className="text-sm text-slate-800 leading-relaxed">{message}</p>
        </div>

        <div className="space-y-3">
          {BUSINESS_CONFIG.whatsappNumbers.map((num, idx) => (
            <a
              key={num.id}
              href={buildWhatsAppHref(num.e164, message)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-xs"
            >
              <span className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span className="text-left">
                  <span className="block text-sm font-bold tabular-nums">{num.display}</span>
                  <span className="block text-xs text-emerald-100 font-normal">
                    WhatsApp Line {idx + 1}
                  </span>
                </span>
              </span>
              <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </a>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Prefer calling our office?</span>
          <a
            href={BUSINESS_CONFIG.officePhone.telHref}
            className="inline-flex items-center gap-1.5 font-semibold text-blue-700 hover:text-blue-800 tabular-nums"
          >
            <Phone className="w-3.5 h-3.5" aria-hidden="true" />
            {BUSINESS_CONFIG.officePhone.display}
          </a>
        </div>
      </div>
    </div>
  );
}
