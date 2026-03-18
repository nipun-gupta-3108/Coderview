import { useEffect, useState, useRef } from "react";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

export function useStreamVideo(callId) {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  const { data: tokenData } = useQuery({
    queryKey: ["stream-token"],
    queryFn: getStreamToken,
    staleTime: 1000 * 60 * 50,
  });

  useEffect(() => {
    if (!tokenData || !callId) return;

    const apiKey = import.meta.env.VITE_STREAM_API_KEY;
    if (!apiKey) {
      console.warn("VITE_STREAM_API_KEY not set — video running in demo mode");
      return;
    }

    let cancelled = false;

    async function connect() {
      try {
        const videoClient = new StreamVideoClient({
          apiKey,
          user: {
            id: tokenData.userId,
            name: tokenData.userName,
            image: tokenData.userImage,
          },
          token: tokenData.token,
        });

        clientRef.current = videoClient;

        const videoCall = videoClient.call("default", callId);
        await videoCall.join({ create: false });

        if (cancelled) return;

        setClient(videoClient);
        setCall(videoCall);
        setConnected(true);
      } catch (err) {
        console.error("Stream video connection error:", err);
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
      setCall(null);
      setConnected(false);
    };
  }, [tokenData, callId]);

  return { client, call, connected };
}