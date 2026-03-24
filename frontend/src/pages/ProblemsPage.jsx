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
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            Practice Problems
          </h1>
          <p className="text-lg text-base-content/70 font-medium max-w-2xl">
            Sharpen your coding skills with these curated problems
          </p>
        </div>

        {/* PROBLEMS LIST */}
        <div className="space-y-4 mb-12">
          {problems.map((problem) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="card-premium hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
            >
              <div className="card-body">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="icon-box-primary w-14 h-14 flex-shrink-0">
                        <Code2Icon className="w-7 h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold">{problem.title}</h2>
                          <span className={`badge badge-lg font-bold ${getDifficultyBadgeClass(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-base-content/60 mb-3">
                          {problem.category}
                        </p>
                      </div>
                    </div>
                    <p className="text-base text-base-content/80 leading-relaxed">
                      {problem.description.text}
                    </p>
                  </div>
                  {/* RIGHT SIDE */}
                  <div className="flex items-center gap-3 text-primary font-bold whitespace-nowrap">
                    <span>Solve</span>
                    <ChevronRightIcon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* STATS FOOTER */}
        <div className="card-premium shadow-2xl">
          <div className="card-body">
            <h3 className="text-2xl font-bold mb-6">Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                  {problems.length}
                </div>
                <div className="text-sm font-semibold text-base-content/70">Total Problems</div>
              </div>

              <div>
                <div className="text-4xl font-black text-success mb-2">{easyProblemsCount}</div>
                <div className="text-sm font-semibold text-base-content/70">Easy</div>
              </div>
              <div>
                <div className="text-4xl font-black text-warning mb-2">{mediumProblemsCount}</div>
                <div className="text-sm font-semibold text-base-content/70">Medium</div>
              </div>
              <div>
                <div className="text-4xl font-black text-error mb-2">{hardProblemsCount}</div>
                <div className="text-sm font-semibold text-base-content/70">Hard</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;