import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { CARWASH_SERVICES, CLEANING_SERVICES } from '../config/business';
import { MEDIA_ASSETS } from '../data/media';
import { ResilientImage } from './ResilientImage';

interface ServicesAndCarwashProps {
  onSelectServiceForQuote: (serviceOption: string) => void;
  onOpenWhatsApp: (message: string, title?: string) => void;
}

export function ServicesAndCarwash({
  onSelectServiceForQuote,
  onOpenWhatsApp,
}: ServicesAndCarwashProps) {
  return (
    <>
      <section id="services" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
              Our Cleaning Services
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1E3D] [text-wrap:balance]">
              Professional Cleaning Solutions for Homes, Offices &amp; Schools
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              Every space receives thorough, attentive care. Select any service below to request a
              tailored quotation or start a direct WhatsApp enquiry.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {CLEANING_SERVICES.map((service) => (
              <article
                key={service.id}
                className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <ResilientImage
                    src={service.image}
                    alt={service.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                </div>

                <div className="flex-1 p-6 flex flex-col">
                  <h3 className="font-display text-xl font-bold text-[#0B1E3D]">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="mt-4 space-y-2 text-sm text-slate-700 flex-1">
                    {service.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check
                          className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="carwash" className="py-16 sm:py-24 bg-[#0B1E3D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Carwash Services
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white [text-wrap:balance]">
                YOUR VEHICLE DESERVES TO SHINE!
              </h2>
              <p className="mt-4 text-base sm:text-lg text-blue-100 leading-relaxed">
                From taxis to private cars and bakkies, we provide reliable carwash services —
                including convenient house call washes right at your home or workplace — to keep
                your vehicle clean, fresh and looking its best.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CARWASH_SERVICES.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-colors"
                  >
                    <h3 className="font-display text-base font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                ))}

                <div className="sm:col-span-2 rounded-xl bg-emerald-950/50 border border-emerald-400/30 p-4 hover:bg-emerald-950/70 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-base font-bold text-white">
                      House Call Carwash Services
                    </h3>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                      We Come to You
                    </span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                    Can&apos;t drive in? Book a house call wash and our team will come directly to
                    your home, office or business premises for convenient exterior and interior
                    vehicle cleaning.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onSelectServiceForQuote('House Call Carwash')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <span>Book a Carwash / House Call</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onOpenWhatsApp(
                      'Hello Dice Empire, I would like to enquire about your carwash and house call vehicle washing services.',
                      'Carwash WhatsApp Enquiry',
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>WhatsApp Enquiry</span>
                </button>
              </div>

              <p className="mt-4 text-xs text-slate-300">
                Pricing is tailored to vehicle type, wash requirements and house call location —
                request a quote or message us on WhatsApp for current rates.
              </p>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/15 bg-slate-900">
                <ResilientImage
                  src={MEDIA_ASSETS.carwashBakkieTaxi}
                  alt="Bakkie and commuter minibus taxi receiving high-pressure snow-foam wash"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 bg-slate-900">
                  <ResilientImage
                    src={MEDIA_ASSETS.carwashInterior}
                    alt="Vehicle interior vacuuming and dashboard detailing with fresh green microfibre cloth"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl bg-blue-950/70 border border-white/10 p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      House Calls &amp; Fleet Care
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold text-white">
                      Taxis, Bakkies &amp; Private Cars
                    </h3>
                    <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                      Whether it is a daily commuter taxi, work bakkie or family car, we clean
                      exterior bodywork and interior cabins carefully — at our carwash or at your
                      doorstep via house call.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectServiceForQuote('House Call Carwash')}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                  >
                    <span>Book a house call or fleet wash</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
