import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Briefcase, 
  Calendar, 
  UserCheck, 
  User, 
  Settings, 
  LogOut,
  UserPlus,
  MessageSquare
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutButton from './LogoutButton';

const sidebarItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Users, label: "Alumni Directory", path: "/alumni" },
  { icon: UserPlus, label: "My Connections", path: "/connections" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Briefcase, label: "Job Board", path: "/jobs" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: UserCheck, label: "Mentorship", path: "/mentorship" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Settings, label: "Settings", path: "/settings" }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const response = await fetch(`${backendUrl}/api/profile/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.success) {
          setCurrentUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    // This is now handled by LogoutButton component
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
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ) : currentUser ? (
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.profile?.profileUrl} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate poppins-medium">{currentUser.name}</p>
                <p className="text-xs text-gray-500 truncate capitalize">{currentUser.role}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                  ?
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Guest User</p>
                <p className="text-xs text-gray-500 truncate">Not logged in</p>
              </div>
            </div>
          )}
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
          <LogoutButton 
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
