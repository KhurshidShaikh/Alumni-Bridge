import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Briefcase, 
  Calendar, 
  UserCheck, 
  User, 
  Settings, 
  LogOut
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Users, label: "Alumni Directory", path: "/alumni" },
  { icon: Briefcase, label: "Job Board", path: "/jobs" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: UserCheck, label: "Mentorship", path: "/mentorship" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" }
];

const Sidebar = ({ user = { name: "John Doe", role: "Student", avatar: "" } }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg hidden md:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">AB</span>
          </div>
          <span className="text-xl font-semibold text-gray-900 poppins-semibold">Alumni Bridge</span>
        </div>

        {/* User Profile */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate poppins-medium">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1">
          {sidebarItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={index}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-10 px-3 ${
                  isActive 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                <span className="poppins-medium">{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="poppins-medium">Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
