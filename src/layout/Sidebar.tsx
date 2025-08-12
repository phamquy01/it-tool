import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { toolCategories } from '../utils/constants/toolCategories';

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

  return (
    <div className="w-full h-full bg-white shadow-lg flex flex-col">
      {/* Fixed Header */}
      <div
        className="flex-shrink-0 text-white bg-gradient-to-br from-[#1E7D8D] to-[#2CB875] pt-4 pb-6 cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => navigate('/')}
      >
        <div className="text-[25px] font-semibold mb-2 w-full text-center">
          IT - TOOLS
        </div>
        <div className="text-[16px] font-semibold  w-full text-center text-white">
          Handy tools for developers
        </div>
      </div>

      {/* Navigation - Only scrolls when content is too long */}
      <div className="flex-1 bg-white overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent min-h-0">
        {toolCategories.map((section) => {
          const isOpen = openSections.includes(section.title);
          return (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center w-full rounded-md transition-discrete duration-200 p-0 mt-3 ml-1.5 font-medium "
              >
                <ChevronDown
                  size={14}
                  className={` text-gray-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
                <span className="text-[13px] font-medium text-gray-400 ml-2">
                  {section.title}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out flex ${
                  isOpen ? 'opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className=" w-[24px] opacity-10 hover:opacity-100 transition-opacity duration-200 ease-in-out relative cursor-pointer"></div>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isSelected = location.pathname === item.path;
                    return (
                      <div
                        onClick={() => handleItemClick(item.path)}
                        key={item.label}
                        className={`flex items-center rounded-md cursor-pointer transition-colors duration-200 mt-1 px-2 py-1.5 ${
                          isSelected ? 'bg-[#ebf6f0]' : 'hover:bg-gray-50'
                        }`}
                      >
                        <Icon
                          size={20}
                          className={`mr-2  ${
                            isSelected ? 'text-[#18a058]' : 'text-black'
                          }`}
                        />
                        <span
                          className={`text-sm ml-1 ${
                            isSelected ? 'text-[#18a058]' : 'text-black'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
