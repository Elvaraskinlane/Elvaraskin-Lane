"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { Forum, Close, ArrowForward, Spa, ShoppingBag } from "@material-symbols-svg/react";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import {
  AssistantProduct,
  getMessageText,
  productsFromMessage,
  stripProductLinks,
} from "@/lib/assistant-catalog";
import AssistantProductCard from "./AssistantProductCard";
import AssistantProductPreview from "./AssistantProductPreview";

const STARTERS = [
  { label: "Oily", message: "I have oily skin. What should I use?" },
  { label: "Dry", message: "I have dry skin. What do you recommend?" },
  { label: "Acne", message: "I'm dealing with acne. What products can help?" },
  { label: "Dark spots", message: "I want to fade dark spots and hyperpigmentation." },
  { label: "Routine", message: "Help me build a simple daily skincare routine." },
];

const SESSION_KEY = "elvara-assistant-prompted";

export default function StoreAssistant() {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [localProgress, setLocalProgress] = useState("");
  const [localThinking, setLocalThinking] = useState(false);
  const [input, setInput] = useState("");
  const [catalog, setCatalog] = useState<AssistantProduct[]>([]);
  const [preview, setPreview] = useState<AssistantProduct | null>(null);
  const [addedIds, setAddedIds] = useState<number[]>([]);
  const [addingIds, setAddingIds] = useState<number[]>([]);
  const [addingRoutine, setAddingRoutine] = useState(false);

  const worker = useRef<Worker | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openedByUser = useRef(false);
  const lastSubmittedRef = useRef("");

  const { addItem } = useCartStore();
  const { openCartDrawer, isCartDrawerOpen } = useUIStore();

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/assistant",
        prepareSendMessagesRequest: ({ id, messages, body, trigger, messageId }) => ({
          body: {
            ...body,
            id,
            messages,
            trigger,
            messageId,
            pathname: typeof window !== "undefined" ? window.location.pathname : "",
          },
        }),
      }),
    []
  );

  const { messages, setMessages, sendMessage, status } = useChat({
    transport,
    onError: (error: Error) => {
      if (
        error.message.includes("429") ||
        error.message.includes("primary_engine_exhausted") ||
        error.message.includes("Timeout")
      ) {
        setIsLocalMode(true);
        triggerLocalFallback(lastSubmittedRef.current || input);
      }
    },
  });

  const isCloudLoading = status === "submitted" || status === "streaming";
  const isBusy = isCloudLoading || localThinking;

  useEffect(() => {
    worker.current = new Worker(new URL("../../lib/fallback-worker.ts", import.meta.url), {
      type: "module",
    });

    worker.current.addEventListener("message", (event) => {
      if (event.data.type === "progress") {
        if (event.data.data.status === "progress") {
          setLocalProgress(`Getting ready… ${Math.round(event.data.data.progress || 0)}%`);
        } else if (event.data.data.status === "ready") {
          setLocalProgress("Ready.");
          setTimeout(() => setLocalProgress(""), 3000);
        }
      }

      if (event.data.type === "complete") {
        setLocalThinking(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            parts: [{ type: "text", text: event.data.output }],
          },
        ]);
      }

      if (event.data.type === "error") {
        setLocalThinking(false);
        setLocalProgress("Having trouble. Try again in a moment.");
      }
    });

    return () => worker.current?.terminate();
  }, [setMessages]);

  useEffect(() => {
    fetch("/api/assistant/catalog")
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setCatalog(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isShopOrPdp = pathname === "/shop" || pathname.startsWith("/product/");
    if (!isShopOrPdp || sessionStorage.getItem(SESSION_KEY)) return;

    const timer = window.setTimeout(() => {
      if (isCartDrawerOpen || isOpen) return;
      sessionStorage.setItem(SESSION_KEY, "1");
      openedByUser.current = false;
      setIsOpen(true);
      setHasOpened(true);
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [pathname, isCartDrawerOpen, isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBusy, localProgress, preview]);

  useEffect(() => {
    if (!isOpen) return;
    if (openedByUser.current) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 280);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (preview) {
        setPreview(null);
        return;
      }
      setIsOpen(false);
      sessionStorage.setItem(SESSION_KEY, "1");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, preview]);

  useEffect(() => {
    if (!isOpen) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const triggerLocalFallback = (userText: string) => {
    setLocalThinking(true);
    worker.current?.postMessage({
      messages: [
        ...messages.map((message) => ({
          role: message.role,
          content: getMessageText(message),
        })),
        { role: "user", content: userText },
      ],
    });
  };

  const submitText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;

    lastSubmittedRef.current = trimmed;

    if (isLocalMode) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "user",
          parts: [{ type: "text", text: trimmed }],
        },
      ]);
      triggerLocalFallback(trimmed);
    } else {
      sendMessage({ text: trimmed });
    }
  };

  const handleSmartSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitText(input);
    setInput("");
  };

  const openAssistant = () => {
    openedByUser.current = true;
    setHasOpened(true);
    setIsOpen(true);
    if (typeof window !== "undefined") sessionStorage.setItem(SESSION_KEY, "1");
  };

  const closeAssistant = () => {
    setPreview(null);
    setIsOpen(false);
    if (typeof window !== "undefined") sessionStorage.setItem(SESSION_KEY, "1");
  };

  const handleAdd = async (product: AssistantProduct, quantity = 1) => {
    if (addingIds.includes(product.id)) return;
    setAddingIds((current) => [...current, product.id]);
    try {
      await addItem(product.id, quantity);
      setAddedIds((current) => (current.includes(product.id) ? current : [...current, product.id]));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add this item.");
    } finally {
      setAddingIds((current) => current.filter((id) => id !== product.id));
    }
  };

  const handleAddRoutine = async (products: AssistantProduct[]) => {
    if (addingRoutine || products.length === 0) return;
    setAddingRoutine(true);
    try {
      for (const product of products) {
        if (addedIds.includes(product.id)) continue;
        await addItem(product.id, 1);
        setAddedIds((current) => (current.includes(product.id) ? current : [...current, product.id]));
      }
      toast.success("Routine added to bag");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add the full routine.");
    } finally {
      setAddingRoutine(false);
    }
  };

  const viewingSlug = pathname.startsWith("/product/") ? pathname.split("/")[2] : undefined;
  const viewingProduct = viewingSlug
    ? catalog.find((product) => product.slug === viewingSlug)
    : undefined;

  const lastAssistant = [...messages].reverse().find((message) => message.role === "assistant");
  const lastRecs = lastAssistant ? productsFromMessage(getMessageText(lastAssistant), catalog) : [];
  const lastRecsUnadded = lastRecs.filter((product) => !addedIds.includes(product.id));
  const showFollowUps = Boolean(lastAssistant) && !isBusy && !preview;

  const pdpStarters = viewingProduct
    ? [
        {
          label: "Is this right for me?",
          message: `I'm looking at ${viewingProduct.name}. Is it a good fit for my skin?`,
        },
        {
          label: "Pair with this",
          message: `I'm looking at ${viewingProduct.name}. What should I use with it?`,
        },
      ]
    : [];

  return (
    <>
      <button
        onClick={isOpen ? closeAssistant : openAssistant}
        className={`fixed bottom-6 right-6 z-50 items-center gap-2.5 h-14 bg-on-background text-background rounded-full shadow-lg hover:scale-[1.03] transition-transform ${
          isOpen ? "hidden md:flex w-14 justify-center" : "flex pl-2 pr-5"
        }`}
        aria-label={isOpen ? "Close consultant" : "Ask a consultant"}
      >
        {isOpen ? (
          <Close className="text-[22px]" />
        ) : (
          <>
            <span className="relative w-10 h-10 flex items-center justify-center">
              {!hasOpened && (
                <span className="absolute inset-0 rounded-full bg-primary animate-consultant-pulse" />
              )}
              <Forum className="relative text-[22px]" />
            </span>
            <span className="font-label-md text-[11px] uppercase tracking-[0.14em]">
              Ask a consultant
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-on-background/40 md:hidden"
          onClick={closeAssistant}
        />
      )}

      {isOpen && (
        <div className="store-assistant-panel bg-surface shadow-2xl rounded-t-2xl md:rounded-sm border border-outline-variant/20 overflow-hidden flex flex-col relative animate-slide-in-up md:animate-fade-in-up">
          <div className="md:hidden flex justify-center pt-2 pb-0">
            <span className="w-10 h-1 rounded-full bg-outline-variant/60" />
          </div>

          <div className="px-4 py-3 flex items-center justify-between border-b border-outline-variant/15 bg-surface">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-on-background text-background flex items-center justify-center">
                <Spa className="text-[18px]" />
              </span>
              <div>
                <h3 className="font-label-md text-xs uppercase tracking-widest font-semibold text-on-surface">
                  Elvara Consultant
                </h3>
                <p className="font-body-md text-[10px] text-on-surface-variant flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  {localProgress || "Online"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeAssistant}
              className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors"
              aria-label="Close consultant"
            >
              <Close className="text-[20px]" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background hide-scrollbar relative">
            {messages.length === 0 && (
              <div className="flex flex-col items-center text-center pt-6 pb-2">
                <span className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4">
                  <Spa className="text-[22px] text-on-surface" />
                </span>
                <h4 className="font-headline-sm text-xl text-on-surface mb-2">
                  {viewingProduct ? "Shall I help you decide?" : "Your personal consultant"}
                </h4>
                <p className="font-body-md text-sm text-on-surface-variant/80 max-w-[280px] leading-relaxed mb-6">
                  {viewingProduct
                    ? "I can tell you if this formula fits your skin, or pair it with a routine."
                    : "Tell me your skin, or pick a concern. I’ll match you to the right Elvara formulas."}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {(pdpStarters.length ? [...pdpStarters, ...STARTERS.slice(0, 3)] : STARTERS).map((starter) => (
                    <button
                      key={starter.label}
                      type="button"
                      onClick={() => submitText(starter.message)}
                      className="px-3.5 py-2 rounded-full border border-outline-variant/40 text-[10px] font-label-md uppercase tracking-[0.12em] text-on-surface hover:bg-on-background hover:text-background hover:border-on-background transition-colors"
                    >
                      {starter.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => {
              const text = getMessageText(message);
              const recs = message.role === "assistant" ? productsFromMessage(text, catalog) : [];
              const displayText = message.role === "assistant" ? stripProductLinks(text) : text;

              return (
                <div key={message.id} className="space-y-2">
                  <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <span
                      className={`inline-block p-4 rounded-2xl text-sm max-w-[85%] leading-relaxed ${
                        message.role === "user"
                          ? "bg-primary text-on-primary rounded-tr-sm shadow-sm"
                          : "bg-surface text-on-surface border border-primary/10 rounded-tl-sm shadow-md"
                      }`}
                    >
                      {message.role === "user" ? (
                        displayText
                      ) : (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-3 last:mb-0 text-sm leading-relaxed">{children}</p>,
                            ul: ({ children }) => (
                              <ul className="list-disc pl-5 mb-3 last:mb-0 space-y-2 text-on-surface-variant">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="list-decimal pl-5 mb-3 last:mb-0 space-y-2 text-on-surface-variant">{children}</ol>
                            ),
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                            h3: ({ children }) => (
                              <h3 className="font-headline-sm text-base mb-2 mt-3 first:mt-0 text-on-surface">{children}</h3>
                            ),
                            strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                            a: ({ href, children }) => {
                              const isInternal = href?.startsWith("/");
                              return (
                                <Link
                                  href={href || "#"}
                                  className="underline underline-offset-2 decoration-primary/40 hover:text-primary"
                                  {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                                >
                                  {children}
                                </Link>
                              );
                            },
                          }}
                        >
                          {displayText}
                        </ReactMarkdown>
                      )}
                    </span>
                  </div>

                  {recs.length > 0 && (
                    <div className="space-y-2 max-w-[92%]">
                      {recs.map((product) => (
                        <AssistantProductCard
                          key={product.id}
                          product={product}
                          isAdding={addingIds.includes(product.id)}
                          isAdded={addedIds.includes(product.id)}
                          onAdd={() => handleAdd(product)}
                          onOpen={() => setPreview(product)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {(status === "submitted" || localThinking) && (
              <div className="flex justify-start">
                <span className="inline-flex gap-1 p-4 bg-surface-container-low rounded-2xl rounded-tl-sm">
                  <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce delay-200" />
                </span>
              </div>
            )}

            {showFollowUps && (
              <div className="flex flex-wrap gap-2 pt-1">
                {addedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => openCartDrawer()}
                    className="px-3.5 py-2 rounded-full bg-on-background text-background text-[10px] font-label-md uppercase tracking-[0.12em] flex items-center gap-1.5 hover:bg-primary transition-colors"
                  >
                    <ShoppingBag className="text-[14px]" />
                    View bag
                  </button>
                )}
                {lastRecsUnadded.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleAddRoutine(lastRecsUnadded)}
                    disabled={addingRoutine}
                    className="px-3.5 py-2 rounded-full border border-on-background text-on-surface text-[10px] font-label-md uppercase tracking-[0.12em] hover:bg-on-background hover:text-background transition-colors disabled:opacity-50"
                  >
                    {addingRoutine ? "Adding…" : "Add routine"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => submitText("Show me similar products")}
                  className="px-3.5 py-2 rounded-full border border-outline-variant/40 text-[10px] font-label-md uppercase tracking-[0.12em] text-on-surface hover:bg-on-background hover:text-background hover:border-on-background transition-colors"
                >
                  See similar
                </button>
                <button
                  type="button"
                  onClick={() => submitText("Build a complete routine around this")}
                  className="px-3.5 py-2 rounded-full border border-outline-variant/40 text-[10px] font-label-md uppercase tracking-[0.12em] text-on-surface hover:bg-on-background hover:text-background hover:border-on-background transition-colors"
                >
                  Build a routine
                </button>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={handleSmartSubmit}
            className="p-3 bg-surface border-t border-outline-variant/20 flex gap-2 items-center pb-[max(12px,env(safe-area-inset-bottom))]"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about your skin…"
              className="flex-1 p-2.5 text-sm bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary rounded-sm transition-all"
            />
            <button
              type="submit"
              disabled={isBusy || !input.trim()}
              className="w-10 h-10 rounded-full bg-on-background text-background flex items-center justify-center hover:bg-primary transition-colors disabled:opacity-40"
              aria-label="Send"
            >
              <ArrowForward className="text-[18px]" />
            </button>
          </form>

          {preview && (
            <AssistantProductPreview
              product={preview}
              isAdding={addingIds.includes(preview.id)}
              isAdded={addedIds.includes(preview.id)}
              onAdd={(quantity) => handleAdd(preview, quantity)}
              onClose={() => setPreview(null)}
            />
          )}
        </div>
      )}
    </>
  );
}
