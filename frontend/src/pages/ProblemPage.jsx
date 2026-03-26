import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import AIInsightCard from "../components/AIInsightCard";
import { executeCode } from "../lib/OneCompiler";
import { explainAiProblem, getAiHint, reviewAiCode } from "../lib/ai";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [aiHint, setAiHint] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [isGettingHint, setIsGettingHint] = useState(false);
  const [aiReview, setAiReview] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [aiExplanation, setAiExplanation] = useState("");
  const [isExplaining, setIsExplaining] = useState(false);

  const currentProblem = PROBLEMS[currentProblemId];

  // update problem when URL param changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
      setAiHint("");
      setHintLevel(0);
      setAiReview("");
      setAiExplanation("");
    }
  }, [id, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
    setAiHint("");
    setHintLevel(0);
    setAiReview("");
    setAiExplanation("");
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    // normalize output for comparison (trim whitespace, handle different spacing)
    return output
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          // remove spaces after [ and before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    return normalizedActual == normalizedExpected;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);

    // check if code executed successfully and matches expected output

    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);

      if (testsPassed) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");
      } else {
        toast.error("Tests failed. Check your output!");
      }
    } else {
      toast.error("Code execution failed!");
    }
  };

  const handleGetHint = async () => {
    const nextHintLevel = Math.min(hintLevel + 1, 3);

    setIsGettingHint(true);

    const result = await getAiHint({
      title: currentProblem.title,
      description: currentProblem.description.text,
      examples: currentProblem.examples,
      constraints: currentProblem.constraints,
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
    setIsReviewing(true);

    const result = await reviewAiCode({
      title: currentProblem.title,
      description: currentProblem.description.text,
      examples: currentProblem.examples,
      constraints: currentProblem.constraints,
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
    setIsExplaining(true);

    const result = await explainAiProblem({
      title: currentProblem.title,
      description: currentProblem.description.text,
      examples: currentProblem.examples,
      constraints: currentProblem.constraints,
    });

    setIsExplaining(false);

    if (result.success) {
      setAiExplanation(result.explanation);
      toast.success("AI explanation ready");
      return;
    }

    toast.error(result.error || "Failed to explain problem");
  };

  return (
    <div className="app-shell flex h-screen flex-col">
      <Navbar />

      <div className="page-wrap flex-1 overflow-hidden py-4">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="mx-2 w-1 cursor-col-resize rounded-full bg-[linear-gradient(180deg,rgba(20,83,45,0.16),rgba(14,165,233,0.5),rgba(245,158,11,0.18))]" />

          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                />
              </Panel>

              <PanelResizeHandle className="my-2 h-1 cursor-row-resize rounded-full bg-[linear-gradient(90deg,rgba(20,83,45,0.16),rgba(14,165,233,0.5),rgba(245,158,11,0.18))]" />

              <Panel defaultSize={30} minSize={30}>
                <div className="flex h-full flex-col gap-4">
                  <div className="surface-panel p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">AI Hint</h3>
                        <p className="text-sm subtle-text">
                          AI tumhe guide karega, full solution nahi dega.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleGetHint}
                        disabled={isGettingHint || hintLevel >= 3}
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
                      emptyText="Stuck ho? Get Hint dabao aur next nudge le lo."
                      accent="emerald"
                    />
                  </div>

                  <div className="surface-panel p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">AI Code Review</h3>
                        <p className="text-sm subtle-text">
                          Current solution ka quick feedback aur bug-risk analysis.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleReviewCode}
                        disabled={isReviewing}
                        className="btn btn-outline rounded-2xl border-slate-300 bg-white"
                      >
                        {isReviewing ? "Reviewing..." : "Review Code"}
                      </button>
                    </div>

                    <AIInsightCard
                      content={aiReview}
                      emptyText="Code likhne ke baad Review Code dabao aur AI se focused feedback lo."
                      accent="sky"
                    />
                  </div>

                  <div className="surface-panel p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">AI Explain Problem</h3>
                        <p className="text-sm subtle-text">
                          Problem ko simple language me break down karwa lo.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleExplainProblem}
                        disabled={isExplaining}
                        className="btn btn-outline rounded-2xl border-slate-300 bg-white"
                      >
                        {isExplaining ? "Explaining..." : "Explain Problem"}
                      </button>
                    </div>

                    <AIInsightCard
                      content={aiExplanation}
                      emptyText="Problem heavy lag raha ho to Explain Problem use karo."
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
      </div>
    </div>
  );
}

export default ProblemPage;
