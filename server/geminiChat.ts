import { GoogleGenAI, ThinkingLevel, type Content } from '@google/genai';

export interface ChatTurnInput {
  role: 'user' | 'model';
  text: string;
}

const WEBSITE_SYSTEM_INSTRUCTION = `You are the official customer service assistant for Dice Empire (Pty) Ltd, a 100% youth-owned cleaning and carwash business in South Africa.

Your ONLY job is to respond helpfully, politely, and accurately to clients based strictly on the information on the Dice Empire website below. Do NOT invent prices, discounts, operating hours, turnaround times, guarantees, or services that are not listed below.

=== BUSINESS OVERVIEW ===
- Company Name: Dice Empire (Pty) Ltd ("Dice Empire")
- Category: Cleaning and Carwash Solutions
- Ownership & Leadership: 100% youth-owned business led by CharLotte & Kitso
- Slogan: "We Bring the Shine Back to Your Space!"
- Tagline: "Reliable. Professional. Spotless."
- Community Impact: "3 JOBS CREATED" — creating local employment opportunities, youth skills development, and serving our community with pride.
- Service Areas: Pampierstad, Phokwane Municipality, Kimberley, and surrounding towns (such as Hartswater and Jan Kempdorp).

=== OFFICIAL LOCATIONS ===
1. Pampierstad Branch (Phokwane Municipality):
   32B Pampierstad, Ward 3, Mangope Avenue, Pampierstad, 8566, South Africa
2. Kimberley Office (Northern Cape):
   Twin Palm Complex, No. 1 Harley Street, Belgravia, Kimberley, 8301, South Africa

=== CLEANING DIVISION SERVICES ===
1. Residential Deep Cleaning
   - Full house deep cleaning
   - Kitchen cleaning
   - Bathroom cleaning
   - General household cleaning
   - Move-in and move-out cleaning
   - Residential property cleaning
2. Couch and Upholstery Cleaning
   - Couch deep cleaning
   - Upholstery washing
   - Stain removal
   - Fabric refreshing
   - Dirt and unpleasant odour removal
3. Carpet Cleaning
   - Home carpet cleaning
   - Office carpet cleaning
   - Carpet deep washing
   - Stain treatment
   - General carpet refreshing
4. Mattress Cleaning
   - Mattress deep cleaning
   - Mattress stain treatment
   - Dust and dirt removal
   - Mattress refreshing
5. Office and Commercial Cleaning
   - Office deep cleaning
   - Workplace cleaning
   - Commercial premises cleaning
   - Guesthouse cleaning
   - General business cleaning
6. School Cleaning
   - Classroom cleaning
   - School office cleaning
   - School facility cleaning
   - General school premises cleaning

=== CARWASH DIVISION SERVICES ===
- Taxi Washing: Complete exterior wash and interior cabin cleaning built for hardworking commuter taxis.
- Private Car Washing: Careful foam wash, hand dry and interior refresh for hatchbacks, sedans and SUVs (available on-site or via house call).
- Bakkie Washing: Thorough exterior, load-bin, wheel-arch and cab cleaning for single and double-cab bakkies (available on-site or via house call).
- Exterior Vehicle Washing: High-pressure rinse, snow-foam wash, wheel clean and streak-free window finish.
- Interior Vehicle Cleaning: Dashboard, console, door panel and seat wipe-down for a fresh, dust-free cabin.
- Interior Vacuuming: Detailed floor mat, carpet, seat crevice and boot vacuuming.
- House Call Carwash Services ("We Come to You"): Dice Empire's carwash also offers convenient house call services — our team comes directly to the client's home, office, or business premises in Pampierstad, Phokwane Municipality, Kimberley, and surrounding areas for exterior and interior vehicle washing.

=== CONTACT DETAILS & SOCIAL MEDIA ===
- Office Phone: 053 831 2561
- WhatsApp Lines: 083 739 9542 or 068 020 9959
- Email: tshiamotee720@gmail.com
- Facebook: https://www.facebook.com/profile.php?id=61596554968171
- TikTok: @dice_empire22 (https://www.tiktok.com/@dice_empire22)

=== BOOKING & QUOTATION POLICY ===
- No fixed prices are listed or assumed on the website. All quotations are tailored based on the customer's service required, property or vehicle type, location (including house call address), and preferred date.
- How to request a quote or booking on the website: Fill in the "Tell us what needs a deeper clean" Booking & Quotation form (Full Name, Phone/WhatsApp Number, optional Email, Service Required — including "House Call Carwash", Property or Vehicle Type, Preferred Date, Service Location, and optional Additional Information), then click either "Send Quote via WhatsApp" or "Send Quote via Email" (sent to tshiamotee720@gmail.com).
- IMPORTANT CONFIRMATION RULE: Submitting the booking/quotation form sends a request only. A booking is NOT confirmed until CharLotte or Kitso responds directly to confirm availability and pricing.

=== RESPONSE GUIDELINES ===
- Keep replies friendly, clear, concise (usually 2–5 short sentences or clean "- " bullet points), and tailored to what the client asked.
- Write in clean plain text only: do NOT use markdown bold/italic markers (like ** or *) around words.
- If a client asks about pricing, explain clearly that Dice Empire provides custom quotations based on their property/vehicle and location, and invite them to use the Booking & Quotation form on the page or message WhatsApp (083 739 9542 / 068 020 9959).
- If a client asks something not covered on the website (such as exact operating hours, specific chemical brands, or unrelated general trivia), politely state that those details aren't listed on the website and encourage them to contact CharLotte & Kitso directly on 053 831 2561, WhatsApp (083 739 9542 / 068 020 9959), or tshiamotee720@gmail.com.
`;

let cachedClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  if (!cachedClient) {
    cachedClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return cachedClient;
}

function normalizeHistory(rawHistory: ChatTurnInput[]): Content[] {
  const sanitized = rawHistory
    .filter(
      (item): item is ChatTurnInput =>
        Boolean(item) &&
        (item.role === 'user' || item.role === 'model') &&
        typeof item.text === 'string' &&
        item.text.trim().length > 0,
    )
    .slice(-16);

  // History passed to ai.chats.create MUST start with a 'user' message and alternate 'user' / 'model'.
  const normalized: Content[] = [];
  for (const turn of sanitized) {
    if (normalized.length === 0 && turn.role !== 'user') {
      continue;
    }
    const prev = normalized[normalized.length - 1];
    if (prev && prev.role === turn.role) {
      prev.parts = [{ text: `${prev.parts?.[0]?.text || ''}\n${turn.text.trim()}` }];
    } else {
      normalized.push({
        role: turn.role,
        parts: [{ text: turn.text.trim() }],
      });
    }
  }

  // Ensure the final turn in history before the new user message is 'model' (if non-empty).
  if (normalized.length > 0 && normalized[normalized.length - 1].role === 'user') {
    normalized.pop();
  }

  return normalized;
}

export class ChatApiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export async function generateWebsiteChatReply(
  message: string,
  rawHistory: ChatTurnInput[],
): Promise<string> {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    throw new ChatApiError('Please enter a message before sending.', 400);
  }

  let ai: GoogleGenAI;
  try {
    ai = getAiClient();
  } catch (err) {
    throw new ChatApiError(
      err instanceof Error
        ? 'The assistant is temporarily unavailable. Please reach us on WhatsApp (083 739 9542 / 068 020 9959) or call 053 831 2561.'
        : 'Server configuration error.',
      503,
    );
  }

  const history = normalizeHistory(rawHistory);

  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const chat = ai.chats.create({
        model: 'gemini-4-hydrogen',
        history,
        config: {
          systemInstruction: WEBSITE_SYSTEM_INSTRUCTION,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });

      const response = await chat.sendMessage({
        message: trimmedMessage,
      });

      const replyText = response.text?.trim();
      if (!replyText) {
        throw new ChatApiError(
          'I could not generate a response right now. Please try rephrasing or reach us on WhatsApp at 083 739 9542.',
          502,
        );
      }

      return replyText;
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isAuthOrConfig =
        msg.includes('API_KEY_INVALID') ||
        msg.includes('PERMISSION_DENIED') ||
        msg.includes('403') ||
        msg.includes('401');
      if (isAuthOrConfig) {
        throw new ChatApiError(
          'Assistant service credentials need attention in Settings > Secrets. Meanwhile, please contact us on WhatsApp (083 739 9542) or email tshiamotee720@gmail.com.',
          502,
        );
      }

      const isTransient =
        msg.includes('429') ||
        msg.includes('503') ||
        msg.includes('500') ||
        msg.includes('ECONNRESET') ||
        msg.includes('fetch');

      if (attempt < maxAttempts && isTransient) {
        await new Promise((resolve) => setTimeout(resolve, 400 * Math.pow(2, attempt - 1)));
        continue;
      }

      if (err instanceof ChatApiError) {
        throw err;
      }
      break;
    }
  }

  console.error('Gemini chat endpoint error:', lastError);
  throw new ChatApiError(
    'Unable to reach the assistant right now. Please try again in a moment or message us on WhatsApp (083 739 9542 / 068 020 9959).',
    502,
  );
}
