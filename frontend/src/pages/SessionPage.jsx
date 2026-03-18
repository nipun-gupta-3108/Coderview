import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import Editor from "@monaco-editor/react";
import {
  Play, RotateCcw, Loader2, CheckCircle2, XCircle,
  MessageSquare, PhoneOff, Copy, Check, Clock,
  Users, ChevronDown, ChevronRight, Zap, Share2
} from "lucide-react";

import { getSessionById, endSession } from "../lib/api";
import { PROBLEMS, DIFFICULTY_COLORS, LANGUAGES } from "../constants/problems";
import VideoPanel from "../components/session/VideoPanel";
import ChatPanel from "../components/session/ChatPanel";
import InviteModal from "../components/session/InviteModal";
import { useConfetti } from "../hooks/useConfetti";
import { useToast } from "../components/ui/Toast";

const LANG_LABELS = { javascript: "JavaScript", python: "Python", java: "Java" };

function SessionTimer({ startTime }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const base = startTime ? Math.max(0, Date.now() - new Date(startTime).getTime()) : 0;
    setElapsed(Math.floor(base / 1000));
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [startTime]);
  const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  return (
    <span className="flex items-center gap-1 text-slate-500 text-xs font-mono bg-slate-100 px-2 py-1 rounded-md">
      <Clock size={10} /> {m}:{s}
    </span>
  );
}

