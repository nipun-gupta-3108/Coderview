import { useNavigate } from "react-router-dom";
import { useAuth, SignInButton, SignUpButton } from "@clerk/clerk-react";
import {
  Zap, Code2, Video, MessageSquare, ChevronRight,
  CheckCircle2, Users, Star, ArrowRight, Play,
  Shield, Cpu, Globe
} from "lucide-react";

const FEATURES = [
  {
    icon: Video,
    title: "HD Video Interviews",
    desc: "Crystal-clear 1-on-1 video calls with screen sharing and recording built in.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Code2,
    title: "Live Code Editor",
    desc: "Monaco-powered editor with syntax highlighting, multi-language support, and real-time sync.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: MessageSquare,
    title: "Session Chat",
    desc: "Communicate without interrupting your flow. Chat persists throughout the session.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Cpu,
    title: "Instant Code Execution",
    desc: "Run code in an isolated sandbox and see output instantly. Pass/fail on test cases.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Shield,
    title: "Secure Rooms",
    desc: "Rooms are locked to 2 participants max. Join links are private and time-limited.",
    color: "bg-red-50 text-red-600",
  },
  {
    icon: Globe,
    title: "Practice Solo",
    desc: "Browse curated problems and practice offline — no partner needed.",
    color: "bg-teal-50 text-teal-600",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create a session", desc: "Pick a problem, set the difficulty, and a private room is ready in seconds." },
  { step: "02", title: "Invite a partner", desc: "Share the room link. Your partner joins with one click — no account friction." },
  { step: "03", title: "Code together", desc: "See each other's code in real time, talk through the problem, and run it live." },
  { step: "04", title: "Review & improve", desc: "Session history lets you revisit every problem you've tackled together." },
];

const STATS = [
  { value: "10K+", label: "Active users" },
  { value: "50K+", label: "Sessions run" },
  { value: "99.9%", label: "Uptime" },
  { value: "7", label: "Languages" },
];

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="font-display font-semibold text-slate-900 text-[15px] tracking-tight">
              Coderview
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">How it works</a>
          </nav>
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <button onClick={() => navigate("/dashboard")} className="btn-primary text-sm">
                Go to dashboard <ArrowRight size={14} />
              </button>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="btn-ghost text-slate-600 text-sm">Sign in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="btn-primary text-sm">
                    Get started <ChevronRight size={14} />
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* bg grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f020_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f020_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-6 animate-fade-in">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Real-time collaborative coding
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6 animate-slide-up">
              The interview platform
              <br />
              <span className="text-blue-600">built for developers</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-xl animate-in-delay-1">
              Practice technical interviews with real peers. Code together, communicate live,
              and get feedback that actually improves your skills.
            </p>
            <div className="flex items-center gap-3 flex-wrap animate-in-delay-2">
              {isSignedIn ? (
                <button onClick={() => navigate("/dashboard")} className="btn-primary px-6 py-3 text-base">
                  Open dashboard <ArrowRight size={16} />
                </button>
              ) : (
                <>
                  <SignUpButton mode="modal">
                    <button className="btn-primary px-6 py-3 text-base">
                      Start coding free <ChevronRight size={16} />
                    </button>
                  </SignUpButton>
                  <button className="btn-secondary px-5 py-3 text-base gap-2">
                    <Play size={14} className="text-slate-500" /> Watch demo
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-4 mt-8 animate-in-delay-3">
              {["No credit card", "Free to start", "Cancel anytime"].map(t => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-slate-500">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Hero card mockup */}
          <div className="mt-16 animate-in-delay-4">
            <div className="rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/60 overflow-hidden bg-white max-w-4xl">
              {/* Window chrome */}
              <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <div className="mx-auto text-[11px] text-slate-400 font-mono">coderview.app/session/two-sum</div>
              </div>
              {/* Session preview */}
              <div className="flex h-72">
                {/* Code panel */}
                <div className="flex-1 bg-slate-950 p-4 font-mono text-xs leading-relaxed overflow-hidden">
                  <div className="text-slate-500 mb-3 text-[10px]">JavaScript ▾</div>
                  <div><span className="text-blue-400">function</span><span className="text-white"> twoSum</span><span className="text-slate-300">(nums, target) {'{'}</span></div>
                  <div className="ml-4"><span className="text-slate-500">// Hash map approach</span></div>
                  <div className="ml-4"><span className="text-purple-400">const</span><span className="text-white"> map = </span><span className="text-blue-400">new</span><span className="text-white"> Map();</span></div>
                  <div className="ml-4"><span className="text-blue-400">for</span><span className="text-slate-300"> (</span><span className="text-purple-400">let</span><span className="text-white"> i = 0; i &lt; nums.length; i++) {'{'}</span></div>
                  <div className="ml-8"><span className="text-purple-400">const</span><span className="text-white"> comp = target - nums[i];</span></div>
                  <div className="ml-8"><span className="text-blue-400">if</span><span className="text-slate-300"> (map.has(comp)) </span><span className="text-blue-400">return</span><span className="text-white"> [map.get(comp), i];</span></div>
                  <div className="ml-8"><span className="text-white">map.set(nums[i], i);</span></div>
                  <div className="ml-4 text-slate-300">{'}'}</div>
                  <div className="text-slate-300">{'}'}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="px-3 py-1 bg-blue-600 rounded text-white text-[10px] cursor-pointer">▶ Run</div>
                    <div className="text-emerald-400 text-[10px]">✓ All 3 test cases passed</div>
                  </div>
                </div>
                {/* Video panel */}
                <div className="w-56 bg-slate-800 border-l border-slate-700 flex flex-col">
                  <div className="flex-1 bg-slate-900 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">A</span>
                    </div>
                  </div>
                  <div className="h-20 border-t border-slate-700 bg-slate-800 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">B</span>
                    </div>
                  </div>
                  <div className="h-10 bg-slate-900 border-t border-slate-700 flex items-center justify-center gap-3">
                    {["🎤","📷","💬"].map(e => (
                      <span key={e} className="text-sm cursor-pointer">{e}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="font-display text-3xl font-bold text-slate-900 mb-1">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">Features</p>
            <h2 className="font-display text-4xl font-bold text-slate-900 tracking-tight">
              Everything you need to ace interviews
            </h2>
            <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
              Powerful tools designed to make coding interviews seamless, collaborative, and actually productive.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* eslint-disable-next-line no-unused-vars */}
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card p-6 hover:shadow-md transition-shadow group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={18} />
                </div>
                <h3 className="font-display font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-blue-600 text-sm font-semibold uppercase tracking-wider mb-3">Process</p>
            <h2 className="font-display text-4xl font-bold text-slate-900 tracking-tight">
              How it works
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="font-display text-5xl font-bold text-slate-100 mb-4 select-none">{step}</div>
                <h3 className="font-display font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl bg-blue-600 p-12 text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Ready to level up your interviews?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of developers already practicing smarter with Coderview.
            </p>
            {isSignedIn ? (
              <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-blue-600 font-semibold text-base hover:bg-blue-50 transition-colors">
                Open dashboard <ArrowRight size={16} />
              </button>
            ) : (
              <SignUpButton mode="modal">
                <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-blue-600 font-semibold text-base hover:bg-blue-50 transition-colors">
                  Get started for free <ChevronRight size={16} />
                </button>
              </SignUpButton>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
              <Zap size={11} className="text-white" fill="white" />
            </div>
            <span className="font-display text-sm font-semibold text-slate-700">Coderview</span>
          </div>
          <p className="text-xs text-slate-400">© 2025 Coderview. Built with care.</p>
        </div>
      </footer>
    </div>
  );
}