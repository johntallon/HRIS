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
      const account = msalInstance.getAllAccounts()[0];
      if (!account) {
        throw new Error('Not authenticated');
      }

      const tokenResponse = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

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
      await msalInstance.loginRedirect(loginRequest);
    } catch (err) {
      toast({
        title: "Login failed",
        description: "Failed to login with Azure AD",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
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