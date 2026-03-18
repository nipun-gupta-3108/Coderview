import { NavLink, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import {
  LayoutDashboard, Code2, Users, LogOut, ChevronRight, Zap
} from "lucide-react";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/problems", icon: Code2, label: "Problems" },
];

export default function Sidebar() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <Zap size={15} className="text-white" fill="white" />
          </div>
          <span className="font-display text-white font-semibold text-[15px] tracking-tight">
            Coderview
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        <p className="text-xs font-medium text-slate-600 uppercase tracking-wider px-3 mb-2">
          Navigation
        </p>
        {/* eslint-disable-next-line no-unused-vars */}
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={16} className="flex-shrink-0" />
            <span>{label}</span>
            <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">
                {user?.firstName?.[0] ?? "U"}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">
              {user?.fullName ?? "User"}
            </p>
            <p className="text-slate-500 text-[11px] truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full mt-1 sidebar-link text-slate-500 hover:text-red-400 hover:bg-red-400/10"
        >
          <LogOut size={15} />
          <span className="text-sm">Sign out</span>
        </button>
      </div>
    </aside>
  );
}