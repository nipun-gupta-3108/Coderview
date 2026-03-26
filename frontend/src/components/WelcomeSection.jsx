import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon, ZapIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <section className="page-wrap py-8">
      <div className="surface-panel-strong relative overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
        <div className="hero-orb -left-8 top-4 h-32 w-32 bg-amber-300/30" />
        <div className="hero-orb right-4 top-0 h-36 w-36 bg-sky-300/25" />
        <div className="hero-orb bottom-0 left-1/3 h-28 w-28 bg-emerald-300/25" />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <div className="section-kicker">
              <SparklesIcon className="h-4 w-4" />
              collaborative coding
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,#14532d_0%,#0f766e_55%,#0284c7_100%)] text-white shadow-[0_18px_34px_rgba(15,118,110,0.24)]">
                <SparklesIcon className="h-8 w-8" />
              </div>

              <div>
                <p className="mini-label mb-2">workspace overview</p>
                <h1 className="max-w-2xl text-4xl font-bold leading-[0.95] text-slate-950 sm:text-5xl lg:text-6xl">
                  Welcome back, <span className="headline-gradient">{user?.firstName || "there"}</span>
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-base leading-7 subtle-text sm:text-lg">
              Spin up a live interview room, review recent sessions, and jump back into practice with a dashboard that feels more like a studio than a list of cards.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-4 sm:flex-row lg:flex-col lg:items-end">
            <button onClick={onCreateSession} className="action-button w-full sm:w-auto">
              <ZapIcon className="h-5 w-5" />
              Create Session
              <ArrowRightIcon className="h-4 w-4" />
            </button>

            <div className="surface-panel px-4 py-3 text-sm subtle-text">
              New rooms stay lightweight: problem, language, live call, shared chat.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;
