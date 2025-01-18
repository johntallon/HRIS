import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import type { User } from "@db/schema";

export function useUser() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, error, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      return response.json();
    },
    retry: false
  });

  const login = async () => {
    window.location.href = '/auth/login';
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    window.location.href = '/auth';
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
  };
}