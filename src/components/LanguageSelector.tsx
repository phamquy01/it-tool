import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
  ];

  const currentLang =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  return (
    <div className="relative cursor-pointer">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3.5 py-1.5 bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 w-[100px] hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-green-500"
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <span className="text-sm font-medium truncate">
            {currentLang.name}
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
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200 overflow-hidden">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => {
                onLanguageChange(language.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-colors hover:text-green-500 ${
                currentLanguage === language.code
                  ? 'bg-green-50 text-green-600'
                  : 'text-black hover:bg-gray-50'
              }`}
            >
              <span className="truncate">{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
