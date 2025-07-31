import { useState, useEffect } from "react";
import { CheckCircle, XCircle, X, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles = {
  success: {
    bg: "bg-green-50 border-green-200",
    icon: CheckCircle,
    iconColor: "text-green-500",
    titleColor: "text-green-800",
    messageColor: "text-green-700",
  },
  error: {
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
    iconColor: "text-red-500",
    titleColor: "text-red-800",
    messageColor: "text-red-700",
  },
  warning: {
    bg: "bg-yellow-50 border-yellow-200",
    icon: AlertCircle,
    iconColor: "text-yellow-500",
    titleColor: "text-yellow-800",
    messageColor: "text-yellow-700",
  },
  info: {
    bg: "bg-blue-50 border-blue-200",
    icon: Info,
    iconColor: "text-blue-500",
    titleColor: "text-blue-800",
    messageColor: "text-blue-700",
  },
};

export const Toast = ({ id, type, title, message, duration = 5000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const styles = toastStyles[type];
  const Icon = styles.icon;

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto dismiss
    const dismissTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isExiting ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <div className={`
        relative p-4 rounded-lg border shadow-lg
        ${styles.bg}
        backdrop-blur-sm
      `}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Content */}
        <div className="flex items-start space-x-3 pr-6">
          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${styles.iconColor}`} />
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium text-sm ${styles.titleColor}`}>
              {title}
            </h4>
            {message && (
              <p className={`text-sm mt-1 ${styles.messageColor}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-linear ${
              type === "success" ? "bg-green-500" :
              type === "error" ? "bg-red-500" :
              type === "warning" ? "bg-yellow-500" : "bg-blue-500"
            }`}
            style={{
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// Toast Container
export const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast,
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Expose addToast globally
  useEffect(() => {
    (window as any).showToast = addToast;
    return () => {
      delete (window as any).showToast;
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

// Utility functions
export const showToast = {
  success: (title: string, message?: string, duration?: number) => {
    if (typeof window !== "undefined" && (window as any).showToast) {
      (window as any).showToast({ type: "success", title, message, duration });
    }
  },
  error: (title: string, message?: string, duration?: number) => {
    if (typeof window !== "undefined" && (window as any).showToast) {
      (window as any).showToast({ type: "error", title, message, duration });
    }
  },
  warning: (title: string, message?: string, duration?: number) => {
    if (typeof window !== "undefined" && (window as any).showToast) {
      (window as any).showToast({ type: "warning", title, message, duration });
    }
  },
  info: (title: string, message?: string, duration?: number) => {
    if (typeof window !== "undefined" && (window as any).showToast) {
      (window as any).showToast({ type: "info", title, message, duration });
    }
  },
}; 