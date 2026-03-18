import { useState } from "react";
import {
  StreamVideo, StreamCall, CallControls,
  SpeakerLayout, useCallStateHooks
} from "@stream-io/video-react-sdk";
import { Mic, MicOff, Video, VideoOff, Maximize2, Users, Loader2 } from "lucide-react";
import { useStreamVideo } from "../../hooks/useStreamVideo";

// Demo video panel shown when Stream isn't configured
function DemoVideoPanel({ session, currentUser }) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const host = session?.host;
  const participant = session?.participant;
  const hasPartner = !!participant;

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Partner video (top, larger) */}
      <div className="flex-1 bg-slate-800 relative flex items-center justify-center">
        {hasPartner ? (
          <>
            {participant?.profileImage ? (
              <img src={participant.profileImage} alt="" className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-600" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center ring-2 ring-slate-600">
                <span className="text-white text-xl font-semibold">
                  {participant?.name?.[0] ?? "P"}
                </span>
              </div>
            )}
            <div className="absolute bottom-2 left-3">
              <span className="text-xs text-white/80 bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                {participant?.name ?? "Partner"}
              </span>
            </div>
          </>
        ) : (
          <div className="text-center px-4">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center mx-auto mb-3">
              <Users size={18} className="text-slate-500" />
            </div>
            <p className="text-slate-500 text-xs">Waiting for partner...</p>
            <p className="text-slate-600 text-[10px] mt-1">Share the session link</p>
          </div>
        )}
      </div>

      {/* Self video (bottom, smaller) */}
      <div className="h-24 border-t border-slate-700/50 bg-slate-900 flex items-center justify-center relative">
        {currentUser?.imageUrl ? (
          <img src={currentUser.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-slate-700">
            <span className="text-white text-sm font-semibold">
              {currentUser?.firstName?.[0] ?? "Y"}
            </span>
          </div>
        )}
        <div className="absolute bottom-2 left-3">
          <span className="text-[10px] text-white/60">You</span>
        </div>
        {!camOn && (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <VideoOff size={16} className="text-slate-600" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="h-12 bg-slate-950 border-t border-slate-800 flex items-center justify-center gap-3 flex-shrink-0">
        <button
          onClick={() => setMicOn(!micOn)}
          title={micOn ? "Mute mic" : "Unmute mic"}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            micOn
              ? "bg-slate-700 hover:bg-slate-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {micOn ? <Mic size={13} /> : <MicOff size={13} />}
        </button>
        <button
          onClick={() => setCamOn(!camOn)}
          title={camOn ? "Turn off camera" : "Turn on camera"}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            camOn
              ? "bg-slate-700 hover:bg-slate-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {camOn ? <Video size={13} /> : <VideoOff size={13} />}
        </button>
        <button
          title="Toggle fullscreen"
          className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition-all"
          onClick={() => document.documentElement.requestFullscreen?.()}
        >
          <Maximize2 size={12} />
        </button>
      </div>
    </div>
  );
}

// Real Stream video panel
function LiveVideoPanel({ call }) {
  return (
    <StreamCall call={call}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-hidden">
          <SpeakerLayout />
        </div>
        <div className="bg-slate-950 py-2 flex justify-center">
          <CallControls />
        </div>
      </div>
    </StreamCall>
  );
}

export default function VideoPanel({ callId, session, currentUser }) {
  const hasStreamKey = !!import.meta.env.VITE_STREAM_API_KEY;
  const { client, call, connected } = useStreamVideo(hasStreamKey ? callId : null);

  if (!hasStreamKey) {
    return <DemoVideoPanel session={session} currentUser={currentUser} />;
  }

  if (!connected || !client || !call) {
    return (
      <div className="flex flex-col h-full bg-slate-900 items-center justify-center">
        <Loader2 size={20} className="text-blue-400 animate-spin mb-2" />
        <p className="text-slate-500 text-xs">Connecting video...</p>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <LiveVideoPanel call={call} />
    </StreamVideo>
  );
}