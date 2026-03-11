"use client";
import { Button } from "@/components/ui/button";
import { ArrowUp, LoaderCircle, MessageCircle, Target, X } from "lucide-react";
import { useState, useEffect } from "react";
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
  return (
    <>
      <Card
        className={`fixed bottom-24 right-6 w-96 max-w-[90vw] h-125 rounded-2xl shadow-xl shadow-gray-300`}
      >
        <div className="w-full h-full relative">
          <div className={`px-5 flex gap-2 items-center`}>
            <Button
              size={"icon"}
              className={`rounded-full`}
              onClick={() => {
                setopen(false);
              }}
            >
              <X />
            </Button>
            <p className="text-xl font-medium">AI Assistant</p>
          </div>

          <CardContent className={`w-full h-full flex flex-col gap-2 `}>
            {chat.length !== 0 ? (
              <>
                {loading ? (
                  <LoaderCircle className={`animate-spin duration-1000`} />
                ) : (
                  <>
                    {chat.map((c, index) => (
                      <div
                        key={index}
                        className={`rounded-2xl px-3 py-1 w-fit ${c.role === "assistant" ? "bg-gray-200 shadow-gray-400 shadow-xl " : "bg-gray-500 self-end"}`}
                      >
                        {c.content}
                      </div>
                    ))}
                  </>
                )}
              </>
            ) : (
              <div
                className={`w-full h-full flex justify-center items-center text-gray-400`}
              >
                Hi! How can I help you?
              </div>
            )}
          </CardContent>
          <div className={`absolute bottom-2 w-full p-2`}>
            <div className={`w-full p-2 flex gap-2`}>
              <Input
                placeholder="Ask anything..."
                className={``}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.preventDefault();
                }}
              />
              <Button
                className={``}
                size={"icon"}
                onClick={() => {
                  GenerateMsg(input);
                }}
              >
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
  const [chat, setChat] = useState<Message[] | []>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setloading] = useState(false);
  const [hover, setHover] = useState(false);

  async function GenerateMsg(input: string) {
    if (!input === null || input === "") {
      return;
    }
    const msg = input.trim();
    const updatedChat: Message[] = [...chat, { role: "user", content: msg }];

    setChat(updatedChat);

    console.log("📤 Sending:", JSON.stringify({ chats: updatedChat }, null, 2));

    try {
      setloading(true);
      const response = await fetch("http://localhost:8888/api/chat", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ chats: updatedChat }),
      });
      const { res } = await response.json();

      setChat((prev) => [...prev, { role: "assistant", content: res }]);
      setloading(false);
    } catch (e) {
      console.error(e);
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
