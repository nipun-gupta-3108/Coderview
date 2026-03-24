import { Link } from "react-router";
import {
  ArrowRightIcon,
  CheckIcon,
  Code2Icon,
  SparklesIcon,
  UsersIcon,
  VideoIcon,
  ZapIcon,
} from "lucide-react";
import { SignInButton } from "@clerk/clerk-react";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-base-100/95 to-base-200/95 backdrop-blur-xl border-b border-base-300/40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* LOGO */}
          <Link
            to={"/"}
            className="flex items-center gap-3 hover:scale-105 transition-transform duration-300"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>

            <div className="flex flex-col">
              <span className="font-black text-lg bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
                Talent IQ
              </span>
              <span className="text-xs text-base-content/50 font-medium -mt-1">Code Together</span>
            </div>
          </Link>

          {/* AUTH BTN */}
          <SignInButton mode="modal">
            <button className="group px-7 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2">
              <span>Get Started</span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </SignInButton>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8">
            <div className="badge badge-lg bg-primary/20 text-primary border-primary/30 font-semibold">
              <ZapIcon className="w-4 h-4" />
              Real-time Collaboration
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Code Together,
                </span>
                <br />
                <span className="text-base-content">Learn Together</span>
              </h1>
              <p className="text-lg text-base-content/70 leading-relaxed max-w-xl font-medium">
                The ultimate platform for collaborative coding interviews and pair programming. Connect face-to-face, code in real-time, and ace your technical interviews.
              </p>
            </div>

            {/* FEATURE PILLS */}
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="badge badge-lg badge-outline gap-2 px-4 py-3">
                <CheckIcon className="w-4 h-4 text-success" />
                <span>Live Video Chat</span>
              </div>
              <div className="badge badge-lg badge-outline gap-2 px-4 py-3">
                <CheckIcon className="w-4 h-4 text-success" />
                <span>Code Editor</span>
              </div>
              <div className="badge badge-lg badge-outline gap-2 px-4 py-3">
                <CheckIcon className="w-4 h-4 text-success" />
                <span>Multi-Language</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-6">
              <SignInButton mode="modal">
                <button className="btn btn-lg bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 border-none">
                  Start Coding Now
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </SignInButton>

              <button className="btn btn-lg btn-outline font-semibold hover:bg-base-200">
                <VideoIcon className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="card-premium p-6">
                <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">10K+</div>
                <div className="text-sm font-semibold text-base-content/70">Active Users</div>
              </div>
              <div className="card-premium p-6">
                <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">50K+</div>
                <div className="text-sm font-semibold text-base-content/70">Sessions</div>
              </div>
              <div className="card-premium p-6">
                <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">99.9%</div>
                <div className="text-sm font-semibold text-base-content/70">Uptime</div>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full h-96 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-3xl shadow-2xl border border-primary/20 flex items-center justify-center">
              <Code2Icon className="w-32 h-32 text-primary/40" />
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-24 relative">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black mb-6">
            Everything You <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Need</span>
          </h2>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto font-medium">
            Powerful features designed to make your coding interviews seamless and productive
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card-premium p-8 hover:scale-105">
            <div className="icon-box-primary w-16 h-16 mb-6">
              <VideoIcon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3">HD Video Call</h3>
            <p className="text-base-content/70 leading-relaxed">
              Crystal clear video and audio for seamless communication during interviews
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card-premium p-8 hover:scale-105">
            <div className="icon-box-secondary w-16 h-16 mb-6">
              <Code2Icon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Live Code Editor</h3>
            <p className="text-base-content/70 leading-relaxed">
              Collaborate in real-time with syntax highlighting and multiple language support
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card-premium p-8 hover:scale-105">
            <div className="icon-box-accent w-16 h-16 mb-6">
              <UsersIcon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Easy Collaboration</h3>
            <p className="text-base-content/70 leading-relaxed">
              Share your screen, discuss solutions, and learn from each other in real-time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;