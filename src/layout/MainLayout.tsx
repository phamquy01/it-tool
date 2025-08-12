import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9] dark:bg-gray-900">
      <div className="flex flex-1">
        {!isSidebarHidden && (
          <div className="w-60 flex-shrink-0 transition-all duration-300">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 p-6">
          <Header onToggleSidebar={toggleSidebar} />
          <div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
