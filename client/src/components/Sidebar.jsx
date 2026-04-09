import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Home,
  Users,
  Briefcase,
  Calendar,
  UserCheck,
  User,
  LogOut,
  UserPlus,
  MessageSquare,
  Plus,
  FileText,
  ChevronDown,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutButton from './LogoutButton';
import { logout } from '../store/slices/userSlice';
import { toast } from "sonner";

const sidebarItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Users, label: "Alumni Directory", path: "/alumni" },
  { icon: UserPlus, label: "My Connections", path: "/connections" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Briefcase, label: "Job Board", path: "/jobs" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: FileText, label: "News & Stories", path: "/news-stories" },
  { icon: User, label: "Profile", path: "/profile" }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobsExpanded, setJobsExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL ?? '';
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

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleMobileLogout = () => {
    setShowProfileMenu(false);
    dispatch(logout());
    toast.success('Logged out successfully!');
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* Mobile Top Bar - visible only on mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm md:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-2" onClick={() => navigate('/home')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-blue-600 poppins-semibold">AlumniBridge</span>
          </div>

          {/* Profile Avatar with Dropdown + Logout Icon */}
          <div className="flex items-center space-x-2">
            {/* Profile Avatar with Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="relative focus:outline-none"
                aria-label="Profile menu"
              >
                <Avatar className="h-9 w-9 ring-2 ring-blue-100 transition-all active:ring-blue-300">
                  <AvatarImage src={currentUser?.profile?.profileUrl} />
                  <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm">
                    {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator dot */}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900 truncate poppins-medium">
                      {currentUser?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {currentUser?.email || ''}
                    </p>
                    <span className="inline-block mt-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                      {currentUser?.role || 'user'}
                    </span>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/messages');
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <span>Messages</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleMobileLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Icon Button */}
            <button
              onClick={handleMobileLogout}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors duration-200 focus:outline-none"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - hidden on mobile */}
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
              // Handle Jobs section specially
              if (item.path === "/jobs") {
                const isJobsActive = location.pathname.startsWith('/jobs');
                const jobSubItems = [
                  { label: "Browse Jobs", path: "/jobs" },
                  { label: "My Applications", path: "/jobs/my-applications" },
                  ...(currentUser?.role === 'alumni' ? [
                    { label: "Post Job", path: "/jobs/post" },
                    { label: "My Jobs", path: "/jobs/my-jobs" }
                  ] : [])
                ];

                return (
                  <div key={index}>
                    <Button
                      variant={isJobsActive ? "default" : "ghost"}
                      className={`w-full justify-between h-10 px-3 ${isJobsActive
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                        }`}
                      onClick={() => {
                        setJobsExpanded(!jobsExpanded);
                        if (!jobsExpanded) navigate(item.path);
                      }}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-4 w-4" />
                        <span className="poppins-medium">{item.label}</span>
                      </div>
                      {jobsExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>

                    {jobsExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {jobSubItems.map((subItem, subIndex) => {
                          const isSubActive = location.pathname === subItem.path;
                          return (
                            <Button
                              key={subIndex}
                              variant={isSubActive ? "default" : "ghost"}
                              size="sm"
                              className={`w-full justify-start h-8 px-3 text-xs ${isSubActive
                                  ? "bg-blue-500 text-white hover:bg-blue-600"
                                  : "text-gray-600 hover:bg-gray-50"
                                }`}
                              onClick={() => navigate(subItem.path)}
                            >
                              {subItem.label}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular navigation items
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={index}
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start h-10 px-3 ${isActive
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
    </>
  );
};

export default Sidebar;

