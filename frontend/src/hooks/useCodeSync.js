import { useEffect, useRef } from "react";

function useCodeSync(channel, code, setCode, sessionId, userId, setIsSyncing) {
  const lastSentCodeRef = useRef(code);
  const syncTimeoutRef = useRef(null);

  // Listen for code updates via chat channel custom messages
  useEffect(() => {
    if (!channel) return;

    const handleMessageNew = (event) => {
      try {
        const message = event.message;

        // Check if this is a code-sync message from another user
        if (
          message?.custom?.type === "code-sync" &&
          message.user?.id !== userId &&
          message.custom?.code
        ) {
          setCode(message.custom.code);
        }
      } catch (error) {
        console.error("Error processing code sync message:", error);
      }
    };

    // Listen for new messages
    channel.on("message.new", handleMessageNew);

    return () => {
      channel.off("message.new", handleMessageNew);
    };
  }, [channel, userId, setCode]);

  // Send code updates via chat channel (throttled to every 500ms)
  useEffect(() => {
    if (!channel || code === lastSentCodeRef.current) return;

    const sendCodeUpdate = async () => {
      try {
        setIsSyncing?.(true);
        lastSentCodeRef.current = code;

        await channel.sendMessage({
          custom: {
            type: "code-sync",
            code,
            userId,
            sessionId,
            timestamp: Date.now(),
          },
          text: `[Code Update - ${new Date().toLocaleTimeString()}]`,
        });

        setIsSyncing?.(false);
      } catch (error) {
        console.error("Error sending code update:", error);
        setIsSyncing?.(false);
      }
    };

    // Throttle updates to prevent flooding
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(sendCodeUpdate, 500);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [channel, code, userId, sessionId, setIsSyncing]);
}

export default useCodeSync;
