import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className="editor-shell flex flex-col">
      <div className="flex items-center justify-between gap-4 border-b border-slate-700/70 bg-slate-950/70 px-5 py-4">
        <div className="flex items-center gap-3">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="h-6 w-6"
          />
          <select
            className="select select-sm rounded-full border-slate-700 bg-slate-900 font-semibold text-slate-100"
            value={selectedLanguage}
            onChange={onLanguageChange}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button
          className="action-button rounded-full px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isRunning}
          onClick={onRunCode}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="h-4 w-4" />
              Run Code
            </>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 15,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            padding: { top: 16, bottom: 16 },
            fontFamily: "'IBM Plex Mono', monospace",
            lineHeight: 22,
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;
