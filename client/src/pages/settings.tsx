import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { JobRole } from "@db/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Settings as SettingsIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showJobRoleForm, setShowJobRoleForm] = useState(false);
  const [newJobRole, setNewJobRole] = useState({ name: "", description: "" });

  const { data: jobRoles, isLoading } = useQuery<JobRole[]>({
    queryKey: ['/api/job-roles'],
  });

  const createJobRoleMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const response = await fetch('/api/job-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/job-roles'] });
      setShowJobRoleForm(false);
      setNewJobRole({ name: "", description: "" });
      toast({
        title: "Success",
        description: "Job role created successfully",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJobRoleMutation.mutate(newJobRole);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your application settings and configurations.
          </p>
        </div>
      </div>

      <Tabs defaultValue="job-roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="job-roles">Job Roles</TabsTrigger>
          {/* Add more settings tabs here */}
        </TabsList>

        <TabsContent value="job-roles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Job Roles</h3>
            <Button onClick={() => setShowJobRoleForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobRoles?.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={showJobRoleForm} onOpenChange={setShowJobRoleForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Job Role</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name</Label>
              <Input
                id="name"
                value={newJobRole.name}
                onChange={(e) => setNewJobRole(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newJobRole.description}
                onChange={(e) => setNewJobRole(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="submit">Save Role</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
