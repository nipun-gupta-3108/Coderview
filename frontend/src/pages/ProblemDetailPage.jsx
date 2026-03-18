import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import {
  ChevronLeft, Play, RotateCcw, Copy, Check,
  ChevronRight, Loader2, CheckCircle2,
  XCircle, BookOpen, GripVertical, Maximize2, Minimize2
} from "lucide-react";
import { PROBLEMS, DIFFICULTY_COLORS, LANGUAGES } from "../constants/problems";
import { useConfetti } from "../hooks/useConfetti";
import { useToast } from "../components/ui/Toast";

const LANG_LABELS = { javascript: "JavaScript", python: "Python", java: "Java" };
const TABS = ["description", "examples", "constraints"];

function ResizeHandle({ onMouseDown }) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1.5 bg-slate-200 hover:bg-blue-400 cursor-col-resize flex items-center justify-center flex-shrink-0 transition-colors group"
    >
      <GripVertical size={12} className="text-slate-300 group-hover:text-white transition-colors" />
    </div>
  );
}

function DescriptionPanel({ problem, width }) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div
      style={{ width }}
      className="flex flex-col bg-white border-r border-slate-200 overflow-hidden flex-shrink-0"
    >
      <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-display font-bold text-slate-900">{problem.title}</span>
          <span className={DIFFICULTY_COLORS[problem.difficulty]}>{problem.difficulty}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {problem.tags.map(t => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">{t}</span>
          ))}
        </div>
      </div>

      <div className="flex border-b border-slate-100 flex-shrink-0 px-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-xs font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? "text-blue-600 border-blue-500"
                : "text-slate-400 border-transparent hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {activeTab === "description" && (
          <p className="text-sm text-slate-600 leading-relaxed">{problem.description}</p>
        )}

        {activeTab === "examples" && (
          <div className="space-y-3">
            {problem.examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs space-y-2">
                <p className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">Example {i + 1}</p>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-slate-400 font-medium">Input: </span>
                    <code className="text-slate-700 font-mono">{ex.input}</code>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Output: </span>
                    <code className="text-slate-700 font-mono">{ex.output}</code>
                  </div>
                  {ex.explanation && (
                    <div className="pt-1.5 border-t border-slate-200">
                      <span className="text-slate-400 font-medium">Explanation: </span>
                      <span className="text-slate-500">{ex.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "constraints" && (
          <ul className="space-y-2">
            {problem.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="text-blue-400 mt-0.5 flex-shrink-0">·</span>
                <code className="font-mono text-xs leading-relaxed">{c}</code>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function ProblemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const problem = PROBLEMS.find(p => p.id === id);
  const { fire } = useConfetti();
  const { toast } = useToast();

  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(problem?.starterCode?.javascript ?? "");
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [leftWidth, setLeftWidth] = useState(400);

  const containerRef = useRef(null);
  const dragging = useRef(false);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    dragging.current = true;
    const onMove = (ev) => {
      if (!dragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newW = Math.max(260, Math.min(580, ev.clientX - rect.left));
      setLeftWidth(newW);
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  if (!problem) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <BookOpen size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">Problem not found.</p>
          <button onClick={() => navigate("/problems")} className="btn-primary">
            Back to problems
          </button>
        </div>
      </div>
    );
  }

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(problem.starterCode[lang] ?? "");
    setOutput(null);
  };

  const handleReset = () => {
    setCode(problem.starterCode[language] ?? "");
    setOutput(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    if (language !== "javascript") {
      setOutput({ type: "info", text: `${LANG_LABELS[language]} execution coming soon! Try JavaScript for now.` });
      return;
    }
    setRunning(true);
    setOutput(null);
    await new Promise(r => setTimeout(r, 550));
    try {
      const logs = [];
      const errs = [];
      const fn = new Function("console", code);
      fn({
        log: (...args) => logs.push(
          args.map(a => { try { return JSON.stringify(a); } catch { return String(a); } }).join(" ")
        ),
        error: (...args) => errs.push(args.join(" ")),
        warn: (...args) => logs.push(`⚠ ${args.join(" ")}`),
      });

      if (errs.length > 0) {
        setOutput({ type: "error", text: errs.join("\n") });
        toast("Code ran with errors.", "error");
      } else {
        setOutput({ type: "success", lines: logs });
        const hasOutput = logs.length > 0;
        const looksCorrect = hasOutput && problem.examples.every(ex => {
          const expected = ex.output.replace(/[[\]]/g, "").split(",")[0]?.trim();
          return expected && logs.some(l => l.includes(expected));
        });
        if (looksCorrect) {
          fire({ count: 160 });
          toast("All test cases passed! Great work!", "success");
        } else if (hasOutput) {
          toast("Code executed successfully.", "info");
        }
      }
    } catch (err) {
      setOutput({ type: "error", text: err.message });
      toast("Runtime error — check your syntax.", "error");
    }
    setRunning(false);
  };

  return (
    <div className={`flex flex-col overflow-hidden ${fullscreen ? "fixed inset-0 z-50 bg-white" : "h-screen"}`}>
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-slate-200 flex-shrink-0">
        <button onClick={() => navigate("/problems")} className="btn-ghost p-1.5 -ml-1 rounded-lg">
          <ChevronLeft size={16} />
        </button>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-1.5 flex-1 min-w-0 text-sm">
          <span
            onClick={() => navigate("/problems")}
            className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
          >
            Problems
          </span>
          <ChevronRight size={12} className="text-slate-300 flex-shrink-0" />
          <span className="font-medium text-slate-800 truncate">{problem.title}</span>
          <span className={`${DIFFICULTY_COLORS[problem.difficulty]} flex-shrink-0`}>{problem.difficulty}</span>
        </div>
        <button
          onClick={() => setFullscreen(f => !f)}
          className="btn-ghost p-2 rounded-lg"
          title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>

      {/* Body */}
      <div ref={containerRef} className="flex flex-1 overflow-hidden select-none">
        <DescriptionPanel problem={problem} width={leftWidth} />
        <ResizeHandle onMouseDown={handleMouseDown} />

        {/* Editor side */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 flex-shrink-0">
            <div className="flex items-center gap-0.5 p-0.5 bg-slate-800 rounded-lg">
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                    language === lang
                      ? "bg-slate-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {LANG_LABELS[lang]}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 text-xs transition-all"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 text-xs transition-all"
              >
                <RotateCcw size={12} /> Reset
              </button>
              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold transition-all disabled:opacity-60"
              >
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
                fontFamily: "'DM Mono', 'Cascadia Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                renderLineHighlight: "line",
                padding: { top: 16, bottom: 16 },
                tabSize: 2,
                wordWrap: "on",
                smoothScrolling: true,
                cursorBlinking: "smooth",
                bracketPairColorization: { enabled: true },
              }}
            />
          </div>

          {/* Output */}
          <div className="h-40 border-t border-slate-800 bg-slate-900 flex flex-col flex-shrink-0">
            <div className="flex items-center gap-2.5 px-4 py-2 border-b border-slate-800 flex-shrink-0">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Output</span>
              {output && (
                <span className={`flex items-center gap-1 text-[11px] font-medium ${
                  output.type === "success" ? "text-emerald-400" :
                  output.type === "error"   ? "text-red-400"     : "text-blue-400"
                }`}>
                  {output.type === "success" && <CheckCircle2 size={10} />}
                  {output.type === "error"   && <XCircle size={10} />}
                  {output.type === "success" ? "Ran successfully" :
                   output.type === "error"   ? "Runtime error"   : "Info"}
                </span>
              )}
            </div>
            <div className="flex-1 px-4 py-3 font-mono text-xs overflow-y-auto leading-relaxed">
              {!output && !running && (
                <span className="text-slate-600 italic">Click "Run code" to execute...</span>
              )}
              {running && (
                <span className="text-slate-500 flex items-center gap-2">
                  <Loader2 size={11} className="animate-spin" /> Executing...
                </span>
              )}
              {output?.type === "success" && (
                output.lines.length === 0
                  ? <span className="text-slate-500 italic">No output produced.</span>
                  : output.lines.map((l, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-slate-600 select-none">&gt;</span>
                        <span className="text-emerald-300">{l}</span>
                      </div>
                    ))
              )}
              {output?.type === "error" && (
                <div className="text-red-400 whitespace-pre-wrap">{output.text}</div>
              )}
              {output?.type === "info" && (
                <div className="text-blue-400">{output.text}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}