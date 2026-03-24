function OutputPanel({ output }) {
  return (
    <div className="h-full bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col border-t border-base-300/50">
      <div className="px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 font-bold text-sm text-white flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
        Output Console
      </div>
      <div className="flex-1 overflow-auto p-6 scrollbar-smooth">
        {output === null ? (
          <p className="text-slate-400 text-sm font-medium">
            Click "Run Code" to see the output here...
          </p>
        ) : output.success ? (
          <pre className="text-sm font-mono text-emerald-400 whitespace-pre-wrap font-medium leading-relaxed">
            {output.output}
          </pre>
        ) : (
          <div>
            {output.output && (
              <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap mb-3 pb-3 border-b border-slate-700/50 font-medium">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono text-red-400 whitespace-pre-wrap font-medium">{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;