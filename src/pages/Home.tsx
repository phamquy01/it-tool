import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import {
  getAllTools,
  isToolAvailable,
} from '../utils/constants/toolCategories';

const Home = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<string[]>([]);

  const allTools = getAllTools();
  const favoriteTools = allTools.filter((tool) =>
    favorites.includes(tool.path)
  );

  const handleToolClick = (path: string) => {
    navigate(path);
  };

  const toggleFavorite = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  return (
    <div className="mt-4">
      {/* Hero Card - Full width with gradient */}
      <div className="bg-gradient-to-br from-[#1E7D8D] to-[#2CB875] rounded-xl p-8 text-white shadow-lg grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🛠️</div>
          <h1 className="text-4xl font-bold mb-4">IT Tools</h1>
          <p className="text-xl opacity-90 mb-6">
            Handy tools for developers - Everything you need in one place
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">🔐 Crypto Tools</h3>
              <p className="text-sm opacity-80">
                Security tools for encryption, hashing, and token generation
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">🔄 Converters</h3>
              <p className="text-sm opacity-80">
                Data conversion utilities for various formats
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      {favoriteTools.length > 0 && (
        <div>
          <h2 className="text-[16px] font-bold text-gray-400 mb-6 flex items-center">
            Your favorites tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {favoriteTools.map((tool) => {
              const Icon = tool.icon;
              const isAvailable = isToolAvailable(tool.path);

              return (
                <div
                  key={`fav-${tool.label}`}
                  onClick={() => isAvailable && handleToolClick(tool.path)}
                  className={`bg-white rounded transition-all duration-200 px-6 py-5  border-gray-200 ${
                    isAvailable
                      ? 'hover:border-green-500 cursor-pointer hover:shadow-md'
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="py-2 rounded-lg text-gray-400 flex items-center justify-between">
                    <Icon size={40} />
                    <div className="relative group">
                      <button
                        onClick={(e) => toggleFavorite(tool.path, e)}
                        className={`p-2 rounded-full transition-all duration-200  ${
                          favorites.includes(tool.path)
                            ? 'hover:bg-green-100   text-green-500'
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        <Heart
                          size={16}
                          fill={
                            favorites.includes(tool.path)
                              ? 'currentColor'
                              : 'none'
                          }
                        />
                      </button>
                      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {favorites.includes(tool.path)
                          ? 'Remove from favorites'
                          : 'Add to favorites'}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3
                      className={`font-medium text-lg mb-1 ${
                        isAvailable ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {tool.label}
                    </h3>
                    <p
                      className={`text-[14px] p-0 ${
                        isAvailable ? 'text-gray-500' : 'text-gray-400'
                      }`}
                    >
                      {tool.description}
                    </p>
                    {!isAvailable && (
                      <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Tools Section */}
      <div>
        <h2 className="text-[16px]  font-bold text-gray-400 mb-6">
          All The Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allTools.map((tool) => {
            const Icon = tool.icon;
            const isAvailable = isToolAvailable(tool.path);

            return (
              <div
                key={tool.label}
                onClick={() => isAvailable && handleToolClick(tool.path)}
                className={`bg-white rounded transition-all duration-200 px-6 py-5 border-1 border-gray-200 ${
                  isAvailable
                    ? ' hover:border-green-500 cursor-pointer'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div
                  className={`py-2 rounded-lg text-gray-400 flex items-center justify-between`}
                >
                  <Icon size={40} />
                  <div className="relative group">
                    <button
                      onClick={(e) => toggleFavorite(tool.path, e)}
                      className={`p-2 rounded-full transition-all duration-200 border-gray-200 ${
                        favorites.includes(tool.path)
                          ? 'hover:bg-green-100   text-green-500'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <Heart
                        size={16}
                        fill={
                          favorites.includes(tool.path)
                            ? 'currentColor'
                            : 'none'
                        }
                      />
                    </button>
                    {/* Tooltip */}
                    <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {favorites.includes(tool.path)
                        ? 'Remove from favorites'
                        : 'Add to favorites'}
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className={`font-medium text-lg mb-1 ${
                      isAvailable ? 'text-gray-900' : 'text-gray-500'
                    }`}
                  >
                    {tool.label}
                  </h3>
                  <p
                    className={`text-[14px] p-0 ${
                      isAvailable ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    {tool.description}
                  </p>
                  {!isAvailable && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                      Coming Soon
                    </span>
                  )}
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
