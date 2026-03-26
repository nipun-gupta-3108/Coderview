import { RadarIcon, TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:col-span-3">
      <div className="metric-card">
        <div className="mb-6 flex items-start justify-between">
          <div className="icon-chip">
            <UsersIcon className="h-6 w-6" />
          </div>
          <span className="status-chip bg-emerald-100 text-emerald-700">live rooms</span>
        </div>
        <div className="text-4xl font-bold text-slate-950">{activeSessionsCount}</div>
        <p className="mt-2 text-sm subtle-text">Active sessions waiting for a collaborator right now.</p>
      </div>

      <div className="metric-card">
        <div className="mb-6 flex items-start justify-between">
          <div className="icon-chip">
            <TrophyIcon className="h-6 w-6" />
          </div>
          <span className="status-chip bg-amber-100 text-amber-700">history</span>
        </div>
        <div className="text-4xl font-bold text-slate-950">{recentSessionsCount}</div>
        <p className="mt-2 text-sm subtle-text">Completed sessions saved as part of your recent practice trail.</p>
      </div>

      <div className="metric-card">
        <div className="mb-6 flex items-start justify-between">
          <div className="icon-chip">
            <RadarIcon className="h-6 w-6" />
          </div>
          <span className="status-chip bg-sky-100 text-sky-700">focus</span>
        </div>
        <div className="text-4xl font-bold text-slate-950">{activeSessionsCount + recentSessionsCount}</div>
        <p className="mt-2 text-sm subtle-text">Total sessions visible across your live and recent workspace.</p>
      </div>
    </div>
  );
}

export default StatsCards;
