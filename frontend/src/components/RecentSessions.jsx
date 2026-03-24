import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="card-premium border-accent/30 mt-10">
      <div className="card-body">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-base-300/40">
          <div className="icon-box-accent w-12 h-12">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent">
            Your Past Sessions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-24">
              <Loader className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session) => (
              <div
                key={session._id}
                className={`card-premium relative transition-all hover:scale-105 ${
                  session.status === "active"
                    ? "border-success/50 hover:border-success/80 bg-gradient-to-br from-success/10 to-base-100"
                    : "border-base-300/50 hover:border-primary/50"
                }`}
              >
                {session.status === "active" && (
                  <div className="absolute top-4 right-4">
                    <div className="badge badge-success gap-1.5 font-bold px-3 py-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      ACTIVE
                    </div>
                  </div>
                )}

                <div className="card-body p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                        session.status === "active"
                          ? "bg-gradient-to-br from-success to-success/70"
                          : "bg-gradient-to-br from-primary to-secondary"
                      }`}
                    >
                      <Code2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-2 truncate">{session.problem}</h3>
                      <span
                        className={`badge badge-sm font-bold ${getDifficultyBadgeClass(
                          session.difficulty
                        )}`}
                      >
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm font-medium text-base-content/70 mb-6 pb-6 border-b border-base-300/40">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {session.participant ? "2" : "1"} participant
                        {session.participant ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
                      Completed
                    </span>
                    <span className="text-xs text-base-content/50">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                <Trophy className="w-12 h-12 text-accent/40" />
              </div>
              <p className="text-xl font-bold text-base-content/70 mb-2">No sessions yet</p>
              <p className="text-sm text-base-content/50">Start your coding journey today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentSessions;