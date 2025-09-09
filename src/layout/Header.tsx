import { useState } from 'react';
import SearchModal from '../components/SearchModal';
import { Menu, House, Search, Moon, Sun } from 'lucide-react';
import LanguageSelector from '../components/Selector';
import i18n from '../i18n';
import { useTheme } from '../store/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    setCurrentLanguage(lng);
    i18n.changeLanguage(lng);
  };

  const dataLanguage = [
    { label: 'English', value: 'en' },
    { label: 'Tiếng Việt', value: 'vi' },
  ];

  return (
    <>
      <header className="p-6 dark:text-white/60 ">
        <div className="">
          <div className="flex items-center justify-between gap-3">
            {/* Left section */}
            <div
              onClick={onToggleSidebar}
              className="w-[34px] h-[34px] rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-200 cursor-pointer"
            >
              <Menu size={25} />
            </div>
            <div
              className="w-[34px] h-[34px] rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-200 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <House size={25} />
            </div>

            {/* Center section - Search */}
            <div className="flex-1 ">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="w-full flex items-center justify-start px-3.5 py-1.5 bg-gray-200 dark:bg-zinc-800 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 text-gray-500 dark:text-gray-300 border-none cursor-pointer "
              >
                <span className="gap-2 flex items-center text-[14px]">
                  <Search size={14} className="mt-0.5" />
                  <span>{t('header.search')}</span>
                </span>
              </button>
            </div>

            {/* Language selector */}
            <div className="hidden md:block">
              <LanguageSelector
                data={dataLanguage}
                currentSelect={currentLanguage}
                onSelectChange={handleLanguageChange}
                width="w-full"
              />
            </div>

            {/* Right section */}
            <div className="flex items-center hidden md:flex gap-2">
              <div
                onClick={toggleTheme}
                className="w-[34px] h-[34px] rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                {theme === 'light' ? <Moon size={25} /> : <Sun size={25} />}
              </div>
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
