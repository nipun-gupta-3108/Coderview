import { useEffect, useState, useRef } from "react";
import { StreamChat } from "stream-chat";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

export function useStreamChat(callId) {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  const { data: tokenData } = useQuery({
    queryKey: ["stream-token"],
    queryFn: getStreamToken,
    staleTime: 1000 * 60 * 50, // 50 minutes
  });

  useEffect(() => {
    if (!tokenData || !callId) return;

    const apiKey = import.meta.env.VITE_STREAM_API_KEY;
    if (!apiKey) {
      console.warn("VITE_STREAM_API_KEY not set — chat running in demo mode");
      return;
    }

    let cancelled = false;

    async function connect() {
      try {
        const chatClient = StreamChat.getInstance(apiKey);
        clientRef.current = chatClient;

        await chatClient.connectUser(
          {
            id: tokenData.userId,
            name: tokenData.userName,
            image: tokenData.userImage,
          },
          tokenData.token
        );

        if (cancelled) return;

        const ch = chatClient.channel("messaging", callId);
        await ch.watch();

        if (cancelled) return;

        // Load existing messages
        const existing = ch.state.messages.map(normalizeMsg);
        setMessages(existing);

        // Listen for new messages
        ch.on("message.new", (event) => {
          setMessages(prev => [...prev, normalizeMsg(event.message)]);
        });

        setClient(chatClient);
        setChannel(ch);
        setConnected(true);
      } catch (err) {
        console.error("Stream chat connection error:", err);
      }
    }

    connect();

    return () => {
      cancelled = true;
      if (clientRef.current) {
        clientRef.current.disconnectUser().catch(() => {});
        clientRef.current = null;
      }
      setClient(null);
      setChannel(null);
      setConnected(false);
    };
  }, [tokenData, callId]);

  const sendMessage = async (text) => {
    if (!channel || !text.trim()) return;
    try {
      await channel.sendMessage({ text });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return { client, channel, messages, connected, sendMessage };
}

function normalizeMsg(msg) {
  return {
    id: msg.id,
    text: msg.text ?? "",
    author: msg.user?.name ?? "Unknown",
    userId: msg.user?.id,
    image: msg.user?.image,
    createdAt: msg.created_at ? new Date(msg.created_at) : new Date(),
  };
}