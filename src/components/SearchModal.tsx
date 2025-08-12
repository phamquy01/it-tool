import { useState, useEffect } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
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
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <div
        className="bg-white backdrop-blur-md border border-gray-200 rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Type to search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 bg-white backdrop-blur-sm"
            autoFocus
          />
        </div>

        {searchQuery && (
          <div className="mt-4 text-sm text-gray-600">
            Searching for: "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
