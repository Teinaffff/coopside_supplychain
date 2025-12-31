import API from '../config/axios-config';

export interface User {
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  phoneNumber?: string;
  phone?: string;
  roleType?: string;
  roleId?: number;
  status?: string;
  portal?: string;
  department?: string;
  employeeId?: string;
  userId?: number;
  [key: string]: any;
}

class UserService {
  // Get current logged-in user profile
  async getCurrentUser(): Promise<User> {
    try {
      const response = await API.get(`/v1/users/me`);
      
      // Handle different response structures
      const user = response.data?.data || response.data;
      return user;
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }

  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await API.get(`/v1/users`);
      
      // Handle different response structures
      let users = response.data;
      
      // If data is nested under 'data' property
      if (response.data?.data) {
        users = response.data.data;
      }
      
      // If data is nested under 'users' property
      if (response.data?.users) {
        users = response.data.users;
      }
      
      return Array.isArray(users) ? users : [];
    } catch (error: any) {
      console.error('Error fetching users:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId: number): Promise<User> {
    try {
      console.log('Fetching user with ID:', userId);
      const response = await API.get(`/v1/users/${userId}`);
      // Normalize possible response shapes
      const data = (response as any)?.data?.data ?? (response as any)?.data ?? response;
      return data as User;
    } catch (error: any) {
      console.error('Error fetching user by ID:', error);
      console.error('User ID attempted:', userId);
      console.error('Error details:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get admin user by ID (with role type check)
  async getAdminById(adminId: number): Promise<User | null> {
    try {
      const user = await this.getUserById(adminId);
      
      // Check if user has admin role
      if (user.roleType?.toLowerCase() === 'admin') {
        return user;
      } else {
        console.warn(`User ${adminId} is not an admin. Role type: ${user.roleType}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching admin by ID:', error);
      return null;
    }
  }

  // Delete user by ID
  async deleteUser(userId: number): Promise<void> {
    try {
      await API.delete(`/v1/users/${userId}`);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }

  // Activate user (unlock)
  async activateUser(userId: number): Promise<void> {
    try {
      await API.put(`/v1/users/${userId}/unlock`);
    } catch (error: any) {
      console.error('Error activating user:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }

  // Deactivate user (suspend)
  async deactivateUser(userId: number): Promise<void> {
    try {
      await API.put(`/v1/users/${userId}/suspend`);
    } catch (error: any) {
      console.error('Error deactivating user:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }

  // Update user by ID
  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await API.put(`/v1/users/${userId}`, userData);
      const updatedUser = response.data?.data || response.data;
      return updatedUser;
    } catch (error: any) {
      console.error('Error updating user:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }
}

export default new UserService();
