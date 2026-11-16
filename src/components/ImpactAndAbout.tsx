import { useState } from 'react';
import { ArrowRight, Award, ChevronDown, ChevronUp } from 'lucide-react';

export function ImpactAndAbout() {
  const [showMoreAbout, setShowMoreAbout] = useState(false);

  return (
    <section id="about" className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs">
                <img
                  src="/assets/about-cleaning.webp"
                  alt="Dice Empire cleaning specialist vacuuming tiled floors"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                <Award className="w-4 h-4" aria-hidden="true" />
                <span>About Us</span>
              </div>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0B1E3D] [text-wrap:balance]">
                Serving Pampierstad, Phokwane Municipality &amp; Kimberley
              </h2>

              <div className="mt-5 space-y-4 text-base text-slate-700 leading-relaxed">
                <p>
                  Dice Empire (Pty) Ltd is a youth-owned cleaning and carwash business based in
                  Pampierstad, within Phokwane Municipality, South Africa.
                </p>
                <p>
                  We provide dependable cleaning solutions to households, schools, guesthouses,
                  businesses and vehicle owners.
                </p>
                <p>
                  Our services cover residential deep cleaning, couch cleaning, carpet cleaning,
                  mattress cleaning, office cleaning, school cleaning and carwash solutions
                  (including convenient house call washes).
                </p>
                <p>
                  Our goal is to make homes, workplaces and vehicles cleaner, fresher and more
                  welcoming while creating employment opportunities and contributing positively to
                  our local community.
                </p>
                <p className="font-medium text-slate-900">
                  Led by CharLotte and Kitso, Dice Empire is committed to quality service, customer
                  satisfaction and community development.
                </p>
              </div>

              {showMoreAbout && (
                <div className="mt-5 rounded-xl bg-white border border-slate-200 p-5 text-sm text-slate-700 space-y-2.5">
                  <div className="font-semibold text-[#0B1E3D]">
                    Our Two Official Locations
                  </div>
                  <p>
                    <span className="font-semibold">Pampierstad:</span> 32B Pampierstad, Ward 3,
                    Mangope Avenue, 8566
                  </p>
                  <p>
                    <span className="font-semibold">Kimberley:</span> Twin Palm Complex, No. 1
                    Harley Street, Belgravia, Kimberley, 8301
                  </p>
                  <p className="text-slate-600">
                    Need recurring cleaning for a school, guesthouse or business fleet? Reach
                    CharLotte &amp; Kitso on <span className="font-semibold">053 831 2561</span> or
                    request a custom quotation below.
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => setShowMoreAbout((prev) => !prev)}
                  aria-expanded={showMoreAbout}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition-colors"
                >
                  <span>{showMoreAbout ? 'Show Less' : 'Learn More'}</span>
                  {showMoreAbout ? (
                    <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-sm font-semibold transition-colors"
                >
                  <span>Contact Our Team</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
