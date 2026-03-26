import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  Layers3Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

function HomePage() {
  return (
    <div className="app-shell">
      <section className="page-wrap pt-6">
        <div className="surface-panel relative flex items-center justify-between overflow-hidden px-4 py-3 sm:px-5">
          <div className="hero-orb left-0 top-0 h-24 w-24 bg-amber-300/30" />
          <div className="hero-orb right-6 top-2 h-20 w-20 bg-sky-300/25" />

          <Link to="/" className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#14532d_0%,#0f766e_55%,#0284c7_100%)] text-white shadow-[0_16px_34px_rgba(15,118,110,0.28)]">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-[-0.06em] text-slate-950">Coderview</div>
              <div className="mini-label">pair code studio</div>
            </div>
          </Link>

          <SignInButton mode="modal">
            <button className="action-button relative z-10">
              Get Started
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </SignInButton>
        </div>
      </section>

      <section className="page-wrap relative py-16 lg:py-20">
        <div className="hero-orb left-10 top-20 h-40 w-40 bg-amber-200/40" />
        <div className="hero-orb right-0 top-10 h-52 w-52 bg-sky-200/35" />

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10">
            <div className="section-kicker mb-6">
              <ZapIcon className="h-4 w-4" />
              realtime collaboration
            </div>

            <h1 className="max-w-4xl text-5xl font-bold leading-[0.92] text-slate-950 sm:text-6xl lg:text-7xl">
              Practice interviews inside a <span className="headline-gradient">shared coding studio</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 subtle-text">
              Launch a room, hop on video, solve curated problems, and keep the whole session in one sharp, focused interface built for pairs.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="status-chip bg-white/80 text-emerald-700">
                <CheckIcon className="h-4 w-4" />
                live video
              </div>
              <div className="status-chip bg-white/80 text-sky-700">
                <CheckIcon className="h-4 w-4" />
                shared editor
              </div>
              <div className="status-chip bg-white/80 text-amber-700">
                <CheckIcon className="h-4 w-4" />
                multi-language
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <SignInButton mode="modal">
                <button className="action-button">
                  Start Coding
                  <ArrowRightIcon className="h-4 w-4" />
                </button>
              </SignInButton>

              <button className="action-button-secondary">
                <VideoIcon className="h-5 w-5" />
                Explore the flow
              </button>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="metric-card">
                <div className="mini-label mb-2">users</div>
                <div className="text-3xl font-bold text-slate-950">10K+</div>
              </div>
              <div className="metric-card">
                <div className="mini-label mb-2">sessions</div>
                <div className="text-3xl font-bold text-slate-950">50K+</div>
              </div>
              <div className="metric-card">
                <div className="mini-label mb-2">uptime</div>
                <div className="text-3xl font-bold text-slate-950">99.9%</div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="surface-panel-strong grid-pattern relative overflow-hidden p-5 sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="mini-label mb-1">live workspace</p>
                  <h2 className="text-2xl font-bold text-slate-950">Interview Room Preview</h2>
                </div>
                <div className="status-chip bg-emerald-100 text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  connected
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
                <div className="surface-dark p-5">
                  <div className="mb-4 flex items-center justify-between text-sm text-slate-300">
                    <span>two-sum.js</span>
                    <span>javascript</span>
                  </div>
                  <pre className="overflow-hidden whitespace-pre-wrap text-sm leading-7 text-emerald-300">
{`function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}`}
                  </pre>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="surface-panel p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="icon-chip">
                        <UsersIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-950">2 participants</div>
                        <div className="text-sm subtle-text">Host + partner</div>
                      </div>
                    </div>
                    <p className="text-sm subtle-text">See each other, chat, and stay on the same problem without tab switching.</p>
                  </div>

                  <div className="surface-panel p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="icon-chip">
                        <Layers3Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-950">Structured problems</div>
                        <div className="text-sm subtle-text">Examples, constraints, output</div>
                      </div>
                    </div>
                    <p className="text-sm subtle-text">Everything stays visible and readable, even on smaller screens.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-wrap pb-20">
        <div className="mb-10">
          <p className="mini-label mb-2">why it works</p>
          <h2 className="text-4xl font-bold text-slate-950">A cleaner setup for pair practice</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="feature-card">
            <div className="icon-chip mb-5">
              <VideoIcon className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-950">Video-first</h3>
            <p className="mt-3 leading-7 subtle-text">
              Keep the human part of the interview alive while still sharing a purposeful coding workspace.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-chip mb-5">
              <Code2Icon className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-950">Focused editor</h3>
            <p className="mt-3 leading-7 subtle-text">
              Solve problems with a coding setup that feels closer to a product studio than a toy playground.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon-chip mb-5">
              <UsersIcon className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-950">Built for pairs</h3>
            <p className="mt-3 leading-7 subtle-text">
              Sessions are small by design, which keeps communication clear and collaboration intentional.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
