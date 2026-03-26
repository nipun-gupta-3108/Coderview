import {
  ArrowRightIcon,
  Code2Icon,
  CrownIcon,
  SparklesIcon,
  UsersIcon,
  ZapIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router";
import { getDifficultyBadgeClass } from "../lib/utils";

function ActiveSessions({ sessions, isLoading, isUserInSession }) {
  return (
    <section className="surface-panel-strong h-full p-6 sm:p-7 lg:col-span-2">
      <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="icon-chip">
            <ZapIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="mini-label mb-1">open now</p>
            <h2 className="text-3xl font-bold text-slate-950">Live Sessions</h2>
          </div>
        </div>

        <div className="status-chip w-fit bg-emerald-100 text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          {sessions.length} active
        </div>
      </div>

      <div className="scrollbar-smooth max-h-[470px] space-y-4 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <LoaderIcon className="h-12 w-12 animate-spin text-emerald-600" />
          </div>
        ) : sessions.length > 0 ? (
          sessions.map((session) => (
            <article key={session._id} className="surface-panel grid-pattern p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#14532d_0%,#0f766e_55%,#0284c7_100%)] text-white shadow-[0_18px_34px_rgba(15,118,110,0.22)]">
                    <Code2Icon className="h-8 w-8" />
                    <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-xl font-bold text-slate-950">{session.problem}</h3>
                      <span className={`badge badge-sm font-semibold ${getDifficultyBadgeClass(session.difficulty)}`}>
                        {session.difficulty.slice(0, 1).toUpperCase() + session.difficulty.slice(1)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm subtle-text">
                      <div className="flex items-center gap-1.5">
                        <CrownIcon className="h-4 w-4 text-amber-500" />
                        <span>{session.host?.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <UsersIcon className="h-4 w-4 text-sky-600" />
                        <span>{session.participant ? "2" : "1"}/2 members</span>
                      </div>
                      <span
                        className={`status-chip ${
                          session.participant && !isUserInSession(session)
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {session.participant && !isUserInSession(session) ? "full" : "open"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto">
                  {session.participant && !isUserInSession(session) ? (
                    <button className="action-button-secondary w-full opacity-70 sm:w-auto">Full</button>
                  ) : (
                    <Link to={`/session/${session._id}`} className="action-button w-full sm:w-auto">
                      {isUserInSession(session) ? "Rejoin" : "Join"}
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,rgba(20,83,45,0.12),rgba(14,165,233,0.12))]">
              <SparklesIcon className="h-12 w-12 text-emerald-700/60" />
            </div>
            <p className="text-xl font-bold text-slate-900">No active sessions</p>
            <p className="mt-2 text-sm subtle-text">Be the first one to open a live workspace.</p>
          </div>
        )}
      </div>
    </section>
  );
}
export default ActiveSessions;
