import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <section className="surface-panel-strong mt-8 p-6 sm:p-7">
      <div className="mb-8 flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="icon-chip">
          <Clock className="h-6 w-6" />
        </div>
        <div>
          <p className="mini-label mb-1">recent trail</p>
          <h2 className="text-3xl font-bold text-slate-950">Past Sessions</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-24">
            <Loader className="h-12 w-12 animate-spin text-emerald-600" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <article key={session._id} className="surface-panel p-6">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#14532d_0%,#0f766e_55%,#0284c7_100%)] text-white shadow-[0_16px_32px_rgba(15,118,110,0.22)]">
                  <Code2 className="h-7 w-7" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="truncate text-xl font-bold text-slate-950">{session.problem}</h3>
                    {session.status === "active" && (
                      <span className="status-chip bg-emerald-100 text-emerald-700">active</span>
                    )}
                  </div>
                  <span className={`badge badge-sm font-semibold ${getDifficultyBadgeClass(session.difficulty)}`}>
                    {session.difficulty}
                  </span>
                </div>
              </div>

              <div className="mb-5 space-y-3 border-b border-slate-200 pb-5 text-sm subtle-text">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatDistanceToNow(new Date(session.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>
                    {session.participant ? "2" : "1"} participant{session.participant ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] subtle-text">
                <span>{session.status === "active" ? "in progress" : "completed"}</span>
                <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,rgba(245,158,11,0.14),rgba(14,165,233,0.12))]">
              <Trophy className="h-12 w-12 text-amber-700/60" />
            </div>
            <p className="text-xl font-bold text-slate-900">No sessions yet</p>
            <p className="mt-2 text-sm subtle-text">Your practice history will show up here.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default RecentSessions;
