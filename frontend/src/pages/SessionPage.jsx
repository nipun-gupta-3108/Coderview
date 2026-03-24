import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/OneCompiler";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const joinSessionMutation = useJoinSession();
  const endSessionMutation = useEndSession();

  const session = sessionData?.session;
  const isHost = session?.host?.clerkId === user?.id;
  const isParticipant = session?.participant?.clerkId === user?.id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  // find the problem data based on session problem title
  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

  // auto-join session if user is not already a participant and not the host
  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, { onSuccess: refetch });

    // remove the joinSessionMutation, refetch from dependencies to avoid infinite loop
  }, [session, user, loadingSession, isHost, isParticipant, id]);

  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  // update code when problem loads or changes
  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    // use problem-specific starter code
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setCode(starterCode);
    setOutput(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      // this will navigate the HOST to dashboard
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-base-100 to-base-200 flex flex-col">
      <Navbar />

      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DSC PANEL */}
              <Panel defaultSize={50} minSize={20}>
                <div className="h-full overflow-y-auto scrollbar-smooth bg-gradient-to-br from-base-100 to-base-200">
                  {/* HEADER SECTION */}
                  <div className="p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-base-300/50 sticky top-0 z-10">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
                          {session?.problem || "Loading..."}
                        </h1>
                        {problemData?.category && (
                          <p className="text-base font-semibold text-base-content/70 mb-2">
                            {problemData.category}
                          </p>
                        )}
                        <p className="text-sm font-semibold text-base-content/70">
                          <span className="text-base-content font-bold">Host:</span> {session?.host?.name || "Loading..."} •{" "}
                          <span className="text-base-content font-bold">{session?.participant ? 2 : 1}/2</span> participants
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <span
                          className={`badge badge-lg font-bold ${getDifficultyBadgeClass(
                            session?.difficulty
                          )}`}
                        >
                          {session?.difficulty.slice(0, 1).toUpperCase() +
                            session?.difficulty.slice(1) || "Easy"}
                        </span>
                        {isHost && session?.status === "active" && (
                          <button
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="btn btn-sm bg-gradient-to-r from-error to-error/70 text-white font-bold border-none shadow-lg hover:shadow-xl gap-2"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="w-4 h-4 animate-spin" />
                            ) : (
                              <LogOutIcon className="w-4 h-4" />
                            )}
                            End Session
                          </button>
                        )}
                        {session?.status === "completed" && (
                          <span className="badge badge-lg bg-success/20 text-success font-bold border-success/50">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* problem desc */}
                    {problemData?.description && (
                      <div className="card-premium border-primary/30">
                        <div className="card-body">
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                            Description
                          </h2>
                          <div className="space-y-4 text-base leading-relaxed">
                            <p className="text-base-content/90 font-medium">{problemData.description.text}</p>
                            {problemData.description.notes?.map((note, idx) => (
                              <p key={idx} className="text-base-content/90 font-medium">
                                {note}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* examples section */}
                    {problemData?.examples && problemData.examples.length > 0 && (
                      <div className="card-premium border-secondary/30">
                        <div className="card-body">
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-6">
                            Examples
                          </h2>

                          <div className="space-y-6">
                            {problemData.examples.map((example, idx) => (
                              <div
                                key={idx}
                                className="bg-base-100/50 rounded-2xl p-5 border border-base-300/40 hover:border-secondary/50 transition-all"
                              >
                                <div className="flex items-center gap-3 mb-4">
                                  <span className="badge badge-md bg-gradient-to-r from-secondary to-accent text-white font-bold">
                                    {idx + 1}
                                  </span>
                                  <p className="font-bold text-lg">Example {idx + 1}</p>
                                </div>
                                <div className="bg-slate-900 rounded-xl p-5 font-mono text-sm space-y-2 border border-base-300/30">
                                  <div className="flex gap-3">
                                    <span className="text-info font-bold min-w-[70px]">Input:</span>
                                    <span className="text-slate-300">{example.input}</span>
                                  </div>
                                  <div className="flex gap-3">
                                    <span className="text-success font-bold min-w-[70px]">Output:</span>
                                    <span className="text-slate-300">{example.output}</span>
                                  </div>
                                  {example.explanation && (
                                    <div className="pt-3 border-t border-slate-700 mt-2">
                                      <span className="text-slate-400 font-sans text-xs block">
                                        <span className="font-semibold text-slate-300">Explanation: </span>
                                        {example.explanation}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Constraints */}
                    {problemData?.constraints && problemData.constraints.length > 0 && (
                      <div className="card-premium border-accent/30">
                        <div className="card-body">
                          <h2 className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-4">
                            Constraints
                          </h2>
                          <ul className="space-y-3">
                            {problemData.constraints.map((constraint, idx) => (
                              <li key={idx} className="flex gap-3 items-start">
                                <span className="text-accent font-bold text-lg mt-0.5">•</span>
                                <code className="text-sm font-semibold text-base-content/80 bg-base-200/50 px-3 py-1 rounded-lg">
                                  {constraint}
                                </code>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Panel>

              <PanelResizeHandle className="h-1 bg-gradient-to-r from-primary/20 via-secondary/50 to-accent/20 hover:from-primary hover:via-secondary hover:to-accent transition-all duration-300 cursor-row-resize shadow-lg" />

              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={(value) => setCode(value)}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-1 bg-gradient-to-r from-primary/20 via-secondary/50 to-accent/20 hover:from-primary hover:via-secondary hover:to-accent transition-all duration-300 cursor-row-resize shadow-lg" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-1 bg-gradient-to-b from-primary/20 via-secondary/50 to-accent/20 hover:from-primary hover:via-secondary hover:to-accent transition-all duration-300 cursor-col-resize shadow-lg" />

          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-gradient-to-br from-base-200 to-base-300 p-4 overflow-auto">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Loader2Icon className="w-16 h-16 mx-auto animate-spin text-primary" />
                    <p className="text-xl font-bold text-base-content">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="card-premium max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-error/10 rounded-2xl flex items-center justify-center mb-4">
                        <PhoneOffIcon className="w-12 h-12 text-error" />
                      </div>
                      <h2 className="text-2xl font-black text-base-content">Connection Failed</h2>
                      <p className="text-base-content/70 font-medium">
                        Unable to connect to the video call
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default SessionPage;