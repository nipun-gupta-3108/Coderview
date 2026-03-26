import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2Icon className="mx-auto h-16 w-16 animate-spin text-emerald-600" />
          <p className="text-xl font-bold text-slate-900">Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="str-video relative flex h-full gap-4">
      <div className="flex flex-1 flex-col gap-4">
        <div className="surface-panel flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <div className="icon-chip">
              <UsersIcon className="h-6 w-6" />
            </div>
            <span className="text-lg font-semibold text-slate-900">
              {participantCount} {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>
          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={isChatOpen ? "action-button px-4 py-2 text-sm" : "action-button-secondary px-4 py-2 text-sm"}
              title={isChatOpen ? "Hide chat" : "Show chat"}
            >
              <MessageSquareIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Chat</span>
            </button>
          )}
        </div>

        <div className="surface-dark flex-1 overflow-hidden p-1">
          <SpeakerLayout />
        </div>

        <div className="surface-panel flex justify-center p-4">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {chatClient && channel && (
        <div
          className={`surface-dark flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-96 visible opacity-100" : "invisible w-0 opacity-0"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="flex items-center justify-between border-b border-slate-700/60 px-4 py-4">
                <h3 className="text-lg font-semibold text-white">Session Chat</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title="Close chat"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden stream-chat-dark">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageInput />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoCallUI;
