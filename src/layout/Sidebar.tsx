import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import {
  FAVORITES_KEY,
  toolCategories,
} from '../utils/constants/toolCategories';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openSections, setOpenSections] = useState<string[]>(['Crypto']);

  const handleItemClick = (path: string) => {
    navigate(path);
  };
  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const [categories, setCategories] = useState(toolCategories);

  useEffect(() => {
    const loadFavorites = () => {
      const stored = localStorage.getItem(FAVORITES_KEY);
      const favorites: string[] = stored ? JSON.parse(stored) : [];

      const favoriteItems = toolCategories
        .flatMap((cat) => cat.items)
        .filter((item) => favorites.includes(item.path));

      if (favoriteItems.length > 0) {
        const favoritesCategory = {
          title: 'Favorites',
          items: favoriteItems,
        };
        setCategories([favoritesCategory, ...toolCategories]);
      } else {
        setCategories(toolCategories);
      }
    };

    // Load lần đầu
    loadFavorites();

    // Lắng nghe custom event khi favorites thay đổi
    const handleFavoritesChange = () => {
      loadFavorites();
    };
    window.addEventListener('favoritesChanged', handleFavoritesChange);

    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
    };
  }, []);

  return (
    <div className="overflow-hidden relative z-auto h-full w-full bg-white">
      <div
        className="w-full overflow-y-auto h-full min-h-screen max-h-screen scrollbar-w-none"
        style={{ overflowX: 'hidden' }}
      >
        <div className="min-w-full">
          {/* Fixed Header */}
          <div
            className="absolute block l-0 w-full z-10 overflow-hidden cursor-pointer"
            onClick={() => navigate('/')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 300 275"
              className="mt-[-65px]"
            >
              <defs>
                <linearGradient
                  id="a"
                  x1="13.74"
                  x2="303.96"
                  y1="183.7"
                  y2="45.59"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#25636c"></stop>
                  <stop offset=".6" stopColor="#3b956f"></stop>
                  <stop offset="1" stopColor="#14a058"></stop>
                </linearGradient>
              </defs>
              <path
                fill="#14a058"
                d="M0 187.5v25s0 37.5 50 50S300 225 300 225v-37.5Z"
                opacity=".49"
              ></path>
              <path
                fill="#14a058"
                d="M300 237.5S287.5 275 250 275s-128.95-37.5-188.6-75 134.21 0 134.21 0Z"
                opacity=".49"
              ></path>
              <path
                fill="#14a058"
                d="M0 200v12.5a241.47 241.47 0 0 0 112.5 50c73.6 11.69 130.61-14.86 150-25L300 200Z"
                opacity=".38"
              ></path>
              <path
                fill="url(#a)"
                d="M0 0v212.5s62.5-12.5 150 25 150 0 150 0V0Z"
              ></path>
            </svg>
            <div className="absolute left-0 w-full text-center top-4 text-white ">
              <div
                className="text-[25px] font-semibold"
                onClick={() => navigate('/')}
              >
                {' '}
                IT - TOOLS{' '}
              </div>
              <div className="w-1/2 h-0.5 rounded  mt-0 mb-1 mx-auto"></div>
              <div className="text-[16px]">Handy tools for developers</div>
            </div>
          </div>

          {/* Navigation - Only scrolls when content is too long */}
          <div className="pt-[160px] pb-[200px]">
            {categories.map((section) => {
              const isOpen = openSections.includes(section.title);
              return (
                <div key={section.title}>
                  <div
                    onClick={() => toggleSection(section.title)}
                    className="flex cursor-pointer items-center mt-[12px] opacity-60 ml-[6px] "
                  >
                    <span
                      className={` text-[16px] opacity-50  ${
                        isOpen ? 'rotate-0' : '-rotate-90'
                      } transition-transform duration-150 ease-in-out`}
                      style={{ lineHeight: '.25rem' }}
                    >
                      <ChevronDown
                        className="w-[1em] h-[1em] text-[16px]"
                        style={{ lineHeight: '.25rem' }}
                      />
                    </span>
                    <span className="text-[13px] ml-2">{section.title}</span>
                  </div>
                  <div
                    className={`w-full ${
                      isOpen ? 'opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="flex">
                      <div className="w-[24px] opacity-10 hover:opacity-100 transition-opacity duration-200 ease-in-out relative cursor-pointer"></div>
                      <div className="flex-1 mb-[5px] text-black overflow-hidden text-[14px] pb-[6px]">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isSelected = location.pathname === item.path;
                          return (
                            <div key={item.label} className="h-[32px] mt-1.5 relative">
                              <div
                                onClick={() => handleItemClick(item.path)}
                                className={`pl-2 h-full flex items-center cursor-pointer relative pr-2 mr-2.5 rounded ${
                                  isSelected ? 'bg-[#ebf6f0]' : 'hover:bg-gray-100'
                                }`}
                                style={{ minWidth: 0 }}
                              >
                                <Icon
                                  size={18}
                                  className={`mr-2 ${isSelected ? 'text-[#18a058]' : 'text-black'}`}
                                />
                                <span
                                  className={`text-sm ml-1 ${
                                    isSelected ? 'text-[#18a058]' : 'text-black'
                                  }`}
                                  style={{ minWidth: 0 }}
                                >
                                  <span
                                    className="block truncate"
                                    style={{ maxWidth: '100%' }}
                                    title={item.label}
                                  >
                                    {item.label}
                                  </span>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
