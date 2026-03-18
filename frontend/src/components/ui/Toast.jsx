import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  error: "bg-red-50 border-red-200 text-red-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

const ICON_STYLES = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-blue-500",
};

function Toast({ id, type = "info", message, onDismiss }) {
  const Icon = ICONS[type];
  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), 4000);
    return () => clearTimeout(t);
  }, [id, onDismiss]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm animate-slide-up max-w-sm ${STYLES[type]}`}
    >
      <Icon size={16} className={`flex-shrink-0 mt-0.5 ${ICON_STYLES[type]}`} />
      <span className="flex-1 leading-snug">{message}</span>
      <button onClick={() => onDismiss(id)} className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message, type = "info") => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Portal-style fixed container — kept inside flow to avoid iframe issues */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast {...t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);