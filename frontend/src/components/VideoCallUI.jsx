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
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-base-100 to-base-200">
        <div className="text-center space-y-4">
          <Loader2Icon className="w-16 h-16 mx-auto animate-spin text-primary" />
          <p className="text-xl font-bold text-base-content">Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-4 relative str-video bg-gradient-to-br from-base-200 to-base-300 p-4">
      <div className="flex-1 flex flex-col gap-4">
        {/* Participants count badge and Chat Toggle */}
        <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-base-100 to-base-200 p-4 rounded-2xl shadow-lg border border-base-300/50">
          <div className="flex items-center gap-3">
            <div className="icon-box-primary w-12 h-12">
              <UsersIcon className="w-6 h-6" />
            </div>
            <span className="font-bold text-lg text-base-content">
              {participantCount} {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>
          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`btn btn-lg font-bold gap-2 transition-all ${
                isChatOpen
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg border-none"
                  : "btn-outline hover:bg-base-200"
              }`}
              title={isChatOpen ? "Hide chat" : "Show chat"}
            >
              <MessageSquareIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Chat</span>
            </button>
          )}
        </div>

        <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl overflow-hidden relative shadow-xl border border-base-300/30">
          <SpeakerLayout />
        </div>

        <div className="bg-gradient-to-r from-base-100 to-base-200 p-4 rounded-2xl shadow-lg border border-base-300/50 flex justify-center">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* CHAT SECTION */}
      {chatClient && channel && (
        <div
          className={`flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-[#272a30] to-[#1a1d22] border border-slate-700/50 transition-all duration-300 ease-in-out ${
            isChatOpen ? "w-96 opacity-100 visible" : "w-0 opacity-0 invisible"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="bg-gradient-to-r from-[#1c1e22] to-[#2a2d33] p-4 border-b border-slate-700/50 flex items-center justify-between shadow-lg">
                <h3 className="font-bold text-white text-lg">Session Chat</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors hover:bg-slate-700/50 p-2 rounded-lg"
                  title="Close chat"
                >
                  <XIcon className="w-5 h-5" />
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