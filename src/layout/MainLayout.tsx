import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1">
        <div className="w-60 flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 p-6 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Welcome to IT Tools
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Select a tool from the sidebar to get started.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
