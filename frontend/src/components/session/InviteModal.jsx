import { useState } from "react";
import { X, Copy, Check, Link2, Users } from "lucide-react";

export default function InviteModal({ sessionId, onClose }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/session/${sessionId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-slate-900 text-sm">Invite a partner</h2>
              <p className="text-xs text-slate-400 mt-0.5">Share this link — room fits 2 people</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 rounded-lg">
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">Session link</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 min-w-0">
                <Link2 size={13} className="text-slate-400 flex-shrink-0" />
                <span className="text-sm font-mono text-slate-600 truncate">{link}</span>
              </div>
              <button onClick={handleCopy} className="btn-primary flex-shrink-0 py-2.5 px-4 gap-1.5">
                {copied ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
            <p className="text-xs text-blue-700 leading-relaxed">
              Anyone with this link can join as a participant. The room locks once 2 people are connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}