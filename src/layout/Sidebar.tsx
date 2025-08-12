import { useState } from 'react';
import {
  KeyRound,
  Hash,
  Fingerprint,
  KeySquare,
  Lock,
  List,
  Shield,
  Key,
  Grid,
  FileText,
  ChevronDown,
} from 'lucide-react';

const Sidebar = () => {
  const toolCategories = [
    {
      title: 'Crypto',
      items: [
        { label: 'Token generator', icon: KeyRound },
        { label: 'Hash text', icon: Hash },
        { label: 'Bcrypt', icon: Fingerprint },
        { label: 'UUIDs generator', icon: KeySquare },
        { label: 'ULID generator', icon: Grid },
        { label: 'Encrypt / decrypt text', icon: Lock },
        { label: 'BIP39 passphrase gen...', icon: List },
        { label: 'Hmac generator', icon: Shield },
        { label: 'RSA key pair generator', icon: Key },
        { label: 'Password strength ana...', icon: Shield },
        { label: 'PDF signature checker', icon: FileText },
      ],
    },
    {
      title: 'Converter',
      items: [
        { label: 'Base64 encoder', icon: KeyRound },
        { label: 'Base64 decoder', icon: KeyRound },
      ],
    },
  ];

  const [openSections, setOpenSections] = useState<string[]>(['Crypto']);

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <div className="w-full h-full bg-white shadow-lg">
      <div className=" text-white bg-gradient-to-br from-[#1E7D8D] to-[#2CB875] pt-4 pb-6 ">
        <div className="text-[25px] font-semibold mb-2 w-full text-center">
          IT - TOOLS
        </div>
        <div className="text-[16px] font-semibold  w-full text-center text-white">
          Handy tools for developers
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full bg-white">
        {toolCategories.map((section) => {
          const isOpen = openSections.includes(section.title);
          return (
            <div key={section.title} className="mb-3">
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center w-full hover:bg-gray-50 rounded-md transition-colors duration-200"
              >
                <ChevronDown
                  size={14}
                  className={`mr-2 text-gray-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-0' : '-rotate-90'
                  }`}
                />
                <span className="text-[13px] font-medium text-gray-400">
                  {section.title}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="pl-6 mt-1 space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded-md cursor-pointer transition-colors duration-200"
                      >
                        <Icon size={14} className="mr-2 text-gray-400" />
                        <span className="text-sm text-gray-700">
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
