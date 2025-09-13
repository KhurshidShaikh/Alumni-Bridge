import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  User, 
  Eye, 
  Bell, 
  Palette, 
  Shield, 
  Database,
  Camera,
  Mail,
  Sun,
  Key,
  Download
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import BottomBar from '../components/BottomBar';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    // Account Settings
    name: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate computer science student interested in full-stack development and machine learning.',
    
    // Privacy Settings
    profileVisibility: 'public',
    showEmail: true,
    showPhone: false,
    allowMentorshipRequests: true,
    showOnlineStatus: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    mentorshipNotifications: true,
    eventNotifications: true,
    jobNotifications: true,
    weeklyDigest: true,
    
    // Appearance Settings
    theme: 'light',
    language: 'english',
    timezone: 'EST',
    
    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
    
    // Data Settings
    dataExport: false,
    analyticsOptIn: true,
    marketingEmails: false
  });


  const settingsTabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Privacy', icon: Database }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast.success('Settings saved successfully!', {
      position: 'top-right'
    });
  };

  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation dialog
    toast.error('Account deletion requires confirmation', {
      position: 'top-right'
    });
  };

  const handleExportData = () => {
    toast.success('Data export initiated. You will receive an email when ready.', {
      position: 'top-right'
    });
  };

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/api/placeholder/64/64" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4 mr-2" />
              Change Photo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <Input
                value={settings.name}
                onChange={(e) => handleSettingChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => handleSettingChange('email', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <Input
                value={settings.phone}
                onChange={(e) => handleSettingChange('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => handleSettingChange('timezone', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="EST">Eastern Time (EST)</option>
                <option value="CST">Central Time (CST)</option>
                <option value="MST">Mountain Time (MST)</option>
                <option value="PST">Pacific Time (PST)</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={settings.bio}
              onChange={(e) => handleSettingChange('bio', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Who can see your profile?</label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="public">Everyone</option>
              <option value="alumni">Alumni Only</option>
              <option value="private">Only Me</option>
            </select>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Show email address</span>
              <Button
                variant={settings.showEmail ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('showEmail', !settings.showEmail)}
              >
                {settings.showEmail ? 'Visible' : 'Hidden'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Show phone number</span>
              <Button
                variant={settings.showPhone ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('showPhone', !settings.showPhone)}
              >
                {settings.showPhone ? 'Visible' : 'Hidden'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Allow mentorship requests</span>
              <Button
                variant={settings.allowMentorshipRequests ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('allowMentorshipRequests', !settings.allowMentorshipRequests)}
              >
                {settings.allowMentorshipRequests ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Show online status</span>
              <Button
                variant={settings.showOnlineStatus ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('showOnlineStatus', !settings.showOnlineStatus)}
              >
                {settings.showOnlineStatus ? 'Visible' : 'Hidden'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                <p className="text-xs text-gray-500">Receive notifications via email</p>
              </div>
              <Button
                variant={settings.emailNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
              >
                <Mail className="h-4 w-4 mr-2" />
                {settings.emailNotifications ? 'On' : 'Off'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                <p className="text-xs text-gray-500">Receive push notifications on your device</p>
              </div>
              <Button
                variant={settings.pushNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                {settings.pushNotifications ? 'On' : 'Off'}
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Mentorship notifications</span>
              <Button
                variant={settings.mentorshipNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('mentorshipNotifications', !settings.mentorshipNotifications)}
              >
                {settings.mentorshipNotifications ? 'On' : 'Off'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Event notifications</span>
              <Button
                variant={settings.eventNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('eventNotifications', !settings.eventNotifications)}
              >
                {settings.eventNotifications ? 'On' : 'Off'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Job notifications</span>
              <Button
                variant={settings.jobNotifications ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('jobNotifications', !settings.jobNotifications)}
              >
                {settings.jobNotifications ? 'On' : 'Off'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Weekly digest</span>
              <Button
                variant={settings.weeklyDigest ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('weeklyDigest', !settings.weeklyDigest)}
              >
                {settings.weeklyDigest ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance & Display</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="flex space-x-2">
              <Button
                variant={settings.theme === 'light' ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('theme', 'light')}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button
                variant={settings.theme === 'dark' ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('theme', 'dark')}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
              <Button
                variant={settings.theme === 'auto' ? "default" : "outline"}
                size="sm"
                onClick={() => handleSettingChange('theme', 'auto')}
              >
                Auto
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security & Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Two-Factor Authentication</span>
              <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <Button
              variant={settings.twoFactorAuth ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
            >
              <Key className="h-4 w-4 mr-2" />
              {settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Login Alerts</span>
              <p className="text-xs text-gray-500">Get notified of new login attempts</p>
            </div>
            <Button
              variant={settings.loginAlerts ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange('loginAlerts', !settings.loginAlerts)}
            >
              {settings.loginAlerts ? 'On' : 'Off'}
            </Button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
              <option value="never">Never</option>
            </select>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Login History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Analytics & Usage Data</span>
              <p className="text-xs text-gray-500">Help improve our platform by sharing usage data</p>
            </div>
            <Button
              variant={settings.analyticsOptIn ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange('analyticsOptIn', !settings.analyticsOptIn)}
            >
              {settings.analyticsOptIn ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-700">Marketing Emails</span>
              <p className="text-xs text-gray-500">Receive promotional emails and updates</p>
            </div>
            <Button
              variant={settings.marketingEmails ? "default" : "outline"}
              size="sm"
              onClick={() => handleSettingChange('marketingEmails', !settings.marketingEmails)}
            >
              {settings.marketingEmails ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export My Data
            </Button>
            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>
          
          <Separator />
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
              <span className="font-medium text-red-800">Danger Zone</span>
            </div>
            <p className="text-sm text-red-700 mb-3">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return renderAccountSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'security':
        return renderSecuritySettings();
      case 'data':
        return renderDataSettings();
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 poppins-regular">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Bottom Bar for Mobile */}
      <BottomBar />

      {/* Main Content */}
      <div className="md:ml-64 pb-20 md:pb-0 min-h-screen overflow-auto bg-gray-50">
        <div className="p-3 md:p-8 max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-sm md:text-base text-gray-600">Manage your account preferences and privacy settings</p>
          </div>

          <div className="flex space-x-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4 md:p-6">
                  <nav className="space-y-1 md:space-y-2">
                    {settingsTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-3 transition-colors text-sm md:text-base ${
                          activeTab === tab.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <tab.icon className="h-4 w-4 md:h-5 md:w-5" />
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="flex-1">
              {renderTabContent()}
              
              {/* Save Button */}
              <div className="mt-8 flex justify-end">
                <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
