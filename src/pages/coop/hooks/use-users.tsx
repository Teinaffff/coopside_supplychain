import { useQuery } from '@tanstack/react-query';
import userService from '../../../services/userService';

// Fetch all users from the backend
const fetchUsers = async () => {
  try {
    const users = await userService.getAllUsers();
    
    if (!Array.isArray(users)) {
      console.error('Users response is not an array:', users);
      return [];
    }
    
    // Transform users data to match the User interface in the page
    return users.map((user: any) => {
      // Map roleType to role
      const roleMapping: Record<string, string> = {
        'admin': 'Admin',
        'agent': 'Agent',
        'institution': 'Institution',
        'factory': 'Factory',
        'consumer': 'Consumer',
      };

      // Determine role from roleType or roleId
      let role = 'Admin'; // default
      if (user.roleType) {
        role = roleMapping[user.roleType.toLowerCase()] || user.roleType;
      } else if (user.roleId) {
        // Map roleId to role
        const roleIdMapping: Record<number, string> = {
          1: 'Admin',
          2: 'Agent',
          3: 'Institution',
          4: 'Factory',
          5: 'Consumer',
        };
        role = roleIdMapping[user.roleId] || 'Admin';
      }

      // Construct full name
      const name = user.name || 
                   (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 
                   (user.firstName || user.lastName || user.username || `User ${user.id}`));

      return {
        id: user.id?.toString() || String(user.userId || ''),
        name,
        email: user.email || 'N/A',
        phone: user.phoneNumber || user.phone || 'N/A',
        role,
        portal: user.portal || 'Coop', // default to Coop if not specified
        status: user.status === 'ACTIVE' || user.status === 'Active' ? 'Active' : 'Inactive',
      };
    });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Hook to fetch all users
export const useUsers = (enabled = true) => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
