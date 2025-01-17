
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useEmployees } from "@/hooks/use-employees";
import { useLocation } from "wouter";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Employee } from "@db/schema";

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  jobRoleId: z.coerce.number().min(1, "Job role is required"),
  department: z.string().min(1, "Department is required"),
  siteId: z.coerce.number().min(1, "Site is required"),
  isUser: z.boolean().default(true),
  managerId: z.coerce.number().nullable(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

type Props = {
  employee?: Employee;
};

export default function EmployeeForm({ employee }: Props) {
  const { createEmployee, updateEmployee } = useEmployees();
  const [, setLocation] = useLocation();
  const isEditMode = Boolean(employee);

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee ? {
      name: employee.name,
      employeeId: employee.employeeId,
      jobRoleId: employee.jobRoleId || 0,
      department: employee.department,
      siteId: employee.siteId || 0,
      isUser: employee.isUser,
      managerId: employee.managerId,
    } : {
      name: "",
      employeeId: "",
      jobRoleId: 0,
      department: "",
      siteId: 0,
      isUser: true,
      managerId: null,
    }
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        name: employee.name,
        employeeId: employee.employeeId,
        jobRoleId: employee.jobRoleId || 0,
        department: employee.department,
        siteId: employee.siteId || 0,
        isUser: employee.isUser,
        managerId: employee.managerId,
      });
    }
  }, [employee, form]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      if (isEditMode && employee) {
        await updateEmployee({ id: employee.id, data });
      } else {
        await createEmployee(data);
      }
      setLocation("/employees");
    } catch (error) {
      console.error('Failed to save employee:', error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Employee' : 'Add Employee'}
        </h1>
        <Button variant="outline" onClick={() => setLocation("/employees")}>
          Back to List
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="jobRoleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Role</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a job role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">CEO</SelectItem>
                        <SelectItem value="2">CFO</SelectItem>
                        <SelectItem value="3">HR Director</SelectItem>
                        <SelectItem value="4">Site Lead</SelectItem>
                        <SelectItem value="5">Finance Lead</SelectItem>
                        <SelectItem value="6">Line Manager</SelectItem>
                        <SelectItem value="7">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="siteId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a site" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Poland</SelectItem>
                        <SelectItem value="2">Malaysia</SelectItem>
                        <SelectItem value="3">Florida</SelectItem>
                        <SelectItem value="4">Bristol</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setLocation("/employees")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditMode ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
