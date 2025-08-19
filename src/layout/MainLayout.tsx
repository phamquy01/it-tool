import { useState } from 'react';

import Header from './Header';
import Sidebar from './Sidebar';
import ToolLayout from './ToolLayout';

const MainLayout = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f1f5f9] dark:bg-gray-900">
      <div className="flex flex-1">
        {/* Overlay when sidebar is open */}
        {!isSidebarHidden && (
          <>
            <div
              className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
              onClick={toggleSidebar}
            />
            <div
              className={`fixed sm:absolute md:static top-0 left-0 h-full w-60 flex-shrink-0 bg-white dark:bg-gray-800 z-40 transition-transform duration-300 ${
                isSidebarHidden
                  ? 'transform -translate-x-full'
                  : 'transform translate-x-0'
              } md:translate-x-0 md:block`}
            >
              <Sidebar />
            </div>
          </>
        )}
        <main className="flex-1 p-6">
          <Header onToggleSidebar={toggleSidebar} />
          <div>
            <ToolLayout />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
