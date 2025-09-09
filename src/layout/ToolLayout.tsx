import { Outlet, useLocation } from 'react-router-dom';
import { toolCategories } from '../utils/constants/toolCategories';
import FavoriteTool from '../components/FavoriteTool';
import { useTranslation } from 'react-i18next';

export default function ToolLayout() {
  const location = useLocation();
  const allItems = toolCategories.flatMap((section) => section.items);
  const currentItem = allItems.find((item) => item.path === location.pathname);
  const isHome = location.pathname === '/';
  const { t } = useTranslation();
  return (
    <>
      {!isHome && (
        <div className="md:w-max md:min-w-[400px] mx-auto pb-10 pt-4">
          <div className="flex items-center justify-between ">
            <p className="opacity-90 text-xl sm:text-2xl md:!text-[40px] font-medium mr-16 leading-tight">
              {t(currentItem?.label ?? '')}
            </p>
            <FavoriteTool tool={{ path: currentItem?.path as string }} />
          </div>
          <div className="w-[200px] h-0.5 bg-gray-300 opacity-20 my-2.5"></div>
          <div>
            <p className="m-0 opacity-70 text-sm sm:text-base md:text-lg">
              {t(currentItem?.description ?? '')}
            </p>
          </div>
        </div>
      )}
      <div>
        <Outlet />
      </div>
    </>
  );
}
