import { useState, useEffect, useRef } from "react";
import { X, Send, Wifi, WifiOff } from "lucide-react";
import { useStreamChat } from "../../hooks/useStreamChat";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../../lib/api";

function Avatar({ name, image, size = "sm" }) {
  const s = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  if (image) {
    return <img src={image} alt={name} className={`${s} rounded-full object-cover flex-shrink-0`} />;
  }
  return (
    <div className={`${s} rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0`}>
      <span className="text-white font-semibold">{name?.[0] ?? "?"}</span>
    </div>
  );
}

export default function ChatPanel({ callId, onClose }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const { data: tokenData } = useQuery({
    queryKey: ["stream-token"],
    queryFn: getStreamToken,
    staleTime: 1000 * 60 * 50,
  });

  const { messages, connected, sendMessage } = useStreamChat(callId);

  // Demo messages when Stream isn't configured
  const [demoMessages, setDemoMessages] = useState([
    { id: "d1", text: "Hey! Ready to tackle this one?", author: "Partner", userId: "partner", createdAt: new Date(Date.now() - 120000) },
    { id: "d2", text: "Yeah! I'm thinking hash map approach.", author: "You", userId: tokenData?.userId ?? "me", createdAt: new Date(Date.now() - 60000) },
  ]);

  const isDemoMode = !import.meta.env.VITE_STREAM_API_KEY;
  const displayMessages = isDemoMode ? demoMessages : messages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    if (isDemoMode) {
      setDemoMessages(prev => [
        ...prev,
        { id: Date.now().toString(), text: input, author: "You", userId: tokenData?.userId ?? "me", createdAt: new Date() },
      ]);
    } else {
      await sendMessage(input);
    }
    setInput("");
    inputRef.current?.focus();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const myId = tokenData?.userId;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 text-sm">Chat</span>
          <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${
            isDemoMode || connected
              ? "bg-emerald-50 text-emerald-600 border-emerald-200"
              : "bg-amber-50 text-amber-600 border-amber-200"
          }`}>
            {isDemoMode || connected
              ? <><Wifi size={9} /> Live</>
              : <><WifiOff size={9} /> Connecting</>
            }
          </span>
        </div>
        <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
          <X size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {displayMessages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400 text-xs">No messages yet. Say hi!</p>
          </div>
        )}
        {displayMessages.map((msg, i) => {
          const isSelf = isDemoMode
            ? msg.userId === (tokenData?.userId ?? "me")
            : msg.userId === myId;
          const showAuthor = i === 0 || displayMessages[i - 1]?.userId !== msg.userId;

          return (
            <div key={msg.id} className={`flex gap-2 ${isSelf ? "flex-row-reverse" : "flex-row"}`}>
              {showAuthor && !isSelf && (
                <Avatar name={msg.author} image={msg.image} />
              )}
              {!showAuthor && !isSelf && <div className="w-6 flex-shrink-0" />}

              <div className={`max-w-[78%] ${isSelf ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                {showAuthor && !isSelf && (
                  <span className="text-[10px] text-slate-400 ml-0.5">{msg.author}</span>
                )}
                <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  isSelf
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-slate-100 text-slate-800 rounded-tl-sm"
                }`}>
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-300 px-1">{formatTime(msg.createdAt)}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-3 py-3 border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none font-sans"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            <Send size={12} className="text-white" />
          </button>
        </div>
        <p className="text-[10px] text-slate-300 mt-1.5 text-center">Press Enter to send</p>
      </div>
    </div>
  );
}