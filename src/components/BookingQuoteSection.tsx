import { useEffect, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Mail,
  MessageCircle,
  NotebookPen,
} from 'lucide-react';
import { BOOKING_SERVICE_OPTIONS, BUSINESS_CONFIG } from '../config/business';

interface BookingQuoteSectionProps {
  preselectedService: string;
  onOpenWhatsApp: (message: string, title?: string) => void;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  email?: string;
  service?: string;
  propertyOrVehicleType?: string;
  location?: string;
  preferredDate?: string;
}

interface QuoteSuccessState {
  referenceId: string;
  emailDispatched: boolean;
  recipientEmail: string;
  summaryText: string;
}

export function BookingQuoteSection({
  preselectedService,
  onOpenWhatsApp,
}: BookingQuoteSectionProps) {
  const todayIso = new Date().toISOString().split('T')[0];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState<string>(preselectedService || 'House Deep Cleaning');
  const [propertyOrVehicleType, setPropertyOrVehicleType] = useState('');
  const [location, setLocation] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<QuoteSuccessState | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
      setSuccess(null);
    }
  }, [preselectedService]);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (fullName.trim().length < 2) {
      next.fullName = 'Please enter your full name.';
    }
    const digits = phone.replace(/[^\d+]/g, '');
    if (digits.length < 9 || digits.length > 15) {
      next.phone = 'Please enter a valid South African phone or WhatsApp number.';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Please enter a valid email address or leave this field blank.';
    }
    if (!service.trim()) {
      next.service = 'Please select the service you require.';
    }
    if (propertyOrVehicleType.trim().length < 2) {
      next.propertyOrVehicleType =
        'Please describe your property or vehicle (e.g. 3-bedroom house, double-cab bakkie).';
    }
    if (location.trim().length < 3) {
      next.location = 'Please enter the service address or area (e.g. Pampierstad, Kimberley).';
    }
    if (!preferredDate) {
      next.preferredDate = 'Please select your preferred booking date.';
    } else if (preferredDate < todayIso) {
      next.preferredDate = 'Please choose today or a future date.';
    }
    return next;
  }

  function buildSummaryMessage(): string {
    return [
      'Hello Dice Empire, I would like to request a cleaning quotation / booking:',
      `Name: ${fullName.trim() || 'Not provided'}`,
      `Phone: ${phone.trim() || 'Not provided'}`,
      `Email: ${email.trim() || 'Not provided'}`,
      `Service: ${service}`,
      `Property / Vehicle: ${propertyOrVehicleType.trim() || 'Not provided'}`,
      `Location: ${location.trim() || 'Not provided'}`,
      `Preferred Date: ${preferredDate || 'Flexible'}`,
      `Additional Info: ${additionalInfo.trim() || 'None'}`,
    ].join('\n');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          service,
          propertyOrVehicleType: propertyOrVehicleType.trim(),
          location: location.trim(),
          preferredDate,
          additionalInfo: additionalInfo.trim() || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.ok) {
        setServerError(data.error || 'Could not submit your quote request. Please try again.');
        return;
      }

      const summaryText = buildSummaryMessage();
      setSuccess({
        referenceId: data.referenceId,
        emailDispatched: Boolean(data.emailDispatched),
        recipientEmail: data.recipientEmail || BUSINESS_CONFIG.businessEmail,
        summaryText,
      });
    } catch {
      setServerError(
        'Network error while sending your quote request. Please use WhatsApp or call 053 831 2561.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleWhatsAppQuote() {
    setServerError(null);
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onOpenWhatsApp(buildSummaryMessage(), 'Send Quote via WhatsApp');
  }

  return (
    <section id="book-now" className="py-16 sm:py-24 bg-[#f4f7fa] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5 lg:pt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Let’s make a plan
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1E3D] leading-[1.15]">
              Tell us what needs a{' '}
              <span className="block text-blue-700">deeper clean.</span>
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Share a few details about your home, workplace or vehicle. We’ll get back to you to
              discuss your request and any quotation.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Choose a service and preferred date</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Ask for a quote without committing</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Your booking is confirmed only after we respond</span>
              </li>
            </ul>

            <div className="mt-7 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3">
              <NotebookPen
                className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-display text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Booking Confirmation Policy
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
                  Submitting this form sends a quotation and booking request only. A booking is{' '}
                  <span className="font-semibold">not confirmed</span> until a Dice Empire
                  representative contacts you to confirm availability and pricing.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-lg shadow-slate-200/60">
              {success ? (
                <div role="status" className="space-y-5">
                  <div className="flex items-start gap-3.5">
                    <CheckCircle2
                      className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        Quote Request Received · Ref {success.referenceId}
                      </div>
                      <h3 className="mt-1 font-display text-2xl font-bold text-[#0B1E3D]">
                        Thank You, {fullName}!
                      </h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                        {success.emailDispatched
                          ? `Your quotation request has been emailed directly to ${success.recipientEmail}.`
                          : `Your quotation request has been logged for ${success.recipientEmail}.`}{' '}
                        Please remember that your booking is not confirmed until CharLotte or Kitso
                        responds to confirm availability and quotation details.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700 whitespace-pre-line">
                    {success.summaryText}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        onOpenWhatsApp(
                          `${success.summaryText}\nRef: ${success.referenceId}`,
                          'Also Send via WhatsApp',
                        )
                      }
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Also Send on WhatsApp</span>
                    </button>

                    <a
                      href={`mailto:${success.recipientEmail}?subject=${encodeURIComponent(
                        `Dice Empire Quote Request (${success.referenceId}) - ${service}`,
                      )}&body=${encodeURIComponent(success.summaryText)}`}
                      className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-colors ${
                        success.emailDispatched
                          ? 'border border-slate-300 hover:bg-slate-50 text-slate-800'
                          : 'bg-blue-700 hover:bg-blue-800 text-white'
                      }`}
                    >
                      <Mail className="w-4 h-4" aria-hidden="true" />
                      <span>
                        {success.emailDispatched
                          ? 'Open in Email App'
                          : `Send Email to ${success.recipientEmail}`}
                      </span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setSuccess(null);
                        setFullName('');
                        setPhone('');
                        setEmail('');
                        setPropertyOrVehicleType('');
                        setLocation('');
                        setPreferredDate('');
                        setAdditionalInfo('');
                      }}
                      className="px-4 py-3 text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="quote-fullName"
                          className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Customer Full Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="quote-fullName"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Thabo Mokoena"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        {errors.fullName && (
                          <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="quote-phone"
                          className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Phone / WhatsApp Number <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="quote-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. 083 000 0000"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="quote-email"
                          className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          id="quote-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="quote-service"
                          className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Service Required <span className="text-red-600">*</span>
                        </label>
                        <select
                          id="quote-service"
                          required
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        >
                          {BOOKING_SERVICE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {errors.service && (
                          <p className="mt-1 text-xs text-red-600">{errors.service}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="quote-type"
                          className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Property or Vehicle Type <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="quote-type"
                          type="text"
                          required
                          value={propertyOrVehicleType}
                          onChange={(e) => setPropertyOrVehicleType(e.target.value)}
                          placeholder="e.g. 3-bed home, 3-seater couch, Toyota Quantum, bakkie"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        {errors.propertyOrVehicleType && (
                          <p className="mt-1 text-xs text-red-600">
                            {errors.propertyOrVehicleType}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="quote-date"
                          className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                        >
                          Preferred Booking Date <span className="text-red-600">*</span>
                        </label>
                        <input
                          id="quote-date"
                          type="date"
                          required
                          min={todayIso}
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        {errors.preferredDate && (
                          <p className="mt-1 text-xs text-red-600">{errors.preferredDate}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="quote-location"
                        className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Address or Service Location <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="quote-location"
                        type="text"
                        required
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Pampierstad, Hartswater, Jan Kempdorp or Kimberley (or house call address)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      {errors.location && (
                        <p className="mt-1 text-xs text-red-600">{errors.location}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="quote-notes"
                        className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                      >
                        Additional Information{' '}
                        <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        id="quote-notes"
                        rows={3}
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        placeholder="Share room count, stain details, fleet size, preferred time or access notes..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    {serverError && (
                      <div
                        role="alert"
                        className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-800"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{serverError}</span>
                      </div>
                    )}

                    <div className="pt-2 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleWhatsAppQuote}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors shadow-xs whitespace-nowrap"
                        >
                          <MessageCircle className="w-4 h-4" aria-hidden="true" />
                          <span>Send Quote via WhatsApp</span>
                        </button>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold transition-colors shadow-xs whitespace-nowrap"
                        >
                          <Mail className="w-4 h-4" aria-hidden="true" />
                          <span>{submitting ? 'Sending Quote...' : 'Send Quote via Email'}</span>
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">
                        Your booking is not confirmed until CharLotte or Kitso responds to confirm
                        availability and pricing.
                      </p>
                    </div>
                  </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
