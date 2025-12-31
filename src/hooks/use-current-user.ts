import { useQuery } from '@tanstack/react-query';
import userService from '../services/userService';

// Hook to fetch current logged-in user
export const useCurrentUser = (enabled = true) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = await userService.getCurrentUser();
      return user;
    },
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes - user profile doesn't change often
    retry: 2,
  });
};
