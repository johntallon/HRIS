import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEmployees } from "@/hooks/use-employees";
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

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
  jobRoleId: z.coerce.number().min(1, "Job role is required"),
  department: z.string().min(1, "Department is required"),
  siteId: z.coerce.number().min(1, "Site is required"),
  isUser: z.boolean().default(true),
  managerId: z.coerce.number().nullable(),
});

type Props = {
  onSuccess: () => void;
};

export default function EmployeeForm({ onSuccess }: Props) {
  const { createEmployee } = useEmployees();

  const form = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: "",
      employeeId: "",
      jobRoleId: 0,
      department: "",
      siteId: 0,
      isUser: true,
      managerId: null,
    },
  });

  const onSubmit = async (data: z.infer<typeof employeeSchema>) => {
    try {
      await createEmployee(data);
      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Failed to create employee:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <FormField
          control={form.control}
          name="jobRoleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value?.toString()}>
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
              <Select onValueChange={field.onChange} value={field.value?.toString()}>
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

        <div className="flex justify-end space-x-2">
          <Button type="submit">Save Employee</Button>
        </div>
      </form>
    </Form>
  );
}