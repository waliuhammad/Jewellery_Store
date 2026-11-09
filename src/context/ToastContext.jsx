import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3200) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container: bottom center, ivory card with hairline border, 3s auto-dismiss */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-md">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto bg-ivory border border-hairline shadow-soft px-5 py-3.5 flex items-center gap-3.5 text-ink text-sm w-full sm:w-auto"
            >
              {toast.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-sage flex-shrink-0" strokeWidth={1.5} />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-4 h-4 text-garnet flex-shrink-0" strokeWidth={1.5} />
              )}
              {toast.type === 'info' && (
                <Info className="w-4 h-4 text-gold flex-shrink-0" strokeWidth={1.5} />
              )}
              <span className="font-sans text-[13px] leading-snug">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto text-taupe hover:text-ink transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

