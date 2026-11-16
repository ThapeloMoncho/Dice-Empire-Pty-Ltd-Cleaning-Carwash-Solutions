import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import {
  CalendarCheck,
  Loader2,
  MessageSquareText,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';
import { answerFromWebsiteContent } from '../data/chatFallback';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface ChatWidgetProps {
  onOpenWhatsApp: (message: string, title?: string) => void;
}

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'model',
  text:
    'Hello! Welcome to Dice Empire (Pty) Ltd. Ask me anything about our cleaning services, carwash & house call vehicle washing, Pampierstad & Kimberley branches, or how to request a quotation.',
};

const SUGGESTED_QUESTIONS = [
  'What cleaning services do you offer?',
  'Do you offer house call carwash services?',
  'Where are your branches located?',
  'How do I request a quote or book?',
];

export function ChatWidget({ onOpenWhatsApp }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  async function sendMessage(rawText: string) {
    const trimmed = rawText.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const historyPayload = messages
      .filter((m) => m.id !== INITIAL_WELCOME_MESSAGE.id)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: historyPayload,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const data = isJson
        ? ((await response.json().catch(() => null)) as {
            ok?: boolean;
            reply?: string;
            error?: string;
          } | null)
        : null;

      if (response.ok && data?.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `m-${Date.now()}`,
            role: 'model',
            text: data.reply!,
          },
        ]);
        return;
      }

      // If hosted statically without serverless functions (404/405/non-JSON) or without GEMINI_API_KEY configured yet (503/502),
      // respond smoothly from website content instead of breaking the chat experience.
      if (
        !isJson ||
        response.status === 404 ||
        response.status === 405 ||
        response.status === 502 ||
        response.status === 503
      ) {
        setMessages((prev) => [
          ...prev,
          {
            id: `m-${Date.now()}`,
            role: 'model',
            text: answerFromWebsiteContent(trimmed),
          },
        ]);
        return;
      }

      setError(
        data?.error ||
          'Could not get a response right now. Please try again or reach us on WhatsApp.',
      );
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'model',
          text: answerFromWebsiteContent(trimmed),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  function handleResetConversation() {
    setMessages([INITIAL_WELCOME_MESSAGE]);
    setError(null);
    setInput('');
  }

  function handleJumpToBooking() {
    setIsOpen(false);
    const el = document.getElementById('book-now');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <>
      {isOpen && (
        <section
          aria-label="Dice Empire Client Assistant"
          className="w-[calc(100vw-2.5rem)] sm:w-[385px] h-[500px] max-h-[calc(100vh-8.5rem)] rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="bg-[#0B1E3D] text-white px-4 py-3.5 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-white/15 flex items-center justify-center shrink-0">
                <MessageSquareText className="w-5 h-5 text-emerald-300" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-sm font-bold leading-tight truncate">
                  Dice Empire Assistant
                </h2>
                <p className="text-[11px] text-blue-200 truncate">
                  Services, branches &amp; quote guidance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleResetConversation}
                title="Start new conversation"
                aria-label="Start new conversation"
                className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                aria-label="Close assistant"
                className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      isUser
                        ? 'bg-[#0B1E3D] text-white rounded-br-sm shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {messages.length === 1 && !isLoading && (
              <div className="pt-1 space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-0.5">
                  Common questions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => void sendMessage(question)}
                      className="text-left text-xs font-medium px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-[#0B1E3D] border border-slate-200 hover:border-blue-300 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-sm bg-white border border-slate-200 px-3.5 py-2.5 text-xs text-slate-600 shadow-2xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-700" aria-hidden="true" />
                  <span>Replying...</span>
                </div>
              </div>
            )}

            {error && (
              <div
                role="alert"
                className="rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-800 space-y-2"
              >
                <p>{error}</p>
                <button
                  type="button"
                  onClick={() =>
                    onOpenWhatsApp(
                      'Hello Dice Empire, I have an enquiry about your cleaning or carwash services.',
                      'WhatsApp Dice Empire',
                    )
                  }
                  className="font-semibold text-emerald-700 hover:underline"
                >
                  Continue on WhatsApp instead
                </button>
              </div>
            )}

            <div ref={endOfMessagesRef} />
          </div>

          <div className="px-3.5 py-2 bg-white border-t border-slate-100 flex items-center justify-between gap-2 shrink-0">
            <button
              type="button"
              onClick={handleJumpToBooking}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors"
            >
              <CalendarCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Go to Booking &amp; Quote Form</span>
            </button>
            <button
              type="button"
              onClick={() =>
                onOpenWhatsApp(
                  'Hello Dice Empire, I would like to request a quotation.',
                  'Chat on WhatsApp',
                )
              }
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              WhatsApp Team
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 bg-white border-t border-slate-200 flex items-end gap-2 shrink-0"
          >
            <label htmlFor="dice-chat-input" className="sr-only">
              Ask a question about Dice Empire
            </label>
            <textarea
              ref={inputRef}
              id="dice-chat-input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder="Ask about services, areas or quotes..."
              className="flex-1 resize-none max-h-24 px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-colors shrink-0"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close Dice Empire chat assistant' : 'Open Dice Empire chat assistant'}
        className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#0B1E3D] hover:bg-blue-900 text-white text-sm font-semibold shadow-xl border border-white/15 transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        {isOpen ? (
          <X className="w-5 h-5" aria-hidden="true" />
        ) : (
          <MessageSquareText className="w-5 h-5 text-emerald-300" aria-hidden="true" />
        )}
        <span className="hidden sm:inline">{isOpen ? 'Close Chat' : 'Ask Us Anything'}</span>
      </button>
    </>
  );
}
