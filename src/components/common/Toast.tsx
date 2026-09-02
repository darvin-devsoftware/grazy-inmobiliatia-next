import React, { useEffect } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:bottom-5 sm:left-auto sm:right-5 z-50 flex flex-col space-y-2 pointer-events-none sm:max-w-sm sm:w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className="pointer-events-auto flex items-center justify-between p-4 bg-[#071B33] text-white rounded-lg shadow-xl border border-[#7A8AA3]/40 animate-slideUp">
      <div className="flex items-center space-x-3">
        {toast.type === 'success' ? (
          <CheckCircle2 className="w-5 h-5 text-[#03459C] flex-shrink-0" />
        ) : (
          <Info className="w-5 h-5 text-[#7A8AA3] flex-shrink-0" />
        )}
        <p className="text-xs font-medium leading-tight">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-3 text-gray-400 hover:text-white p-1 focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
