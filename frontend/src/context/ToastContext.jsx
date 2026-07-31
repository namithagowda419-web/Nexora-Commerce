import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-luxury border backdrop-blur-md ${
                toast.type === 'success'
                  ? 'bg-plum-rich/95 text-white border-lavender-soft/30'
                  : toast.type === 'error'
                  ? 'bg-rose-900/90 text-white border-rose-500/30'
                  : 'bg-charcoal/90 text-white border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-lavender-soft flex-shrink-0" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-mauve-dusty flex-shrink-0" />}
                <span className="text-sm font-medium">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-white/10 rounded-full transition"
              >
                <X className="w-4 h-4 opacity-70" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
