import { useEmployees } from "@/hooks/use-employees";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Tree, TreeNode } from "react-organizational-chart";
import type { Employee } from "@db/schema";

type EmployeeNodeProps = {
  employee: Employee;
  employees: Employee[];
};

function EmployeeNode({ employee, employees }: EmployeeNodeProps) {
  const directReports = employees.filter((e) => e.managerId === employee.id);

  return (
    <TreeNode
      label={
        <Card className="w-48 cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="font-medium">{employee.name}</div>
            <div className="text-sm text-muted-foreground">{employee.jobRole}</div>
          </CardContent>
        </Card>
      }
    >
      {directReports.map((report) => (
        <EmployeeNode
          key={report.id}
          employee={report}
          employees={employees}
        />
      ))}
    </TreeNode>
  );
}

export default function OrgChart() {
  const { employees, isLoading } = useEmployees();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!employees?.length) {
    return <div>No employees found</div>;
  }

  // Find the CEO (employee with no manager)
  const ceo = employees.find((e) => !e.managerId);

  if (!ceo) {
    return <div>Organization structure not properly defined</div>;
  }

  return (
    <div className="space-y-4 overflow-x-auto">
      <h2 className="text-2xl font-bold">Organization Chart</h2>
      <div className="min-w-[800px] p-8">
        <Tree
          lineWidth="2px"
          lineColor="#ccc"
          lineBorderRadius="6px"
          label={
            <Card className="w-48">
              <CardContent className="p-4 text-center bg-primary text-primary-foreground">
                <div className="font-medium">{ceo.name}</div>
                <div className="text-sm">{ceo.jobRole}</div>
              </CardContent>
            </Card>
          }
        >
          {employees
            .filter((e) => e.managerId === ceo.id)
            .map((employee) => (
              <EmployeeNode
                key={employee.id}
                employee={employee}
                employees={employees}
              />
            ))}
        </Tree>
      </div>
    </div>
  );
}
