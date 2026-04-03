import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  return (
    <div className="scrollbar-smooth h-full overflow-y-auto">
      <div className="surface-panel-strong sticky top-0 z-10 rounded-b-[28px] rounded-t-none border-x-0 border-t-0 px-6 py-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h1 className="max-w-xl text-2xl font-bold text-slate-950">{problem.title}</h1>
          <span className={`badge badge-lg shrink-0 font-semibold ${getDifficultyBadgeClass(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className="mb-5 text-base subtle-text">{problem.category}</p>

        <div>
          <label className="mini-label mb-2 block">switch problem</label>
          <select
            className="select select-md w-full rounded-2xl border-slate-200 bg-white font-medium shadow-sm"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <div className="surface-panel p-6">
          <h2 className="mb-4 text-2xl font-bold text-slate-950">Description</h2>
          <div className="space-y-4 text-base leading-relaxed">
            <p className="text-slate-800">{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="text-slate-700">
                {note}
              </p>
            ))}
          </div>
        </div>

        <div className="surface-panel p-6">
          <h2 className="mb-6 text-2xl font-bold text-slate-950">Examples</h2>
          <div className="space-y-6">
            {problem.examples.map((example, idx) => (
              <div key={idx} className="rounded-[24px] border border-slate-200 bg-white/70 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <span className="status-chip bg-sky-100 text-sky-700">{`example ${idx + 1}`}</span>
                </div>
                <div className="surface-dark space-y-3 p-5 text-sm">
                  <div className="flex gap-3">
                    <span className="min-w-[70px] font-semibold text-sky-300">Input:</span>
                    <span className="text-slate-200">{example.input}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="min-w-[70px] font-semibold text-emerald-300">Output:</span>
                    <span className="text-slate-200">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="mt-2 border-t border-slate-700 pt-3 text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">Explanation: </span>
                      {example.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-panel p-6">
          <h2 className="mb-4 text-2xl font-bold text-slate-950">Constraints</h2>
          <ul className="space-y-3">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="mt-0.5 text-lg text-emerald-700">�</span>
                <code className="rounded-xl bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  {constraint}
                </code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;
