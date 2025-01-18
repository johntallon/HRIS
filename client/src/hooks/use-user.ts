
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from "@db/schema";
import { useToast } from "@/hooks/use-toast";
import { PublicClientApplication, type AccountInfo } from "@azure/msal-browser";

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_AD_CLIENT_ID!,
    authority: import.meta.env.VITE_AZURE_AD_AUTHORITY!,
    redirectUri: "http://0.0.0.0:5000",
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

export function useUser() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: user, error, isLoading } = useQuery<User>({
    queryKey: ['/api/user'],
    queryFn: async () => {
      const account = msalInstance.getAllAccounts()[0];
      if (!account) {
        throw new Error('No logged in user');
      }
      
      const token = await msalInstance.acquireTokenSilent({
        scopes: ['user.read'],
        account
      });
      
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token.accessToken}`
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
      await msalInstance.loginRedirect({
        scopes: ['user.read']
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    try {
      await msalInstance.logout();
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
  };
}
