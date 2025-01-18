import { useEmployees } from "@/hooks/use-employees";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Tree, TreeNode } from "react-organizational-chart";
import type { Employee } from "@db/schema";

// Generate professional color schemes based on job role
const getColorClass = (role: string) => {
  const colors = {
    'CEO': 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400 shadow-blue-100',
    'Manager': 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-400 shadow-emerald-100',
    'Developer': 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-400 shadow-amber-100',
    'Designer': 'bg-gradient-to-br from-rose-50 to-rose-100 border-rose-400 shadow-rose-100',
    'default': 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-400 shadow-slate-100'
  };
  return colors[role] || colors.default;
};

type EmployeeNodeProps = {
  employee: Employee;
  employees: Employee[];
};

function EmployeeNode({ employee, employees }: EmployeeNodeProps) {
  const directReports = employees.filter((e) => e.managerId === employee.id);

  return (
    <TreeNode
      label={
        <div className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 w-64 overflow-hidden ${getColorClass(employee.jobRole)}`}>
          <div className="p-5">
            <div className="flex items-center justify-center mb-3">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center border-2 border-current shadow-inner text-xl font-semibold">
                {employee.name.charAt(0)}
              </div>
            </div>
            <div className="text-center space-y-1">
              <div className="font-bold text-gray-900">{employee.name}</div>
              <div className="text-sm font-semibold text-gray-700">{employee.jobTitle}</div>
              <div className="text-xs font-medium text-gray-600 bg-white/50 rounded-full py-1 px-3 inline-block">{employee.jobRole}</div>
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
    <div className="space-y-6 overflow-x-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 shadow-inner">
      <h2 className="text-3xl font-bold text-gray-800 text-center">Organization Chart</h2>
      <div className="min-w-[800px] p-12">
        <Tree
          lineWidth="2px"
          lineColor="#94a3b8"
          lineBorderRadius="12px"
          label={
            <div className={`rounded-xl shadow-lg border-2 w-56 overflow-hidden ${getColorClass(ceo.jobRole)}`}>
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-current">
                    {ceo.name.charAt(0)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-800">{ceo.name}</div>
                  <div className="text-sm font-medium text-gray-700">{ceo.jobTitle}</div>
                  <div className="text-xs text-gray-500 mt-1">{ceo.jobRole}</div>
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
