"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown';

export default function StoreAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [localProgress, setLocalProgress] = useState<string>("");
  const worker = useRef<Worker | null>(null);

  const [input, setInput] = useState("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);

  // Initialize standard Vercel AI SDK (this will hit Groq, then DeepSeek)
  const { messages, setMessages, sendMessage, status } = useChat({
    // @ts-ignore
    transport: new DefaultChatTransport({ api: "/api/assistant" }),
    onError: (error: any) => {
      // Circuit Breaker: If both Groq & DeepSeek fail, we flip to local mode
      if (error.message.includes("429") || error.message.includes("primary_engine_exhausted") || error.message.includes("Timeout")) {
        console.warn("Cloud engines exhausted or timed out. Engaging local WebGPU fallback...");
        setIsLocalMode(true);
        triggerLocalFallback();
      }
    },
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Setup Web Worker on mount (but it won't download the model until triggered)
  useEffect(() => {
    worker.current = new Worker(new URL("../../lib/fallback-worker.ts", import.meta.url), {
      type: "module",
    });

    worker.current.addEventListener("message", (e) => {
      if (e.data.type === "progress") {
        if (e.data.data.status === "progress") {
          setLocalProgress(`Downloading AI Model... ${Math.round(e.data.data.progress || 0)}%`);
        } else if (e.data.data.status === "ready") {
          setLocalProgress("Local AI Engine Online.");
          setTimeout(() => setLocalProgress(""), 3000);
        }
      }
      
      if (e.data.type === "complete") {
        // Append the local AI's response to the Vercel AI SDK message state
        setMessages((prev: any[]) => [
          ...prev,
          { id: Date.now().toString(), role: "assistant", parts: [{ type: "text", text: e.data.output }] },
        ]);
      }
      
      if (e.data.type === "error") {
        setLocalProgress(`Fallback Error: ${e.data.error}`);
      }
    });

    return () => worker.current?.terminate();
  }, [setMessages]);

  const triggerLocalFallback = () => {
    // Send the current conversation history to the local Transformers.js worker
    worker.current?.postMessage({
      messages: [...messages.map((m: any) => ({ role: m.role, content: m.parts?.map((p: any) => p.type === "text" ? p.text : "").join("") || "" })), { role: "user", content: input }],
    });
  };

  const handleSmartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (isLocalMode) {
      // Bypass API completely and route to client GPU
      setMessages((prev: any[]) => [...prev, { id: Date.now().toString(), role: "user", parts: [{ type: "text", text: input }] }]);
      triggerLocalFallback();
    } else {
      // Standard cloud routing
      sendMessage({ role: "user", parts: [{ type: "text", text: input }] });
    }
    
    // Clear input
    setInput("");
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-on-background text-background rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-50 group"
        aria-label="Toggle Shopping Assistant"
      >
        <span className="material-symbols-outlined text-[24px]">
          {isOpen ? "close" : "forum"}
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] bg-surface shadow-2xl rounded-sm border border-outline-variant/20 overflow-hidden z-50 flex flex-col animate-fade-in-up">
          {/* Header */}
          <div
            className={`p-4 flex items-center justify-between ${
              isLocalMode ? "bg-[#333] text-white" : "bg-surface-container text-on-surface"
            }`}
          >
            <div>
              <h3 className="font-label-md text-xs uppercase tracking-widest font-semibold">
                Elvara Assistant
              </h3>
              <p className="font-body-sm text-[10px] opacity-70">
                {isLocalMode ? "Offline Fallback Mode" : "Powered by AI"}
              </p>
            </div>
            {isLocalMode && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
            )}
          </div>

          {/* Progress Indicator (for WebGPU Download) */}
          {localProgress && (
            <div className="bg-primary/10 text-primary text-xs p-2 text-center border-b border-primary/20">
              {localProgress}
            </div>
          )}

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-background">
            {messages.length === 0 && (
              <div className="text-center text-on-surface-variant text-sm mt-10 opacity-70 font-body-md">
                Hello! I am your personal Elvara Skinlane beauty assistant. How can I help you refine your routine today?
              </div>
            )}
            
            {messages.map((m: any) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <span
                  className={`inline-block p-3 rounded-2xl text-sm max-w-[85%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-on-background text-background rounded-tr-sm"
                      : "bg-surface-container-low text-on-surface border border-outline-variant/10 rounded-tl-sm shadow-sm"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                      ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                      a: ({ node, ...props }) => <a className="text-primary underline font-medium hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                      strong: ({ node, ...props }) => <strong className="font-semibold text-primary" {...props} />
                    }}
                  >
                    {m.parts?.map((p: any) => p.type === "text" ? p.text : "").join("") || m.content || ""}
                  </ReactMarkdown>
                </span>
              </div>
            ))}
            {isLoading && !isLocalMode && (
              <div className="flex justify-start">
                <span className="inline-flex gap-1 p-4 bg-surface-container-low rounded-2xl rounded-tl-sm">
                  <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce delay-200"></span>
                </span>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSmartSubmit}
            className="p-3 bg-surface border-t border-outline-variant/20 flex gap-2 items-center"
          >
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about your routine..."
              className="flex-1 p-2 text-sm bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary rounded-sm transition-all"
            />
            <button
              type="submit"
              disabled={isLoading && !isLocalMode}
              className="text-primary font-label-md text-xs uppercase tracking-wider px-3 py-2 hover:bg-primary/5 rounded-sm transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
