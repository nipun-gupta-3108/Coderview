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
    <div className="lg:col-span-2 card-premium border-primary/30 h-full">
      <div className="card-body">
        {/* HEADERS SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-base-300/40">
          {/* TITLE AND ICON */}
          <div className="flex items-center gap-4">
            <div className="icon-box-primary w-12 h-12">
              <ZapIcon className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Live Sessions
            </h2>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-success/10 rounded-xl border border-success/30 w-fit">
            <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse" />
            <span className="text-sm font-bold text-success">{sessions.length} active</span>
          </div>
        </div>

        {/* SESSIONS LIST */}
        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 scrollbar-smooth">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <LoaderIcon className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className="card-premium-dark border-base-400/30 hover:border-primary/50 hover:bg-gradient-to-br hover:from-base-200 hover:to-base-300 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-5 flex-1 min-w-0">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                      <Code2Icon className="w-8 h-8 text-white" />
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-success rounded-full border-3 border-base-100 animate-pulse" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <h3 className="font-bold text-lg truncate">{session.problem}</h3>
                        <span
                          className={`badge badge-sm font-bold ${getDifficultyBadgeClass(
                            session.difficulty
                          )}`}
                        >
                          {session.difficulty.slice(0, 1).toUpperCase() +
                            session.difficulty.slice(1)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-base-content/70">
                        <div className="flex items-center gap-1.5">
                          <CrownIcon className="w-4 h-4 text-warning" />
                          <span>{session.host?.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <UsersIcon className="w-4 h-4 text-info" />
                          <span>{session.participant ? "2" : "1"}/2 members</span>
                        </div>
                        {session.participant && !isUserInSession(session) ? (
                          <span className="badge badge-error badge-sm font-bold">FULL</span>
                        ) : (
                          <span className="badge badge-success badge-sm font-bold">OPEN</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTON */}
                  <div className="w-full sm:w-auto">
                    {session.participant && !isUserInSession(session) ? (
                      <button className="btn btn-sm btn-disabled w-full">Full</button>
                    ) : (
                      <Link
                        to={`/session/${session._id}`}
                        className="btn btn-sm bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-md hover:shadow-lg border-none w-full sm:w-auto"
                      >
                        {isUserInSession(session) ? "Rejoin" : "Join"}
                        <ArrowRightIcon className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                <SparklesIcon className="w-12 h-12 text-primary/40" />
              </div>
              <p className="text-xl font-bold text-base-content/70 mb-2">No active sessions</p>
              <p className="text-sm text-base-content/50">Be the first to create one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ActiveSessions;