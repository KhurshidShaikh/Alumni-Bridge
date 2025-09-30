import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Megaphone, 
  Calendar, 
  FileText,
  Upload,
  Activity,
  Settings, 
  LogOut,
  Shield,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const adminSidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "User Management", path: "/admin/users" },
  { icon: MessageSquare, label: "Messages", path: "/admin/messages" },
  { icon: Calendar, label: "Events", path: "/admin/events" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
  { icon: FileText, label: "Content Moderation", path: "/admin/content" },
  { icon: Upload, label: "Bulk Import", path: "/admin/bulk-import" },
  { icon: Activity, label: "Admin Logs", path: "/admin/logs" }
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load admin data from localStorage
  useEffect(() => {
    try {
      const adminData = localStorage.getItem('adminData');
      if (adminData) {
        setCurrentAdmin(JSON.parse(adminData));
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    // Clear admin data
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    
    // Navigate to admin login
    navigate('/admin/login');
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg hidden md:block border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <Shield className="text-white w-4 h-4" />
          </div>
          <div>
            <span className="text-lg font-semibold text-gray-900 poppins-semibold">Admin Panel</span>
            <p className="text-xs text-gray-500">Alumni Bridge</p>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ) : currentAdmin ? (
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentAdmin.profile?.profileUrl} />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {currentAdmin.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate poppins-medium">{currentAdmin.name}</p>
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-blue-600" />
                  <p className="text-xs text-blue-600 truncate font-medium">Administrator</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                  <Shield className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
                <p className="text-xs text-gray-500 truncate">Not logged in</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {adminSidebarItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={index}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-10 px-3 ${
                  isActive 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
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
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="ghost"
            className="w-full justify-start text-blue-600 hover:bg-blue-50 hover:text-blue-700"
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

export default AdminSidebar;
