import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { toolCategories } from '../utils/constants/toolCategories';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SearchModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<typeof allTools>([]);
  const { t } = useTranslation();
  const allTools = toolCategories.flatMap((cat) =>
    cat.items.map((item) => ({
      ...item,
      category: t(cat.title),
      label: t(item.label),
      description: t(item.description),
    }))
  );

  const fuse = new Fuse(allTools, {
    keys: ['label', 'description', 'category'],
    threshold: 0.3,
    ignoreLocation: true,
  });

  const handleNavigateTool = (path: string) => {
    navigate(path);
    setSearchQuery('');
    onClose();
  };

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

  useEffect(() => {
    if (searchQuery.trim()) {
      const searchResults = fuse.search(searchQuery).map((res) => res.item);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      {/* Overlay mờ */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Box modal */}
      <div
        className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative input-wrapper input-wrapper">
          <input
            type="text"
            placeholder={t('header.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm py-2 px-3 outline-none w-full text-black dark:text-white bg-transparent"
            autoFocus
          />
        </div>

        {/* Hiển thị kết quả */}
        {results.length > 0 && (
          <>
            <ul className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-700">
              {results.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li
                    key={idx}
                    className="py-2 px-3 hover:bg-green-600 rounded cursor-pointer flex items-center gap-3 group"
                    onClick={() => {
                      handleNavigateTool(item.path);
                    }}
                  >
                    {/* Icon */}
                    <span className="text-xl group-hover:text-white text-zinc-700 dark:text-zinc-300">
                      <Icon size={25} className={`mr-2`} />
                    </span>
                    <div>
                      <div className="font-medium group-hover:text-white dark:group-hover:text-white">
                        {t(item.label)}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-white dark:group-hover:text-white">
                        {t(item.category)} • {t(item.description)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
