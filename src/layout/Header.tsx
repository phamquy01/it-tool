import { useState } from 'react';
import SearchModal from '../components/SearchModal';
import LanguageSelector from '../components/LanguageSelector';
import ThemeToggle from '../components/ThemeToggle';

const Header = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('vi');

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left section - Menu, Home, Paint Icons */}
            <div className="flex items-center space-x-4">
              {/* Menu icon */}
              <button
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl"
                aria-label="Menu"
              >
                ☰
              </button>

              {/* Home icon */}
              <button
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl"
                aria-label="Home"
              >
                🏠
              </button>

              {/* Paint brush icon */}
              <button
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl"
                aria-label="Paint"
              >
                🎨
              </button>
            </div>

            {/* Center section - Search */}
            <div className="flex-1 max-w-lg mx-8">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="w-full flex items-center px-4 py-2 text-left text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="text-xl mr-3">🔍</span>
                <span>Tìm kiếm...</span>
              </button>
            </div>

            {/* Right section - Language, Social Icons, Theme, Buy me coffee */}
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <LanguageSelector
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
              />

              {/* Social Media Icons */}
              <div className="flex items-center space-x-1 mx-2">
                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl"
                  aria-label="GitHub"
                >
                  📚
                </a>

                {/* Twitter X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl"
                  aria-label="Twitter X"
                >
                  🐦
                </a>

                {/* Info */}
                <button
                  className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xl"
                  aria-label="Info"
                >
                  ℹ️
                </button>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Buy me a coffee */}
              <a
                href="https://www.buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-lg transition-colors font-medium"
              >
                <span className="text-sm">Buy me a coffee</span>
                <span className="text-red-500">❤️</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

export default Header;
