import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import EmployeeForm from "@/components/employee-form";
import { Loader2 } from "lucide-react";
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

  return <EmployeeForm employee={employee} />;
}
