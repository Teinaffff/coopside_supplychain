import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../../../common/ui/card';
import { Button } from '../../../common/ui/button';
import { Badge } from '../../../common/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar, 
  Clock, 
  Edit3, 
  Key,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, currentUser } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  // Get user data with fallbacks
  const userData = {
    name: user?.name || currentUser?.username || 'User',
    email: user?.email || 'user@example.com',
    phone: '+251 92 119 1399', // This would come from user data
    role: user?.role || currentUser?.userType || 'SUPER_ADMIN',
    bio: user?.bio || 'System Administrator',
    profilePic: user?.photo || user?.profile_pic,
    createdAt: user?.createdAt || new Date().toISOString(),
    lastLogin: new Date().toISOString(), // This would come from auth data
    active: user?.active ?? true
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            {userData.profilePic ? (
              <img
                src={userData.profilePic}
                alt={userData.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-200 dark:border-gray-700">
                {getInitials(userData.name)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1">
              <Badge 
                variant={userData.active ? "default" : "secondary"}
                className="text-xs px-2 py-1"
              >
                {userData.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-3 mb-2">
            {userData.name}
          </h1>
          <Badge 
            variant="outline" 
            className="text-sm px-3 py-1"
          >
            {userData.role}
          </Badge>
        </div>

        {/* Profile Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Profile Information Card */}
          <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile Information
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50 dark:bg-slate-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userData.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50 dark:bg-slate-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userData.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50 dark:bg-slate-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userData.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50 dark:bg-slate-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{userData.role}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Activity Card */}
          <Card className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Activity
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50 dark:bg-slate-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Account Created</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(userData.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2 rounded-md bg-gray-50 dark:bg-slate-700">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last Login</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatDate(userData.lastLogin)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={() => navigate('/pc/changepassword')}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            <Key className="w-4 h-4" />
            Change Password
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
