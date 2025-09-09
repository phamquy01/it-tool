import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  data: { label: string; value: string }[];
  currentSelect: string;
  onSelectChange: (language: string) => void;
  width?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  data,
  currentSelect,
  onSelectChange,
  width,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentdata =
    data?.find((item) => item.value === currentSelect) || data?.[0];

  return (
    <div
      ref={ref}
      className="relative bg-transparent text-black rounded-lg shadow-sm "
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-3.5 py-1.5 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-green-500 gap-2  dark:bg-zinc-800 dark:border-zinc-700 dark:text-white/60 dark:hover:bg-zinc-700 cursor-pointer ${width}`}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <span className="text-sm font-medium truncate">
            {currentdata?.label}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden dark:bg-zinc-800 z-100 ">
          {data &&
            data.map((language) => (
              <button
                key={language.value}
                onClick={() => {
                  onSelectChange(language.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors hover:text-green-500 cursor-pointer ${
                  currentSelect === language.value
                    ? 'bg-green-50 text-green-600 hover:bg-gray-200 dark:hover:bg-zinc-700 dark:bg-zinc-800 dark:text-green-400'
                    : 'text-black hover:bg-gray-50 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-white/80'
                }`}
              >
                <span className="truncate">{language.label}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
