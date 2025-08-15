import { useState } from 'react';
import SearchModal from '../components/SearchModal';
import {
  Menu,
  House,
  PaintbrushVertical,
  Search,
  Github,
  Twitter,
  Info,
  Moon,
  Heart,
} from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('vi');

  const dataLanguage = [
    { label: 'Tiếng Việt', value: 'vi' },
    { label: 'English', value: 'en' },
    { label: '日本語', value: 'ja' },
  ];
  return (
    <>
      <header className="">
        <div className="">
          <div className="flex items-center justify-between gap-3">
            {/* Left section - Menu, Home, Paint Icons */}
            {/* Menu icon */}
            <div
              onClick={onToggleSidebar}
              className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-gray-200  active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer"
            >
              <Menu size={25} />
            </div>
            <div className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-gray-200  active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer">
              <House size={25} />
            </div>
            <div className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-gray-200  active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer">
              <PaintbrushVertical size={25} />
            </div>

            {/* Center section - Search */}
            <div className="flex-1 ">
              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="p-0 m-0 w-full flex items-center justify-start px-3.5 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all duration-200 text-gray-400 border-none border-gray-300 dark:border-gray-700 border-1 active:border-green-500 cursor-pointer"
              >
                <span className="gap-3 flex items-center text-[14px]">
                  <Search size={12} />
                  Search
                  <span className="flex items-center space-x-1 border px-[5px] py-[2px] rounded">
                    Cmd + K
                  </span>
                </span>
              </button>
            </div>

            <LanguageSelector
              data={dataLanguage}
              currentSelect={currentLanguage}
              onSelectChange={setCurrentLanguage}
              width="w-[100px]"
            />

            <div className="flex items-center">
              <div className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-gray-200  active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer">
                <Github size={25} />
              </div>
              <div className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-gray-200  active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer">
                <Twitter size={25} />
              </div>

              <div className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-gray-200  active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer">
                <Info size={25} />
              </div>
              <div className="w-[34px] h-[34px] rounded-full border-1 border-transparent hover:bg-gray-200  active:border-green-500 flex items-center justify-center transition-all duration-200 cursor-pointer">
                <Moon size={25} />
              </div>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-br from-[#1E7D8D] to-[#2CB875] text-white rounded-full font-medium transition-all duration-300 hover:px-8 hover:shadow-lg border border-gray-300 cursor-pointer">
              <span className="text-sm">Buy me a coffee</span>
              <span>
                <Heart size={12} />
              </span>
            </button>
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
