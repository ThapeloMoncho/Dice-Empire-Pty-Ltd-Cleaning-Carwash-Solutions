import { BUSINESS_CONFIG, CARWASH_SERVICES, CLEANING_SERVICES } from '../config/business';

export function answerFromWebsiteContent(question: string): string {
  const q = question.toLowerCase();

  if (
    q.includes('house call') ||
    q.includes('mobile') ||
    q.includes('come to') ||
    q.includes('home wash') ||
    q.includes('at my house')
  ) {
    return [
      'Yes! Dice Empire offers house call carwash services ("We Come to You") right at your home, office, or business premises across Pampierstad, Phokwane Municipality, Kimberley, and surrounding towns.',
      '',
      'You can book a House Call Carwash for private cars, bakkies, or fleet vehicles using the Booking & Quotation form (select "House Call Carwash") or message us on WhatsApp at 083 739 9542 or 068 020 9959.',
    ].join('\n');
  }

  if (
    q.includes('carwash') ||
    q.includes('car wash') ||
    q.includes('taxi') ||
    q.includes('bakkie') ||
    q.includes('vehicle') ||
    q.includes('car')
  ) {
    const items = CARWASH_SERVICES.map((s) => `- ${s.title}: ${s.summary}`).join('\n');
    return [
      'Our Carwash Division covers:',
      items,
      '- House Call Carwash Services: We also come directly to your home, office, or business premises.',
      '',
      'To book or request a tailored vehicle quote, fill in the Booking & Quotation form or message WhatsApp (083 739 9542 / 068 020 9959).',
    ].join('\n');
  }

  if (
    q.includes('location') ||
    q.includes('address') ||
    q.includes('branch') ||
    q.includes('office') ||
    q.includes('where') ||
    q.includes('pampierstad') ||
    q.includes('kimberley') ||
    q.includes('phokwane')
  ) {
    return [
      'Dice Empire (Pty) Ltd operates from two official locations and serves surrounding towns such as Hartswater and Jan Kempdorp:',
      `- ${BUSINESS_CONFIG.locations[0].name}: ${BUSINESS_CONFIG.locations[0].fullAddress}`,
      `- ${BUSINESS_CONFIG.locations[1].name}: ${BUSINESS_CONFIG.locations[1].fullAddress}`,
    ].join('\n');
  }

  if (
    q.includes('contact') ||
    q.includes('phone') ||
    q.includes('call') ||
    q.includes('whatsapp') ||
    q.includes('email') ||
    q.includes('number') ||
    q.includes('facebook') ||
    q.includes('tiktok')
  ) {
    return [
      `You can reach ${BUSINESS_CONFIG.representatives} at ${BUSINESS_CONFIG.name} via:`,
      `- Office Phone: ${BUSINESS_CONFIG.officePhone.display}`,
      `- WhatsApp: ${BUSINESS_CONFIG.whatsappNumbers[0].display} or ${BUSINESS_CONFIG.whatsappNumbers[1].display}`,
      `- Email: ${BUSINESS_CONFIG.businessEmail}`,
      '- Social: Facebook & TikTok (@dice_empire22)',
    ].join('\n');
  }

  if (
    q.includes('price') ||
    q.includes('cost') ||
    q.includes('much') ||
    q.includes('rate') ||
    q.includes('quote') ||
    q.includes('book') ||
    q.includes('confirm')
  ) {
    return [
      'No fixed prices are listed on the website—all quotations are tailored to your service required, property or vehicle type, location (including house call address), and preferred date.',
      '',
      'To request a quote or booking, fill in the Booking & Quotation form on this page and click "Send Quote via WhatsApp" or "Send Quote via Email" (sent to tshiamotee720@gmail.com).',
      'Please note: Submitting the form sends a request only. A booking is not confirmed until CharLotte or Kitso responds directly to confirm availability and pricing.',
    ].join('\n');
  }

  if (
    q.includes('couch') ||
    q.includes('upholstery') ||
    q.includes('sofa') ||
    q.includes('carpet') ||
    q.includes('mattress') ||
    q.includes('school') ||
    q.includes('guesthouse') ||
    q.includes('house') ||
    q.includes('home') ||
    q.includes('service') ||
    q.includes('clean')
  ) {
    const categories = CLEANING_SERVICES.map((c) => `- ${c.title}: ${c.description}`).join('\n');
    return [
      'Here are the cleaning services offered by Dice Empire (Pty) Ltd:',
      categories,
      '- Carwash & House Call Vehicle Washing: Taxis, private cars, bakkies, exterior & interior care, plus convenient house call washes.',
      '',
      'Would you like to request a quote using the form below or chat with our team on WhatsApp (083 739 9542 / 068 020 9959)?',
    ].join('\n');
  }

  return [
    `${BUSINESS_CONFIG.name} is a 100% youth-owned cleaning and carwash company led by ${BUSINESS_CONFIG.representatives}, serving Pampierstad, Phokwane Municipality, Kimberley, and surrounding towns.`,
    '',
    'We offer Residential Deep Cleaning, Couch & Upholstery Cleaning, Carpet Cleaning, Mattress Cleaning, Office & Commercial Cleaning, School Cleaning, and Carwash Solutions (including House Call Carwash).',
    `For specific enquiries or tailored quotes, please use the Booking & Quotation form, call ${BUSINESS_CONFIG.officePhone.display}, email ${BUSINESS_CONFIG.businessEmail}, or message WhatsApp (${BUSINESS_CONFIG.whatsappNumbers[0].display} / ${BUSINESS_CONFIG.whatsappNumbers[1].display}).`,
  ].join('\n');
}
