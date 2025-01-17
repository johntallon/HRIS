import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import EmployeeForm from "@/components/employee-form";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompensationForm from "@/components/compensation-form";
import type { Employee } from "@db/schema";

export default function EmployeeFormPage() {
  const [, params] = useRoute("/employees/:id");
  const [, setLocation] = useLocation();
  const isNewEmployee = params?.id === "new";

  const { data: employee, isLoading } = useQuery<Employee>({
    queryKey: [`/api/employees/${params?.id}`],
    enabled: !isNewEmployee && !!params?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        {params?.id ? "Edit Employee" : "Add Employee"}
      </h2>
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {params?.id && <TabsTrigger value="compensation">Compensation</TabsTrigger>}
        </TabsList>
        <TabsContent value="details">
          <EmployeeForm employee={employee} />
        </TabsContent>
        {params?.id && (
          <TabsContent value="compensation">
            <CompensationForm employee={employee} onSuccess={() => {}} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}