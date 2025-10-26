import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3,
  Calendar,
  MessageSquare,
  FileText,
  Upload,
  Activity
} from 'lucide-react';

const AdminBottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const bottomBarItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Users", path: "/admin/users" },
    { icon: MessageSquare, label: "Messages", path: "/admin/messages" },
    { icon: Calendar, label: "Events", path: "/admin/events" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: FileText, label: "Content", path: "/admin/content" },
    { icon: Upload, label: "Import", path: "/admin/bulk-import" },
    { icon: Activity, label: "Logs", path: "/admin/logs" }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex items-center h-16 overflow-x-auto scrollbar-hide px-2">
        {bottomBarItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center min-w-[80px] h-full space-y-1 transition-colors px-3 ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : ''}`} />
              <span className={`text-xs font-medium whitespace-nowrap ${isActive ? 'text-blue-600' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AdminBottomBar;
