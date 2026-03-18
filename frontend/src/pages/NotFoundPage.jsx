import { useNavigate } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-6">
          <Zap size={22} className="text-blue-400" />
        </div>
        <h1 className="font-display text-5xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="font-display text-xl font-semibold text-slate-700 mb-3">Page not found</h2>
        <p className="text-slate-500 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button onClick={() => navigate("/")} className="btn-primary gap-2">
          <ArrowLeft size={14} /> Back to home
        </button>
      </div>
    </div>
  );
}