import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';

type ToastType = 'success' | 'error';

interface Toast {
  id: number;
  messageKey: string; // lưu key i18n thay vì string dịch sẵn
  type: ToastType;
}

interface ToastContextProps {
  showToast: (messageKey: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (messageKey: string, type: ToastType = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, messageKey, type }]);

    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3000
    );
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          left: '60%',
          top: '60px',
          transform: 'translateX(-50%)',
          zIndex: 50,
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              marginTop: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
            className={`${
              toast.type === 'success'
                ? 'bg-white text-black'
                : 'bg-red-500 text-white'
            } px-5 py-2 rounded flex items-center gap-2`}
          >
            {toast.type === 'success' ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="10" fill="#22c55e" />
                <path
                  d="M6 10l2.5 2.5L14 7"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="10" cy="10" r="10" fill="#ef4444" />
                <path
                  d="M7 7l6 6M13 7l-6 6"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {/* dịch tại thời điểm render */}
            <span style={{ fontSize: 14 }}>{t(toast.messageKey)}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