function ProblemPane({ problem }) {
  const [descOpen, setDescOpen] = useState(true);
  if (!problem) return null;

  return (
    <div className="w-[300px] flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto">
      <div className="p-4 space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h2 className="font-display font-bold text-slate-900 text-sm">{problem.title}</h2>
            <span className={DIFFICULTY_COLORS[problem.difficulty]}>{problem.difficulty}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {problem.tags.map(t => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{t}</span>
            ))}
          </div>
        </div>

        <div>
          <button
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 hover:text-slate-800 transition-colors"
            onClick={() => setDescOpen(!descOpen)}
          >
            {descOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />} Description
          </button>
          {descOpen && <p className="text-slate-600 text-xs leading-relaxed">{problem.description}</p>}
        </div>

        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Examples</p>
          <div className="space-y-2">
            {problem.examples.slice(0, 2).map((ex, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1.5 text-xs">
                <div><span className="text-slate-400">Input: </span><code className="font-mono text-slate-700 text-[11px]">{ex.input}</code></div>
                <div><span className="text-slate-400">Output: </span><code className="font-mono text-slate-700 text-[11px]">{ex.output}</code></div>
                {ex.explanation && <p className="text-slate-400 text-[11px]">{ex.explanation}</p>}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Constraints</p>
          <ul className="space-y-1.5">
            {problem.constraints.map((c, i) => (
              <li key={i} className="text-[11px] text-slate-500 flex gap-1.5 items-start">
                <span className="text-blue-400 flex-shrink-0 mt-px">·</span>
                <code className="font-mono">{c}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function SessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { fire } = useConfetti();
  const { toast } = useToast();

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const { data: session, isLoading } = useQuery({
    queryKey: ["session", id],
    queryFn: () => getSessionById(id),
    refetchInterval: 8000,
  });

  const endMutation = useMutation({
    mutationFn: () => endSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["sessions"]);
      navigate("/dashboard");
    },
  });

  const problem = session ? PROBLEMS.find(p => p.title === session.problem) : null;

  useEffect(() => {
    if (problem && !code) {
      setCode(problem.starterCode?.javascript ?? "");
    }
  }, [problem]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (problem) setCode(problem.starterCode?.[lang] ?? "");
    setOutput(null);
  };

  const handleRun = async () => {
    if (language !== "javascript") {
      setOutput({ type: "info", text: `${LANG_LABELS[language]} execution coming soon. Use JavaScript for now!` });
      return;
    }
    setRunning(true);
    setOutput(null);
    await new Promise(r => setTimeout(r, 500));
    try {
      const logs = [];
      const fn = new Function("console", code);
      fn({ log: (...args) => logs.push(args.map(a => { try { return JSON.stringify(a); } catch { return String(a); } }).join(" ")) });
      setOutput({ type: "success", lines: logs });

      const looksCorrect = logs.length > 0 && problem?.examples?.every(ex => {
        const expected = ex.output.replace(/[\[\]]/g, "").split(",")[0]?.trim();
        return expected && logs.some(l => l.includes(expected));
      });

      if (looksCorrect) {
        fire({ count: 160 });
        toast("All test cases passed!", "success");
      } else if (logs.length > 0) {
        toast("Code executed successfully.", "info");
      }
    } catch (err) {
      setOutput({ type: "error", text: err.message });
      toast("Runtime error — check your syntax.", "error");
    }
    setRunning(false);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleEnd = () => {
    if (confirm("End this session? This will disconnect both participants.")) {
      endMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 size={24} className="text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Session not found.</p>
          <button onClick={() => navigate("/dashboard")} className="btn-primary">Back to dashboard</button>
        </div>
      </div>
    );
  }

  const isHost = session.host?.clerkId === user?.id || session.host === user?.id || String(session.host?._id) === String(user?.id);
  console.log("[isHost debug]", { hostClerkId: session.host?.clerkId, hostId: session.host?._id, hostRaw: session.host, userId: user?.id, isHost });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">

      {/* ── Top bar ── */}
      <header className="flex items-center gap-3 px-5 py-2.5 bg-white border-b border-slate-200 flex-shrink-0 shadow-sm z-10">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Zap size={13} className="text-white" fill="white" />
        </div>
        <div className="w-px h-5 bg-slate-200" />
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="font-display font-bold text-slate-900 text-sm truncate">{session.problem}</span>
          {session.difficulty && <span className={DIFFICULTY_COLORS[session.difficulty]}>{session.difficulty}</span>}
          <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-xs">
            <Users size={11} />
            <span>{session.participant ? "2" : "1"}/2</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <SessionTimer startTime={session.createdAt} />
          {!session.participant && (
              <button onClick={() => setShowInvite(true)} className="btn-secondary text-xs py-1.5 px-3 gap-1.5">
                <Share2 size={12} />
                Invite
              </button>
            )}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`btn-ghost text-xs py-1.5 px-3 gap-1.5 ${chatOpen ? "text-blue-600 bg-blue-50 rounded-lg" : ""}`}
          >
            <MessageSquare size={13} /> Chat
          </button>
          {isHost && (
            <button
              onClick={handleEnd}
              disabled={endMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-medium transition-colors border border-red-100"
            >
              {endMutation.isPending ? <Loader2 size={11} className="animate-spin" /> : <PhoneOff size={11} />}
              End
            </button>
          )}
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Problem pane */}
        <ProblemPane problem={problem} />

        {/* Code editor */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-0.5 p-0.5 bg-slate-800 rounded-lg">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                    language === lang ? "bg-slate-600 text-white" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {LANG_LABELS[lang]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={handleCopyCode} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 text-xs transition-all">
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button onClick={() => problem && setCode(problem.starterCode?.[language] ?? "")} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 text-xs transition-all">
                <RotateCcw size={12} /> Reset
              </button>
              <button onClick={handleRun} disabled={running} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all disabled:opacity-60">
                {running ? <Loader2 size={11} className="animate-spin" /> : <Play size={11} fill="white" />}
                {running ? "Running..." : "Run code"}
              </button>
            </div>
          </div>

          {/* Monaco */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={val => setCode(val ?? "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "'DM Mono', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "line",
                padding: { top: 16, bottom: 16 },
                tabSize: 2,
                wordWrap: "on",
                smoothScrolling: true,
                cursorBlinking: "smooth",
              }}
            />
          </div>

          {/* Output */}
          <div className="h-36 border-t border-slate-800 bg-slate-900 flex flex-col flex-shrink-0">
            <div className="flex items-center gap-2.5 px-4 py-2 border-b border-slate-800">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Output</span>
              {output && (
                <span className={`flex items-center gap-1 text-[11px] font-medium ${
                  output.type === "success" ? "text-emerald-400" :
                  output.type === "error" ? "text-red-400" : "text-blue-400"
                }`}>
                  {output.type === "success" ? <CheckCircle2 size={10} /> : output.type === "error" ? <XCircle size={10} /> : null}
                  {output.type === "success" ? "Success" : output.type === "error" ? "Error" : "Info"}
                </span>
              )}
            </div>
            <div className="flex-1 px-4 py-3 font-mono text-xs overflow-y-auto leading-relaxed">
              {!output && !running && <span className="text-slate-600 italic">Click "Run code" to execute...</span>}
              {running && <span className="text-slate-500 flex items-center gap-2"><Loader2 size={11} className="animate-spin" />Executing...</span>}
              {output?.type === "success" && (
                output.lines.length === 0
                  ? <span className="text-slate-500 italic">No output.</span>
                  : output.lines.map((l, i) => <div key={i} className="text-emerald-300"><span className="text-slate-600 mr-2 select-none">&gt;</span>{l}</div>)
              )}
              {output?.type === "error" && <div className="text-red-400 whitespace-pre-wrap">{output.text}</div>}
              {output?.type === "info" && <div className="text-blue-400">{output.text}</div>}
            </div>
          </div>
        </div>

        {/* Video column */}
        <div className="w-56 flex-shrink-0 border-l border-slate-800 flex flex-col">
          <VideoPanel callId={session.callId} session={session} currentUser={user} />
        </div>

        {/* Chat drawer */}
        {chatOpen && (
          <div className="w-72 flex-shrink-0 border-l border-slate-200 animate-slide-in-left">
            <ChatPanel callId={session.callId} onClose={() => setChatOpen(false)} />
          </div>
        )}
      </div>

      {showInvite && (
        <InviteModal sessionId={id} onClose={() => setShowInvite(false)} />
      )}
    </div>
  );
}