import { useState, useEffect } from 'react';

import Header from './Header';
import Sidebar from './Sidebar';
import ToolLayout from './ToolLayout';

const MainLayout = () => {
  // Auto-hide sidebar on tablet/mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const handleResize = () => {
      if (mq.matches) {
        setIsSidebarHidden(true);
      } else {
        setIsSidebarHidden(false);
      }
    };
    handleResize();
    mq.addEventListener('change', handleResize);
    return () => {
      mq.removeEventListener('change', handleResize);
    };
  }, []);
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarHidden(!isSidebarHidden);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f1f5f9] dark:bg-zinc-900">
      <div className="flex flex-1">
        <div
          className={`fixed inset-0 bg-black z-30 md:hidden transition-opacity duration-300 ${
            isSidebarHidden ? 'opacity-0 pointer-events-none' : 'opacity-40'
          }`}
          onClick={toggleSidebar}
        />

        {/* Sidebar */}
        <div
          className={`fixed sm:absolute md:static top-0 left-0 h-full bg-white dark:bg-gray-800 z-40 
            transition-all duration-300 overflow-hidden
            ${isSidebarHidden ? 'w-0' : 'w-71'}
          `}
        >
          <Sidebar />
        </div>

        {/* main*/}
        <main className={`flex-1 transition-all duration-300`}>
          <Header onToggleSidebar={toggleSidebar} />
          <div
            className="custom-scroll px-6.5"
            style={{ maxHeight: 'calc(100vh - 84px)', overflowY: 'auto' }}
          >
            <ToolLayout />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
