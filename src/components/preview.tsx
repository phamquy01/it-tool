import { useEffect } from 'react';

type PreviewProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Preview = ({ isOpen, onClose, children }: PreviewProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"></div>

      <div
        className="relative z-10 max-w-full max-h-full p-4 overflow-auto"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Preview;
