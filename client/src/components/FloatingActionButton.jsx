import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Plus, X } from 'lucide-react';

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const menuItems = [
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  return (
    <div className="fixed bottom-20 right-4 md:hidden z-40">
      {/* Menu Items */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.path}
                className="flex items-center space-x-3 animate-in slide-in-from-bottom-2 duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
                  {item.label}
                </span>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Icon className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-gray-600 text-white rotate-45' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
