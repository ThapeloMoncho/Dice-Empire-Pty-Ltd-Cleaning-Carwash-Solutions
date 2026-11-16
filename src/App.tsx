import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesAndCarwash } from './components/ServicesAndCarwash';
import { ImpactAndAbout } from './components/ImpactAndAbout';
import { GallerySection } from './components/GallerySection';
import { BookingQuoteSection } from './components/BookingQuoteSection';
import { ContactAndSocialSection } from './components/ContactAndSocialSection';
import { FooterAndLegal } from './components/FooterAndLegal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { ChatWidget } from './components/ChatWidget';

export default function App() {
  const [selectedService, setSelectedService] = useState<string>('House Deep Cleaning');
  const [whatsAppState, setWhatsAppState] = useState<{
    isOpen: boolean;
    message: string;
    title: string;
  }>({
    isOpen: false,
    message:
      'Hello Dice Empire, I would like to enquire about your cleaning services. Please provide more information and a quotation.',
    title: 'Choose a WhatsApp Number',
  });

  function handleSelectServiceForQuote(serviceOption: string) {
    setSelectedService(serviceOption);
    const el = document.getElementById('book-now');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleOpenWhatsApp(message: string, title = 'Choose a WhatsApp Number') {
    setWhatsAppState({ isOpen: true, message, title });
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <Header />

      <main className="flex-1">
        <Hero onOpenWhatsApp={handleOpenWhatsApp} />
        <ImpactAndAbout />
        <ServicesAndCarwash
          onSelectServiceForQuote={handleSelectServiceForQuote}
          onOpenWhatsApp={handleOpenWhatsApp}
        />
        <GallerySection />
        <BookingQuoteSection
          preselectedService={selectedService}
          onOpenWhatsApp={handleOpenWhatsApp}
        />
        <ContactAndSocialSection onOpenWhatsApp={handleOpenWhatsApp} />
      </main>

      <FooterAndLegal onOpenWhatsApp={handleOpenWhatsApp} />

      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        <ChatWidget onOpenWhatsApp={handleOpenWhatsApp} />

        <button
          type="button"
          onClick={() =>
            handleOpenWhatsApp(
              'Hello Dice Empire, I would like to enquire about your cleaning or carwash services. Please assist me.',
              'WhatsApp Dice Empire',
            )
          }
          aria-label="Open WhatsApp enquiry options"
          className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xl transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          <span className="hidden sm:inline">WhatsApp Us</span>
        </button>
      </div>

      <WhatsAppModal
        isOpen={whatsAppState.isOpen}
        message={whatsAppState.message}
        title={whatsAppState.title}
        onClose={() => setWhatsAppState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
