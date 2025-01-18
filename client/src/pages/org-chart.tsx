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
  
  // Generate a random pastel color based on job role
  const getColorClass = (role: string) => {
    const colors = {
      'CEO': 'bg-blue-100 border-blue-300',
      'Manager': 'bg-green-100 border-green-300',
      'Developer': 'bg-yellow-100 border-yellow-300',
      'Designer': 'bg-pink-100 border-pink-300',
      'default': 'bg-gray-100 border-gray-300'
    };
    return colors[role] || colors.default;
  };

  return (
    <TreeNode
      label={
        <div className={`rounded-xl shadow-lg border-2 w-56 overflow-hidden ${getColorClass(employee.jobRole)}`}>
          <div className="p-4">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-current">
                {employee.name.charAt(0)}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-800">{employee.name}</div>
              <div className="text-sm text-gray-600 mt-1">{employee.jobRole}</div>
            </div>
          </div>
        </div>
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
    <div className="space-y-4 overflow-x-auto bg-gray-50 rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800">Organization Chart</h2>
      <div className="min-w-[800px] p-8">
        <Tree
          lineWidth="2px"
          lineColor="#94a3b8"
          lineBorderRadius="12px"
          label={
            <div className="rounded-xl shadow-lg border-2 w-56 overflow-hidden bg-blue-100 border-blue-300">
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-blue-400">
                    {ceo.name.charAt(0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800">{ceo.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{ceo.jobRole}</div>
                </div>
              </div>
            </div>
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
