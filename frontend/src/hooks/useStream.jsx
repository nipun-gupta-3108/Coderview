import { createContext, useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useUser } from "@clerk/clerk-react";
import { getStreamToken } from "../lib/api";

const StreamContext = createContext(null);

export function StreamProvider({ children }) {
  const { user, isSignedIn } = useUser();
  const [chatClient, setChatClient] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    let client;

    const init = async () => {
      try {
        const { token, userId, userName, userImage } = await getStreamToken();

        client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

        await client.connectUser(
          { id: userId, name: userName, image: userImage },
          token
        );

        setChatClient(client);
        setIsReady(true);
      } catch (err) {
        console.error("Stream init error:", err);
      }
    };

    init();

    return () => {
      client?.disconnectUser().catch(console.error);
      setChatClient(null);
      setIsReady(false);
    };
  }, [isSignedIn, user?.id]);

  return (
    <StreamContext.Provider value={{ chatClient, isReady }}>
      {children}
    </StreamContext.Provider>
  );
}

export const useStream = () => useContext(StreamContext);