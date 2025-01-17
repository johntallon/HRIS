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
  jobRole: z.string().min(1, "Job role is required"),
  department: z.string().min(1, "Department is required"),
  siteId: z.number().min(1, "Site is required"),
  isUser: z.boolean().default(true),
  managerId: z.number().nullable(),
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
      jobRole: "",
      department: "",
      siteId: 1,
      isUser: true,
      managerId: null,
    },
  });

  const onSubmit = (data: z.infer<typeof employeeSchema>) => {
    createEmployee(data);
    onSuccess();
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
          name="jobRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CEO">CEO</SelectItem>
                  <SelectItem value="CFO">CFO</SelectItem>
                  <SelectItem value="HR Director">HR Director</SelectItem>
                  <SelectItem value="Site Lead">Site Lead</SelectItem>
                  <SelectItem value="Finance Lead">Finance Lead</SelectItem>
                  <SelectItem value="Line Manager">Line Manager</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
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
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
              >
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
