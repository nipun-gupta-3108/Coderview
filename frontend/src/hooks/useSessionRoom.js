import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useStream } from "./useStream";
import { getStreamToken } from "../lib/api";

export function useSessionRoom(session) {
  const { user } = useUser();
  const { chatClient, isReady: chatReady } = useStream();

  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [error, setError] = useState(null);

  const callRef = useRef(null);

  useEffect(() => {
    if (!session || !chatClient || !chatReady) return;

    let vidClient;

    const setup = async () => {
      try {
        const { token, userId } = await getStreamToken();

        // Video client
        vidClient = new StreamVideoClient({
          apiKey: import.meta.env.VITE_STREAM_API_KEY,
          user: {
            id: userId,
            name: user?.fullName ?? "User",
            image: user?.imageUrl,
          },
          token,
        });

        const videoCall = vidClient.call("default", session.callId);
        callRef.current = videoCall;

        await videoCall.join({ create: false });
        setCall(videoCall);
        setIsJoined(true);
        setVideoClient(vidClient);

        // Chat channel
        const chatChannel = chatClient.channel("messaging", session.callId);
        await chatChannel.watch();
        setChannel(chatChannel);
      } catch (err) {
        console.error("Session room setup failed:", err);
        setError(err.message);
      }
    };

    setup();

    return () => {
      callRef.current?.leave().catch(console.error);
      vidClient?.disconnectUser().catch(console.error);
    };
  }, [session?.callId, chatReady]);

  return { videoClient, call, channel, isJoined, error };
}