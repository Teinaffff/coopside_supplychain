import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Edit2 } from 'lucide-react';
import { Button } from '../../../common/ui/button';
import { Input } from '../../../common/ui/input';
import { useCurrentUser } from '../../../hooks/use-current-user';
import { toast } from 'react-hot-toast';
import userService from '../../../services/userService';

const ProfilePage: React.FC = () => {
  // Fetch current user from API
  const { data: currentUser, isLoading, error, refetch } = useCurrentUser();
  
  const [activeTab, setActiveTab] = useState<'details' | 'password'>('details');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form states - initialized with API data
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
  });
  
  // Update form data when user data is loaded
  useEffect(() => {
    if (currentUser) {
      const fullName = currentUser.firstName && currentUser.lastName
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : currentUser.name || currentUser.username || 'User';
      
      setFormData({
        fullName,
        username: currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || currentUser.phone || '',
        employeeId: currentUser.employeeId || '',
        department: currentUser.department || '',
      });
    }
  }, [currentUser]);
  
  // Show error toast if API fails
  useEffect(() => {
    if (error) {
      toast.error('Failed to load user profile');
    }
  }, [error]);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasSpecial: false,
  });

  // Validate password on change
  const validatePassword = (password: string) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasSpecial: /[0-9!@#$%^&*(),.?":{}|<>\s]/.test(password),
    });
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData({ ...passwordData, [field]: value });
    if (field === 'newPassword') {
      validatePassword(value);
    }
  };

  const handleUpdatePassword = () => {
    // TODO: Integrate with actual API
    console.log('Update password:', passwordData);
  };

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordValidation({
      minLength: false,
      hasLowercase: false,
      hasUppercase: false,
      hasSpecial: false,
    });
  };

  const handleSaveProfile = async () => {
    if (!currentUser?.id) {
      toast.error('User ID not found');
      return;
    }

    setIsSaving(true);
    try {
      // Split full name into first and last name
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts.slice(0, -1).join(' ') || nameParts[0] || '';
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

      // Map roleType to roleId if roleId is not available
      let roleId = currentUser.roleId;
      if (!roleId && currentUser.roleType) {
        const roleMap: Record<string, number> = {
          'admin': 1,
          'agent': 2,
          'institution': 3,
          'factory': 4,
          'consumer': 5,
        };
        roleId = roleMap[currentUser.roleType.toLowerCase()] || 1;
      }
      if (!roleId) {
        roleId = 1; // Default to admin if no role found
      }

      const updateData = {
        email: formData.email,
        firstName,
        lastName,
        phoneNumber: formData.phone,
        roleId: roleId,
        status: currentUser.status || 'ACTIVE',
        department: formData.department || '',
        employeeId: formData.employeeId || '',
        remarks: '',
      };

      console.log('Updating profile with data:', updateData);
      const updatedUser = await userService.updateUser(currentUser.id, updateData);
      toast.success('Profile updated successfully');
      
      // Update form data immediately with the response from the API
      const fullName = updatedUser.firstName && updatedUser.lastName
        ? `${updatedUser.firstName} ${updatedUser.lastName}`
        : updatedUser.name || updatedUser.username || 'User';
      
      setFormData({
        fullName,
        username: updatedUser.username || '',
        email: updatedUser.email || '',
        phone: updatedUser.phoneNumber || updatedUser.phone || '',
        employeeId: updatedUser.employeeId || '',
        department: updatedUser.department || '',
      });
      
      setIsEditing(false);
      
      // Refetch user data to get fresh data from backend
      await refetch();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      console.error('Error response:', err?.response?.data);
      const message = err?.response?.data?.message || err.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original user data
    if (currentUser) {
      const fullName = currentUser.firstName && currentUser.lastName
        ? `${currentUser.firstName} ${currentUser.lastName}`
        : currentUser.name || currentUser.username || 'User';
      
      setFormData({
        fullName,
        username: currentUser.username || '',
        email: currentUser.email || '',
        phone: currentUser.phoneNumber || currentUser.phone || '',
        employeeId: currentUser.employeeId || '',
        department: currentUser.department || '',
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{formData.fullName || currentUser?.firstName || 'User Profile'}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{formData.email}</p>
          </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'details'
                ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            User Details
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'password'
                ? 'text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Change Password
          </button>
        </div>

        {/* User Details Tab */}
        {activeTab === 'details' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Details</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <Edit2 size={18} />
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter full name"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-md text-gray-600 dark:text-gray-300">
                    {formData.fullName}
                  </div>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-md text-gray-600 dark:text-gray-300">
                  {formData.username}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-md text-gray-600 dark:text-gray-300">
                    {formData.email}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-md text-gray-600 dark:text-gray-300">
                    {formData.phone || 'N/A'}
                  </div>
                )}
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Employee ID
                </label>
                {isEditing ? (
                  <Input
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="Enter employee ID"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-md text-gray-600 dark:text-gray-300">
                    {formData.employeeId || 'N/A'}
                  </div>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                {isEditing ? (
                  <Input
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Enter department"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-slate-700 rounded-md text-gray-600 dark:text-gray-300">
                    {formData.department || 'N/A'}
                  </div>
                )}
              </div>
            </div>

            {/* Save/Cancel buttons when editing */}
            {isEditing && (
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-6 bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Password Form */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Change Password</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Please enter your current password to change your password.
              </p>

              <div className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className="pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={handleCancelPassword}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdatePassword}
                  className="px-6 bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  Update Password
                </Button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm h-fit">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                PASSWORD REQUIREMENTS
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    passwordValidation.minLength
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {passwordValidation.minLength && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Minimum 8 characters long - the more, the better
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    passwordValidation.hasLowercase
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {passwordValidation.hasLowercase && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    At least one lowercase character
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    passwordValidation.hasUppercase
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {passwordValidation.hasUppercase && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    At least one uppercase character
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    passwordValidation.hasSpecial
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {passwordValidation.hasSpecial && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    At least one number, symbol, or whitespace character
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default ProfilePage;
