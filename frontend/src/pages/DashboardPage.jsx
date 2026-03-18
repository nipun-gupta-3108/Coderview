import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import {
  Plus, Users, Trophy, Clock, Radio, ArrowRight,
  Loader2, X, ChevronDown, Search, RefreshCw, Zap
} from "lucide-react";

import { getSessions, getMyRecentSessions, createSession, joinSession } from "../lib/api";
import { PROBLEMS, DIFFICULTY_COLORS } from "../constants/problems";

function CreateSessionModal({ onClose, onCreate }) {
  const [problem, setProblem] = useState(PROBLEMS[0].id);
  const selectedProblem = PROBLEMS.find(p => p.id === problem);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="font-display font-semibold text-slate-900">New session</h2>
            <p className="text-xs text-slate-400 mt-0.5">Choose a problem to start</p>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Problem</label>
            <div className="relative">
              <select
                className="select pr-8"
                value={problem}
                onChange={e => setProblem(e.target.value)}
              >
                {PROBLEMS.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.difficulty})
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {selectedProblem && (
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">{selectedProblem.title}</span>
                <span className={DIFFICULTY_COLORS[selectedProblem.difficulty]}>{selectedProblem.difficulty}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedProblem.tags.map(t => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">{t}</span>
                ))}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{selectedProblem.description}</p>
              <p className="text-xs text-slate-400">Max 2 participants</p>
            </div>
          )}

          <button
            onClick={() => onCreate({ problem: selectedProblem.title, difficulty: selectedProblem.difficulty })}
            className="btn-primary w-full justify-center py-3"
          >
            <Zap size={14} /> Create room
          </button>
        </div>
      </div>
    </div>
  );
}

function DiffBadge({ difficulty }) {
  return <span className={DIFFICULTY_COLORS[difficulty] ?? "badge-easy"}>{difficulty}</span>;
}

// eslint-disable-next-line no-unused-vars
function StatCard({ icon: Icon, value, label, color, delay = "" }) {
  return (
    <div className={`card p-5 animate-in${delay}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
        <Icon size={16} />
      </div>
      <div className="font-display text-2xl font-bold text-slate-900 mb-0.5">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const { data: activeSessions = [], isLoading: loadingActive } = useQuery({
    queryKey: ["sessions", "active"],
    queryFn: getSessions,
    refetchInterval: 15000,
  });

  const { data: recentSessions = [], isLoading: loadingRecent } = useQuery({
    queryKey: ["sessions", "recent"],
    queryFn: getMyRecentSessions,
  });

  const createMutation = useMutation({
    mutationFn: createSession,
    onSuccess: (session) => {
      queryClient.invalidateQueries(["sessions"]);
      setShowModal(false);
      navigate(`/session/${session._id}`);
    },
  });

  const joinMutation = useMutation({
    mutationFn: joinSession,
    onSuccess: (session) => {
      queryClient.invalidateQueries(["sessions"]);
      navigate(`/session/${session._id}`);
    },
  });

  const filteredActive = activeSessions.filter(s =>
    s.problem.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-in">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Welcome back, {user?.firstName ?? "there"} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Ready to level up your coding skills?</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={15} /> New session
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Radio}
          value={activeSessions.length}
          label="Live sessions"
          color="bg-blue-50 text-blue-600"
          delay="-delay-1"
        />
        <StatCard
          icon={Trophy}
          value={recentSessions.length}
          label="Total sessions"
          color="bg-emerald-50 text-emerald-600"
          delay="-delay-2"
        />
        <StatCard
          icon={Clock}
          value={recentSessions.filter(s => s.status === "completed").length}
          label="Completed"
          color="bg-violet-50 text-violet-600"
          delay="-delay-3"
        />
      </div>

      {/* Live sessions */}
      <div className="mb-8 animate-in-delay-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-slate-900">Live sessions</h2>
            {activeSessions.length > 0 && (
              <span className="badge-live">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                {activeSessions.length} active
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-8 w-48 py-2 text-xs"
                placeholder="Search problems..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => queryClient.invalidateQueries(["sessions", "active"])}
              className="btn-ghost p-2"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {loadingActive ? (
          <div className="card p-8 flex items-center justify-center">
            <Loader2 size={20} className="text-blue-400 animate-spin" />
          </div>
        ) : filteredActive.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Users size={20} className="text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">No live sessions right now.</p>
            <p className="text-slate-400 text-xs mt-1">Create one to get started!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredActive.map(session => {
              const isFull = !!session.participant;
              return (
                <div key={session._id} className="card px-5 py-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-mono text-xs font-semibold">{"{}"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-slate-900 text-sm truncate">{session.problem}</span>
                      <DiffBadge difficulty={session.difficulty} />
                      {isFull && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                          Full
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        {session.host?.name}
                      </span>
                      <span>{isFull ? "2/2" : "1/2"} participants</span>
                    </div>
                  </div>
                  <button
                    onClick={() => joinMutation.mutate(session._id)}
                    disabled={isFull || joinMutation.isPending}
                    className={isFull ? "btn-secondary opacity-50 cursor-not-allowed text-xs py-2" : "btn-primary text-xs py-2"}
                  >
                    {joinMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : null}
                    {isFull ? "Full" : "Join"} <ArrowRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past sessions */}
      <div className="animate-in-delay-3">
        <h2 className="font-display font-semibold text-slate-900 mb-4">Your past sessions</h2>
        {loadingRecent ? (
          <div className="card p-8 flex items-center justify-center">
            <Loader2 size={20} className="text-blue-400 animate-spin" />
          </div>
        ) : recentSessions.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <Clock size={20} className="text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">No past sessions yet.</p>
            <p className="text-slate-400 text-xs mt-1">Your completed sessions will appear here.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Problem</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Difficulty</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Participants</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session, i) => (
                  <tr key={session._id} className={`border-b border-slate-50 hover:bg-slate-50/60 transition-colors ${i % 2 === 0 ? "" : ""}`}>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{session.problem}</td>
                    <td className="px-5 py-3.5"><DiffBadge difficulty={session.difficulty} /></td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {session.participant ? "2" : "1"} / 2
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <CreateSessionModal
          onClose={() => setShowModal(false)}
          onCreate={data => createMutation.mutate(data)}
        />
      )}
    </div>
  );
}