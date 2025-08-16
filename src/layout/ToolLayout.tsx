import { Outlet, useLocation } from 'react-router-dom';
import { toolCategories } from '../utils/constants/toolCategories';
import FavoriteTool from '../components/FavoriteTool';

export default function ToolLayout() {
  const location = useLocation();
  const allItems = toolCategories.flatMap((section) => section.items);
  const currentItem = allItems.find((item) => item.path === location.pathname);
  const isHome = location.pathname === '/';
  return (
    <>
      {!isHome && (
        <div className="max-w-[600px] mx-auto py-10">
          <div className="flex items-center justify-between ">
            <h1 className="opacity-90 !text-[40px] font-medium m-0 leading-tight">
              {currentItem?.label}
            </h1>
            <FavoriteTool tool={{ path: currentItem?.path as string }} />
          </div>
          <div className="w-[200px] h-0.5 bg-gray-300 opacity-20 my-2.5"></div>
          <div>
            <p className="m-0 opacity-70">{currentItem?.description}</p>
          </div>
        </div>
      )}
      <div>
        <Outlet />
      </div>
    </>
  );
}
