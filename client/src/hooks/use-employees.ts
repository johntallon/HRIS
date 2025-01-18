import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Employee, NewEmployee } from "@db/schema";
import { useToast } from "@/hooks/use-toast";

export function useEmployees(id?: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employeesResponse, isLoading: isLoadingAll } = useQuery({
    queryKey: ['/api/employees'],
    retry: 1,
  });

  const employees = Array.isArray(employeesResponse?.data) 
    ? employeesResponse.data 
    : Object.values(employeesResponse?.data || {});

  const { data: employee, isLoading: isLoadingOne } = useQuery<Employee>({
    queryKey: [`/api/employees/${id}`],
    enabled: !!id,
    retry: 1
  });

  const isLoading = isLoadingAll || isLoadingOne;

  const createMutation = useMutation({
    mutationFn: async (data: NewEmployee) => {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      toast({
        title: "Success",
        description: "Employee created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: NewEmployee }) => {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] });
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });


  return {
    employees,
    employee,
    isLoading,
    createEmployee: createMutation.mutate,
    updateEmployee: updateMutation.mutate,
  };
}