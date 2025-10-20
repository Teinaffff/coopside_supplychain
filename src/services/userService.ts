import API from '../config/axios-config';

export interface User {
  id: number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roleType?: string;
  [key: string]: any;
}

class UserService {
  // Get all users
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await API.get(`/v1/users`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
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
    } catch (error) {
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
}

export default new UserService();
