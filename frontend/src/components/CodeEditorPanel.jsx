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
    <div className="h-full flex flex-col bg-gradient-to-br from-base-200 to-base-300">
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-base-100 to-base-200 border-b border-base-300/50 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="w-6 h-6"
          />
          <select
            className="select select-md font-bold border-base-300/60 bg-base-100 hover:border-primary/40"
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
          className="btn btn-md bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-xl border-none disabled:opacity-50 gap-2"
          disabled={isRunning}
          onClick={onRunCode}
        >
          {isRunning ? (
            <>
              <Loader2Icon className="w-5 h-5 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <PlayIcon className="w-5 h-5" />
              <span>Run Code</span>
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
            fontFamily: "'Fira Code', 'Courier New', monospace",
            lineHeight: 22,
          }}
        />
      </div>
    </div>
  );
}
export default CodeEditorPanel;