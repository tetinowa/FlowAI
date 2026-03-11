"use client";
import { Button } from "@/components/ui/button";
import { ArrowUp, LoaderCircle, MessageCircle, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Message = {
  role: "user" | "assistant";
  content: string;
};
type ChatSectionProps = {
  chat: Message[];
  loading: boolean;
  input: string;
  setInput: (val: string) => void;
  setopen: (val: boolean) => void;
  GenerateMsg: (input: string) => void;
};
const ChatSection = ({
  chat,
  loading,
  input,
  setInput,
  setopen,
  GenerateMsg,
}: ChatSectionProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  return (
    <>
      <Card className="fixed bottom-24 right-6 w-96 max-w-[90vw] h-125 rounded-2xl shadow-xl shadow-gray-300">
        <div className="w-full h-full flex flex-col">
          <div className="px-5 py-3 flex gap-2 items-center border-b shrink-0">
            <Button size="icon" className="rounded-full" onClick={() => setopen(false)}>
              <X />
            </Button>
            <p className="text-xl font-medium">AI Assistant</p>
          </div>

          <CardContent className="flex-1 overflow-y-auto flex flex-col gap-2 py-3">
            {chat.length === 0 && !loading && (
              <div className="w-full h-full flex justify-center items-center text-gray-400">
                Hi! How can I help you?
              </div>
            )}
            {chat.map((c, index) => (
              <div
                key={index}
                className={`rounded-2xl px-3 py-1 w-fit max-w-[85%] whitespace-pre-wrap text-sm ${
                  c.role === "assistant"
                    ? "bg-gray-200 text-gray-800"
                    : "bg-gray-500 text-white self-end"
                }`}
              >
                {c.content}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <LoaderCircle className="animate-spin size-4" />
                <span>Бодож байна...</span>
              </div>
            )}
            <div ref={bottomRef} />
          </CardContent>

          <div className="shrink-0 p-2 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) GenerateMsg(input);
                }}
              />
              <Button size="icon" disabled={loading} onClick={() => GenerateMsg(input)}>
                <ArrowUp />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
export default function ChatBubble() {
  const [open, setopen] = useState(false);
  const [chat, setChat] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setloading] = useState(false);
  const [hover, setHover] = useState(false);

  async function GenerateMsg(input: string) {
    if (!input.trim()) return;
    const msg = input.trim();
    const updatedChat: Message[] = [...chat, { role: "user", content: msg }];
    setChat(updatedChat);
    setInput("");

    try {
      setloading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ chats: updatedChat }),
      });
      const data = await response.json();
      const res = data.res || "Хариулт авахад алдаа гарлаа";
      setChat((prev) => [...prev, { role: "assistant", content: res }]);
    } catch (e) {
      console.error(e);
    } finally {
      setloading(false);
    }
  }

  return (
    <div className={`${open ? "duration-300" : "duration-300"}`}>
      {open ? (
        <>
          <ChatSection
            chat={chat}
            loading={loading}
            input={input}
            setInput={setInput}
            setopen={setopen}
            GenerateMsg={GenerateMsg}
          />
        </>
      ) : (
        <Button
          onClick={() => {
            setopen(true);
            setHover(false);
          }}
          onMouseEnter={() => {
            setHover(true);
          }}
          onMouseLeave={() => {
            setHover(false);
          }}
          className={`${hover ? "rounded-2xl duration-200" : "rounded-full  duration-200"}`}
        >
          {hover ? <p>Help</p> : <MessageCircle />}
        </Button>
      )}
    </div>
  );
}
