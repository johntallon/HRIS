import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Employee, Compensation } from "@db/schema";
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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

const compensationSchema = z.object({
  employeeId: z.number(),
  title: z.string().min(1, "Title is required"),
  startDate: z.string().min(1, "Start date is required"),
  amount: z.number().min(0, "Amount must be positive"),
  notes: z.string().optional(),
});

type Props = {
  employee: Employee;
  onSuccess: () => void;
};

export default function CompensationForm({ employee, onSuccess }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: compensationHistory } = useQuery<Compensation[]>({
    queryKey: [`/api/compensation/${employee.id}`],
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof compensationSchema>) => {
      const response = await fetch('/api/compensation', {
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
      queryClient.invalidateQueries({ queryKey: [`/api/compensation/${employee.id}`] });
      toast({
        title: "Success",
        description: "Compensation record added successfully",
      });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: zodResolver(compensationSchema),
    defaultValues: {
      employeeId: employee.id,
      title: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      amount: 0,
      notes: "",
    },
  });

  const onSubmit = (data: z.infer<typeof compensationSchema>) => {
    createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Compensation History</h3>
        <div className="mt-2 space-y-2">
          {compensationHistory?.map((comp) => (
            <div
              key={comp.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{comp.title}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(comp.startDate), "MMM d, yyyy")}
                </div>
              </div>
              <div className="font-medium">
                ${comp.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button type="submit">Add Record</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
