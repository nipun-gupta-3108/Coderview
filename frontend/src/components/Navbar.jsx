import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="page-wrap">
        <div className="surface-panel relative flex items-center justify-between gap-3 overflow-hidden px-4 py-3 sm:px-5">
          <div className="hero-orb left-4 top-1 h-20 w-20 bg-amber-300/30" />
          <div className="hero-orb right-8 top-0 h-24 w-24 bg-sky-300/25" />

          <Link to="/" className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#14532d_0%,#0f766e_55%,#0284c7_100%)] text-white shadow-[0_16px_34px_rgba(15,118,110,0.28)]">
              <SparklesIcon className="h-6 w-6" />
            </div>

            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-[-0.06em] text-slate-950">Coderview</span>
              <span className="mini-label">pair code studio</span>
            </div>
          </Link>

          <div className="relative z-10 flex items-center gap-2">
            <Link
              to="/problems"
              className={`nav-pill ${isActive("/problems") ? "nav-pill-active" : "nav-pill-idle"}`}
            >
              <BookOpenIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Problems</span>
            </Link>

            <Link
              to="/dashboard"
              className={`nav-pill ${isActive("/dashboard") ? "nav-pill-active" : "nav-pill-idle"}`}
            >
              <LayoutDashboardIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <div className="ml-1 border-l border-slate-200 pl-3">
              <UserButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
