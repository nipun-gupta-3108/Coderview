import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, SparklesIcon } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-base-100/95 to-base-200/95 backdrop-blur-xl border-b border-base-300/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-105 transition-transform duration-300"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-lg bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              Talent IQ
            </span>
            <span className="text-xs text-base-content/50 font-medium -mt-1">Code Together</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm
              ${
                isActive("/problems")
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-200/80"
              }`}
          >
            <div className="flex items-center gap-x-2">
              <BookOpenIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Problems</span>
            </div>
          </Link>

          {/* DASHBOARD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm
              ${
                isActive("/dashboard")
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl"
                  : "text-base-content/70 hover:text-base-content hover:bg-base-200/80"
              }`}
          >
            <div className="flex items-center gap-x-2">
              <LayoutDashboardIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </div>
          </Link>

          <div className="ml-3 pl-3 border-l border-base-300/40">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;