import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-b border-base-300/40">
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <SparklesIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                  Welcome back, {user?.firstName || "there"}!
                </h1>
              </div>
            </div>
            <p className="text-lg text-base-content/70 font-medium">
              Ready to level up your coding skills?
            </p>
          </div>
          <button
            onClick={onCreateSession}
            className="group px-8 py-4 bg-gradient-to-r from-primary via-primary-focus to-secondary rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <div className="flex items-center justify-center gap-3 text-white font-bold text-lg">
              <ZapIcon className="w-6 h-6" />
              <span>Create Session</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;