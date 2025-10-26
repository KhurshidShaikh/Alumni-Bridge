import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import AdminBottomBar from '../../components/AdminBottomBar';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  FileText,
  Upload,
  Activity,
  LogOut,
  Shield,
  ChevronRight,
  User
} from 'lucide-react';

const AdminMenu = () => {
  const navigate = useNavigate();
  const [currentAdmin, setCurrentAdmin] = useState(null);

  useEffect(() => {
    // Check admin authentication
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    // Load admin data
    try {
      const adminData = localStorage.getItem('adminData');
      if (adminData) {
        setCurrentAdmin(JSON.parse(adminData));
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: Calendar, label: "Events", path: "/admin/events", color: "text-purple-600" },
    { icon: FileText, label: "Content Moderation", path: "/admin/content", color: "text-green-600" },
    { icon: Upload, label: "Bulk Import", path: "/admin/bulk-import", color: "text-orange-600" },
    { icon: Activity, label: "Admin Logs", path: "/admin/logs", color: "text-red-600" }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="text-white w-4 h-4" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">More Options</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="p-4 md:p-6 max-w-4xl mx-auto">
            {/* Admin Profile Card */}
            <Card className="mb-6">
              <CardContent className="p-6">
                {currentAdmin ? (
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={currentAdmin.profile?.profileUrl} />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                        {currentAdmin.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-semibold text-gray-900 truncate">{currentAdmin.name}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <p className="text-sm text-blue-600 font-medium">Administrator</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 truncate">{currentAdmin.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        <User className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Admin User</h2>
                      <p className="text-sm text-gray-500">Not logged in</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Menu Items */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">
                Additional Options
              </h3>
              
              {menuItems.map((item, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(item.path)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center ${item.color}`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-900">{item.label}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Logout Button */}
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow border-red-200"
                onClick={handleLogout}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                        <LogOut className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-red-600">Logout</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <AdminBottomBar />
      </div>
    </div>
  );
};

export default AdminMenu;
