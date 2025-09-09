import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { FAVORITES_KEY, getAllTools } from '../utils/constants/toolCategories';
import FavoriteTool from '../components/FavoriteTool';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);
  const { t, i18n } = useTranslation();
  const tEn = i18n.getFixedT('en');
  const allTools = getAllTools();
  const [usageCount, setUsageCount] = useState(null);
  const favoriteTools = allTools.filter((tool) =>
    favorites.includes(tool.path)
  );

  const handleToolClick = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const loadFavorites = () => {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    };

    loadFavorites();
    const handleFavoritesChange = () => {
      loadFavorites();
    };

    window.addEventListener('favoritesChanged', handleFavoritesChange);

    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
    };
  }, []);

  // Test API call
  useEffect(() => {
    const testAPI = async () => {
      try {
        const response = await fetch(
          'https://lumipic.hieunk-demo.io.vn/api/it-tool/analytic?utm_source=zalo&utm_medium=zalo&utm_campaign=zalo'
        );
        const data = await response.json();
        setUsageCount(data);
      } catch (error) {
        console.error('API Error:', error);
      }
    };
    testAPI();
  }, []);

  return (
    <div className="mt-4 overflow-hidden ">
      {/* Hero Card - Full width with gradient */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <div
          className="relative rounded p-8 text-white shadow-lg gap-4 mb-8 flex flex-col items-start overflow-hidden col-span-1"
          style={{
            background:
              'linear-gradient(90deg, #25636c 0%, #3b956f 60%, #14a058 100%)',
          }}
        >
          <div className="relative z-10"></div>
          {/* Heart Icon */}
          <Heart size={40} />
          <div>
            <h3 className="font-bold text-base mb-2">{t('home.title_card')}</h3>
            <p className="text-sm line-clamp-2">{t('home.description_card')}</p>
          </div>
        </div>

        {/* 3 cột còn lại để trống */}
        <div className="col-span-3"></div>
      </div>
      {/* Favorites Section */}
      {favoriteTools.length > 0 && (
        <div>
          <h2 className="text-[16px] font-bold text-gray-400 mb-2 flex items-center">
            Your favorites tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8 ">
            {favoriteTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <div
                  key={`fav-${tool.label}`}
                  onClick={() => handleToolClick(tool.path)}
                  className={`bg-white rounded transition-all duration-200 px-6 py-5  border-gray-200  hover:border-green-500 border-1 cursor-pointer dark:bg-zinc-800 dark:border-zinc-700 dark:hover:border-green-500`}
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="py-2 rounded-lg text-gray-400 flex items-center justify-between">
                        <Icon size={35} className="dark:text-zinc-600" />
                        <div className="relative group">
                          <FavoriteTool tool={tool} />
                          {/* Tooltip */}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-medium text-lg mb-1 dark:text-white/80`}
                        >
                          {t(tool.label)}
                        </h3>
                        <p className="text-[14px] p-0 line-clamp-2 dark:text-white/40">
                          {t(tool.description)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between bg-gray-50 dark:bg-zinc-900 rounded-lg px-3 py-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {t('home.usage_statistics')}
                      </span>
                      <span className="text-base font-semibold text-green-600 dark:text-green-400">
                        {usageCount?.[tEn(tool.label)] ?? 0}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Tools Section */}
      <div>
        <h2 className="text-[16px]  font-bold text-gray-400 mb-2">
          All The Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.label}
                onClick={() => handleToolClick(tool.path)}
                className={`bg-white rounded transition-all duration-200 px-6 py-5  border-gray-200  hover:border-green-500 border-1 cursor-pointer dark:bg-zinc-800 dark:border-zinc-700 dark:hover:border-green-500`}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="py-2 rounded-lg text-gray-400 flex items-center justify-between">
                      <Icon size={35} className="dark:text-zinc-600" />
                      <div className="relative group">
                        <FavoriteTool tool={tool} />
                        {/* Tooltip */}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-1 dark:text-white/80">
                        {t(tool.label)}
                      </h3>
                      <p className="text-[14px] p-0 line-clamp-2 text-gray-500 dark:text-white/20">
                        {t(tool.description)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between bg-gray-50 dark:bg-zinc-900 rounded-lg px-3 py-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {t('home.usage_statistics')}
                    </span>
                    <span className="text-base font-semibold text-green-600 dark:text-green-400">
                      {usageCount?.[tEn(tool.label)] ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
