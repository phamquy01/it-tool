import { useState } from 'react';
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

  const currentdata =
    data?.find((item) => item.value === currentSelect) || data?.[0];

  return (
    <div className="relative cursor-pointer">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-3.5 py-1.5 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-green-500 ${width}`}
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
        <div className="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg z-10 border border-gray-200 overflow-hidden">
          {data &&
            data.map((language) => (
              <button
                key={language.value}
                onClick={() => {
                  onSelectChange(language.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors hover:text-green-500 ${
                  currentSelect === language.value
                    ? 'bg-green-50 text-green-600'
                    : 'text-black hover:bg-gray-50'
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
