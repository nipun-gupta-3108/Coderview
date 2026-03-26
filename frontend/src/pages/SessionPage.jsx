import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import { Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import AIInsightCard from "../components/AIInsightCard";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import ProblemDescription from "../components/ProblemDescription";
import VideoCallUI from "../components/VideoCallUI";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/OneCompiler";
import { explainAiProblem, getAiHint, reviewAiCode } from "../lib/ai";
import { getDifficultyBadgeClass } from "../lib/utils";
import useStreamClient from "../hooks/useStreamClient";
import { useEndSession, useJoinSession, useSessionById } from "../hooks/useSessions";

function SessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUser();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [aiHint, setAiHint] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [isGettingHint, setIsGettingHint] = useState(false);
  const [aiReview, setAiReview] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);

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

  const problemData = session?.problem
    ? Object.values(PROBLEMS).find((problem) => problem.title === session.problem)
    : null;

  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problemData?.starterCode?.[selectedLanguage] || "");

  useEffect(() => {
    if (!session || !user || loadingSession) return;
    if (isHost || isParticipant) return;

    joinSessionMutation.mutate(id, { onSuccess: refetch });
  }, [session, user, loadingSession, isHost, isParticipant, id, joinSessionMutation, refetch]);

  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  useEffect(() => {
    if (problemData?.starterCode?.[selectedLanguage]) {
      setCode(problemData.starterCode[selectedLanguage]);
      setOutput(null);
      setAiHint("");
      setHintLevel(0);
      setAiReview("");
      setAiExplanation("");
    }
  }, [problemData, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    const starterCode = problemData?.starterCode?.[newLang] || "";

    setSelectedLanguage(newLang);
    setCode(starterCode);
    setOutput(null);
    setAiHint("");
    setHintLevel(0);
    setAiReview("");
    setAiExplanation("");
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  const handleGetHint = async () => {
    if (!problemData) return;

    const nextHintLevel = Math.min(hintLevel + 1, 3);
    setIsGettingHint(true);

    const result = await getAiHint({
      title: problemData.title,
      description: problemData.description.text,
      examples: problemData.examples,
      constraints: problemData.constraints,
      language: selectedLanguage,
      code,
      hintLevel: nextHintLevel,
    });

    setIsGettingHint(false);

    if (result.success) {
      setAiHint(result.hint);
      setHintLevel(result.hintLevel);
      toast.success(`Hint ${result.hintLevel} ready`);
      return;
    }

    toast.error(result.error || "Failed to get hint");
  };

  const handleReviewCode = async () => {
    if (!problemData) return;

    setIsReviewing(true);

    const result = await reviewAiCode({
      title: problemData.title,
      description: problemData.description.text,
      examples: problemData.examples,
      constraints: problemData.constraints,
      language: selectedLanguage,
      code,
    });

    setIsReviewing(false);

    if (result.success) {
      setAiReview(result.review);
      toast.success("AI review ready");
      return;
    }

    toast.error(result.error || "Failed to review code");
  };

  const handleExplainProblem = async () => {
    if (!problemData) return;

    setIsExplaining(true);

    const result = await explainAiProblem({
      title: problemData.title,
      description: problemData.description.text,
      examples: problemData.examples,
      constraints: problemData.constraints,
    });

    setIsExplaining(false);

    if (result.success) {
      setAiExplanation(result.explanation);
      toast.success("AI explanation ready");
      return;
    }

    toast.error(result.error || "Failed to explain problem");
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  return (
    <div className="app-shell flex h-screen flex-col">
      <Navbar />

      <div className="page-wrap flex-1 overflow-hidden py-4">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={50} minSize={20}>
                {problemData ? (
                  <div className="flex h-full flex-col overflow-hidden">
                    <div className="surface-panel-strong border-x-0 border-t-0 px-6 py-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="mini-label mb-2">live session</p>
                          <p className="text-sm subtle-text">
                            Host: {session?.host?.name || "Loading..."} • {session?.participant ? 2 : 1}/2 participants
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <span
                            className={`badge badge-lg font-bold ${getDifficultyBadgeClass(
                              session?.difficulty
                            )}`}
                          >
                            {session?.difficulty?.slice(0, 1).toUpperCase() +
                              session?.difficulty?.slice(1) || "Easy"}
                          </span>

                          {isHost && session?.status === "active" && (
                            <button
                              onClick={handleEndSession}
                              disabled={endSessionMutation.isPending}
                              className="btn btn-sm bg-gradient-to-r from-error to-error/70 text-white font-bold border-none shadow-lg hover:shadow-xl gap-2"
                            >
                              {endSessionMutation.isPending ? (
                                <Loader2Icon className="h-4 w-4 animate-spin" />
                              ) : (
                                <LogOutIcon className="h-4 w-4" />
                              )}
                              End Session
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="min-h-0 flex-1">
                      <ProblemDescription
                        problem={problemData}
                        currentProblemId={problemData.id}
                        onProblemChange={() => {}}
                        allProblems={[problemData]}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="surface-panel flex h-full items-center justify-center">
                    <p className="text-sm subtle-text">Problem details loading...</p>
                  </div>
                )}
              </Panel>

              <PanelResizeHandle className="my-2 h-1 cursor-row-resize rounded-full bg-[linear-gradient(90deg,rgba(20,83,45,0.16),rgba(14,165,233,0.5),rgba(245,158,11,0.18))]" />

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

                  <PanelResizeHandle className="my-2 h-1 cursor-row-resize rounded-full bg-[linear-gradient(90deg,rgba(20,83,45,0.16),rgba(14,165,233,0.5),rgba(245,158,11,0.18))]" />

                  <Panel defaultSize={30} minSize={15}>
                    <div className="flex h-full flex-col gap-4">
                      <div className="surface-panel p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-slate-950">AI Hint</h3>
                            <p className="text-sm subtle-text">
                              Session ke beech progressive hints lo.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleGetHint}
                            disabled={isGettingHint || hintLevel >= 3 || !problemData}
                            className="btn btn-primary rounded-2xl"
                          >
                            {isGettingHint
                              ? "Thinking..."
                              : hintLevel === 0
                                ? "Get Hint"
                                : hintLevel < 3
                                  ? "Next Hint"
                                  : "Max Hints Used"}
                          </button>
                        </div>

                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          Hint Level {hintLevel || 1}/3
                        </p>
                        <AIInsightCard
                          content={aiHint}
                          emptyText="Need a nudge? Get Hint dabao aur session flow break kiye bina guidance lo."
                          accent="emerald"
                        />
                      </div>

                      <div className="surface-panel p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-slate-950">AI Code Review</h3>
                            <p className="text-sm subtle-text">
                              Current approach ki correctness aur bug-risk check karo.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleReviewCode}
                            disabled={isReviewing || !problemData}
                            className="btn btn-outline rounded-2xl border-slate-300 bg-white"
                          >
                            {isReviewing ? "Reviewing..." : "Review Code"}
                          </button>
                        </div>

                        <AIInsightCard
                          content={aiReview}
                          emptyText="Current code ka focused feedback chahiye ho to Review Code use karo."
                          accent="sky"
                        />
                      </div>

                      <div className="surface-panel p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-bold text-slate-950">AI Explain Problem</h3>
                            <p className="text-sm subtle-text">
                              Session start me problem ko quickly simplify kar lo.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={handleExplainProblem}
                            disabled={isExplaining || !problemData}
                            className="btn btn-outline rounded-2xl border-slate-300 bg-white"
                          >
                            {isExplaining ? "Explaining..." : "Explain Problem"}
                          </button>
                        </div>

                        <AIInsightCard
                          content={aiExplanation}
                          emptyText="Problem ko fast simplify karna ho to Explain Problem use karo."
                          accent="amber"
                        />
                      </div>

                      <div className="min-h-0 flex-1">
                        <OutputPanel output={output} />
                      </div>
                    </div>
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="mx-2 w-1 cursor-col-resize rounded-full bg-[linear-gradient(180deg,rgba(20,83,45,0.16),rgba(14,165,233,0.5),rgba(245,158,11,0.18))]" />

          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-gradient-to-br from-base-200 to-base-300 p-4 overflow-auto">
              {isInitializingCall ? (
                <div className="flex h-full items-center justify-center">
                  <div className="space-y-4 text-center">
                    <Loader2Icon className="mx-auto h-16 w-16 animate-spin text-primary" />
                    <p className="text-xl font-bold text-base-content">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="flex h-full items-center justify-center">
                  <div className="card-premium max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-error/10">
                        <PhoneOffIcon className="h-12 w-12 text-error" />
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
