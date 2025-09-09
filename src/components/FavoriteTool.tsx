import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { FAVORITES_KEY } from '../utils/constants/toolCategories';

const FavoriteTool = ({ tool }: { tool: { path: string } }) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites từ localStorage và listen cho changes
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

  const toggleFavorite = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Lấy mảng hiện tại từ localStorage
    const stored = localStorage.getItem(FAVORITES_KEY);
    const currentFavorites: string[] = stored ? JSON.parse(stored) : [];

    let updatedFavorites: string[];

    if (currentFavorites.includes(path)) {
      updatedFavorites = currentFavorites.filter((p) => p !== path);
    } else {
      updatedFavorites = [...currentFavorites, path];
    }

    // Cập nhật localStorage
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));

    // Dispatch custom event để thông báo cho các component khác
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  };

  return (
    <>
      <button
        onClick={(e) => toggleFavorite(tool.path, e)}
        className={`p-2 rounded-full transition-all duration-200 cursor-pointer ${
          favorites.includes(tool.path)
            ? 'hover:bg-green-100 text-green-500 dark:hover:bg-[#233929]'
            : ' text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
        }
      `}
      >
        <Heart
          size={16}
          fill={favorites.includes(tool.path) ? 'currentColor' : 'none'}
          className="cursor-pointer"
        />
      </button>
      <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
        {favorites.includes(tool.path)
          ? 'Remove from favorites'
          : 'Add to favorites'}
      </div>
    </>
  );
};

export default FavoriteTool;
