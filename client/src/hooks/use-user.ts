import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from "@/hooks/use-toast";
import type { User } from "@db/schema";
import { msalInstance, loginRequest } from '@/lib/auth';

export function useUser() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, error, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
    queryFn: async () => {
      await msalInstance.initialize();
      const account = msalInstance.getAllAccounts()[0];
      if (!account) {
        throw new Error('Not authenticated');
      }

      const tokenResponse = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      // First check if user exists
      const userResponse = await fetch(`/api/users/lookup/${account.username}`, {
        headers: {
          'Authorization': `Bearer ${tokenResponse.accessToken}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to lookup user');
      }

      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${tokenResponse.accessToken}`
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
    try {
      await msalInstance.initialize();
      await msalInstance.loginPopup(loginRequest);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    } catch (err) {
      toast({
        title: "Login failed",
        description: "Failed to login with Azure AD",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    await msalInstance.initialize();
    await msalInstance.logoutPopup();
    queryClient.invalidateQueries({ queryKey: ['/api/user'] });
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
  };
}