import { getDifficultyBadgeClass } from "../lib/utils";
function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  return (
    <div className="h-full overflow-y-auto scrollbar-smooth bg-gradient-to-br from-base-100 to-base-200">
      {/* HEADER SECTION */}
      <div className="p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b border-base-300/50 sticky top-0 z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {problem.title}
          </h1>
          <span className={`badge badge-lg font-bold flex-shrink-0 ${getDifficultyBadgeClass(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        <p className="text-base font-semibold text-base-content/70 mb-5">{problem.category}</p>

        {/* Problem selector */}
        <div>
          <label className="text-sm font-bold text-base-content/60 block mb-2">Switch Problem</label>
          <select
            className="select select-md w-full font-medium border-base-300/60 bg-base-100 hover:border-primary/40"
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

      <div className="p-6 space-y-6">
        {/* PROBLEM DESC */}
        <div className="card-premium border-primary/30">
          <div className="card-body">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Description
            </h2>

            <div className="space-y-4 text-base leading-relaxed">
              <p className="text-base-content/90 font-medium">{problem.description.text}</p>
              {problem.description.notes.map((note, idx) => (
                <p key={idx} className="text-base-content/90 font-medium">
                  {note}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className="card-premium border-secondary/30">
          <div className="card-body">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-6">
              Examples
            </h2>
            <div className="space-y-6">
              {problem.examples.map((example, idx) => (
                <div key={idx} className="bg-base-100/50 rounded-2xl p-5 border border-base-300/40 hover:border-secondary/50 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="badge badge-md bg-gradient-to-r from-secondary to-accent text-white font-bold">
                      {idx + 1}
                    </span>
                    <p className="font-bold text-lg text-base-content">Example {idx + 1}</p>
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

        {/* CONSTRAINTS */}
        <div className="card-premium border-accent/30">
          <div className="card-body">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-4">
              Constraints
            </h2>
            <ul className="space-y-3">
              {problem.constraints.map((constraint, idx) => (
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
      </div>
    </div>
  );
}

export default ProblemDescription;