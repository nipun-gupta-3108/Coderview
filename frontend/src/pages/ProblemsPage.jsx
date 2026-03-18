import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ChevronRight, Code2 } from "lucide-react";
import { PROBLEMS, DIFFICULTY_COLORS } from "../constants/problems";

const DIFFICULTIES = ["all", "easy", "medium", "hard"];
const ALL_TAGS = [...new Set(PROBLEMS.flatMap(p => p.tags))];

export default function ProblemsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [tag, setTag] = useState("all");

  const filtered = PROBLEMS.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchDiff = difficulty === "all" || p.difficulty === difficulty;
    const matchTag = tag === "all" || p.tags.includes(tag);
    return matchSearch && matchDiff && matchTag;
  });

  const counts = {
    all: PROBLEMS.length,
    easy: PROBLEMS.filter(p => p.difficulty === "easy").length,
    medium: PROBLEMS.filter(p => p.difficulty === "medium").length,
    hard: PROBLEMS.filter(p => p.difficulty === "hard").length,
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-in">
        <h1 className="font-display text-2xl font-bold text-slate-900">Practice problems</h1>
        <p className="text-slate-500 text-sm mt-1">Sharpen your skills with curated interview problems</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 animate-in-delay-1">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9 py-2.5 text-sm"
            placeholder="Search problems or tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Tag filter */}
        <div className="relative">
          <select
            className="select py-2.5 pr-8 text-sm min-w-36"
            value={tag}
            onChange={e => setTag(e.target.value)}
          >
            <option value="all">All topics</option>
            {ALL_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <Filter size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Difficulty tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-6 animate-in-delay-1 w-fit">
        {DIFFICULTIES.map(d => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
              difficulty === d
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {d}
            <span className={`ml-1.5 text-xs ${difficulty === d ? "text-slate-400" : "text-slate-300"}`}>
              {counts[d]}
            </span>
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-6 animate-in-delay-2">
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <span className="font-medium text-slate-900">{filtered.length}</span> problems
        </div>
        <div className="text-slate-300">|</div>
        <div className="flex items-center gap-3 text-xs">
          <span className="badge-easy">Easy {counts.easy}</span>
          <span className="badge-medium">Medium {counts.medium}</span>
          <span className="badge-hard">Hard {counts.hard}</span>
        </div>
      </div>

      {/* Problem list */}
      <div className="space-y-2 animate-in-delay-2">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Code2 size={24} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No problems match your search.</p>
          </div>
        ) : (
          filtered.map((problem, i) => (
            <button
              key={problem.id}
              onClick={() => navigate(`/problems/${problem.id}`)}
              className="card w-full px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-blue-100 transition-all group text-left"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Index */}
              <span className="text-slate-300 text-sm font-mono w-7 flex-shrink-0 text-right">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                <Code2 size={15} className="text-blue-600" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900 text-sm">{problem.title}</span>
                  <span className={DIFFICULTY_COLORS[problem.difficulty]}>{problem.difficulty}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {problem.tags.map(t => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description preview */}
              <p className="hidden md:block text-xs text-slate-400 max-w-xs truncate flex-shrink-0">
                {problem.description}
              </p>

              <ChevronRight size={15} className="text-slate-300 group-hover:text-blue-400 transition-colors flex-shrink-0" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}