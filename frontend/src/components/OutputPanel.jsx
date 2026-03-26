function OutputPanel({ output }) {
  return (
    <div className="surface-dark flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-slate-700/60 px-5 py-4 text-sm font-semibold text-slate-100">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        Output Console
      </div>
      <div className="scrollbar-smooth flex-1 overflow-auto p-5">
        {output === null ? (
          <p className="text-sm text-slate-400">
            Click "Run Code" to see the output here...
          </p>
        ) : output.success ? (
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-emerald-300">
            {output.output}
          </pre>
        ) : (
          <div>
            {output.output && (
              <pre className="mb-3 whitespace-pre-wrap border-b border-slate-700/60 pb-3 text-sm text-slate-300">
                {output.output}
              </pre>
            )}
            <pre className="whitespace-pre-wrap text-sm text-rose-300">{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;
