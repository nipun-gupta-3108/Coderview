import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="lg:col-span-1 grid grid-cols-1 gap-6">
      {/* Active Count */}
      <div className="card-premium border-primary/30 hover:border-primary/60">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box-primary w-14 h-14">
              <UsersIcon className="w-7 h-7" />
            </div>
            <div className="badge badge-primary badge-lg font-bold">Live</div>
          </div>
          <div className="text-5xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            {activeSessionsCount}
          </div>
          <div className="text-sm font-semibold text-base-content/60">Active Sessions</div>
        </div>
      </div>

      {/* Recent Count */}
      <div className="card-premium border-secondary/30 hover:border-secondary/60">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <div className="icon-box-secondary w-14 h-14">
              <TrophyIcon className="w-7 h-7" />
            </div>
          </div>
          <div className="text-5xl font-black bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">
            {recentSessionsCount}
          </div>
          <div className="text-sm font-semibold text-base-content/60">Total Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;