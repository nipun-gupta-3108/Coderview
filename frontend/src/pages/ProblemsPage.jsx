import { Link } from "react-router";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="app-shell">
      <Navbar />

      <div className="page-wrap py-10">
        <div className="surface-panel-strong mb-8 px-6 py-8 sm:px-8">
          <p className="mini-label mb-2">problem library</p>
          <h1 className="text-5xl font-bold text-slate-950">Practice Problems</h1>
          <p className="mt-4 max-w-2xl text-lg subtle-text">
            Sharpen your interview instincts with a tighter, more readable list of curated questions.
          </p>
        </div>

        <div className="mb-12 space-y-4">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="surface-panel-strong block p-6 hover:-translate-y-1"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-start gap-4">
                    <div className="icon-chip h-14 w-14 shrink-0">
                      <Code2Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-bold text-slate-950">{problem.title}</h2>
                        <span className={`badge badge-lg font-semibold ${getDifficultyBadgeClass(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </div>
                      <p className="text-sm subtle-text">{problem.category}</p>
                    </div>
                  </div>
                  <p className="leading-7 subtle-text">{problem.description.text}</p>
                </div>

                <div className="flex items-center gap-2 font-semibold text-emerald-700">
                  Solve
                  <ChevronRightIcon className="h-5 w-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="surface-panel-strong p-6 sm:p-7">
          <h3 className="text-2xl font-bold text-slate-950">Statistics</h3>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <div className="text-4xl font-bold text-slate-950">{problems.length}</div>
              <div className="mt-2 text-sm subtle-text">Total Problems</div>
            </div>

            <div>
              <div className="text-4xl font-bold text-emerald-700">{easyProblemsCount}</div>
              <div className="mt-2 text-sm subtle-text">Easy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-600">{mediumProblemsCount}</div>
              <div className="mt-2 text-sm subtle-text">Medium</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-rose-600">{hardProblemsCount}</div>
              <div className="mt-2 text-sm subtle-text">Hard</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;
