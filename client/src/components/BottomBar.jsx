import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Briefcase, 
  Calendar, 
  MessageCircle, 
  User, 
  UserPlus,
  FileText
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const BottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Users, label: 'Alumni', path: '/alumni' },
    { icon: FileText, label: 'Stories', path: '/news-stories' },
    { icon: Briefcase, label: 'Jobs', path: '/jobs' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center py-1 pb-safe">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-colors duration-200 ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-500 active:text-gray-700'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div className={`p-1 rounded-lg transition-all duration-200 ${
                isActive ? 'bg-blue-50' : ''
              }`}>
                <Icon className={`transition-all duration-200 ${
                  isActive ? 'h-6 w-6' : 'h-5 w-5'
                }`} />
              </div>
              <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomBar;
