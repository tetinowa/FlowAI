"use client";
import { ArrowUp, Bot, Sparkles, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { apiFetch } from "@/lib/apiFetch";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    const updatedChat: Message[] = [...chat, { role: "user", content: msg }];
    setChat(updatedChat);
    setInput("");
    setLoading(true);
    try {
      const response = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ chats: updatedChat }),
      });
      const data = await response.json();
      setChat((prev) => [...prev, { role: "assistant", content: data.res || "Хариулт авахад алдаа гарлаа" }]);
    } catch {
      setChat((prev) => [...prev, { role: "assistant", content: "Холболтын алдаа гарлаа." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      {/* Chat panel */}
      <div
        className={`absolute bottom-16 right-0 w-[380px] max-w-[calc(100vw-2rem)] transition-all duration-300 origin-bottom-right ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-white/10 flex flex-col bg-[#0f1117]" style={{ height: "520px" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-none">FlowAI Assistant</p>
                <p className="text-white/60 text-[11px] mt-0.5">Таны ухаалаг туслах</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 scrollbar-thin">
            {chat.length === 0 && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center">
                  <Bot className="w-7 h-7 text-violet-400" />
                </div>
                <div className="text-center">
                  <p className="text-white/80 font-semibold text-sm">Сайн байна уу!</p>
                  <p className="text-white/30 text-xs mt-1">Санхүү, маркетинг талаар асуугаарай</p>
                </div>
                <div className="flex flex-col gap-2 w-full mt-2">
                  {["Санхүүгийн зөвлөгөө өгөөч", "Маркетингийн стратеги юу вэ?", "Зардлаа хэрхэн бууруулах вэ?"].map((q) => (
                    <button
                      key={q}
                      onClick={() => { setInput(q); inputRef.current?.focus(); }}
                      className="text-left px-4 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/50 hover:text-white/80 text-xs transition-all duration-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mr-2 mt-0.5 shrink-0">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm max-w-[78%] whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm"
                      : "bg-white/[0.06] text-white/85 border border-white/[0.06] rounded-tl-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.06] border border-white/[0.06] flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 px-3 pb-3 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-2.5 focus-within:border-violet-500/50 focus-within:bg-violet-500/[0.04] transition-all duration-200">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Асуултаа бичнэ үү..."
                className="flex-1 bg-transparent text-sm text-white/80 placeholder:text-white/20 outline-none"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 disabled:opacity-30 hover:opacity-90 transition-all duration-200 disabled:cursor-not-allowed"
              >
                <ArrowUp className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/30 transition-all duration-300 ${
          open
            ? "bg-white/10 border border-white/10 rotate-0"
            : "bg-gradient-to-br from-violet-600 to-indigo-600 hover:scale-105 hover:shadow-violet-500/50"
        }`}
      >
        {open ? (
          <X className="w-5 h-5 text-white/70" />
        ) : (
          <Sparkles className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
