import { useEmployees } from "@/hooks/use-employees";
import { Loader2 } from "lucide-react";
import { OrganizationChart } from 'primereact/organizationchart';

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

  const ceo = employees.find((e) => !e.managerId);
  if (!ceo) {
    return <div>Organization structure not properly defined</div>;
  }

  const processEmployeeData = (employee) => {
    const directReports = employees.filter((e) => e.managerId === employee.id);
    return {
      key: employee.id.toString(),
      type: 'person',
      label: employee.name,
      data: { 
        role: `${employee.department} - ${employee.jobRoleName}`,
        avatar: employee.avatar
      },
      children: directReports.map(processEmployeeData),
      style: { borderRadius: '12px' }
    };
  };

  const data = [processEmployeeData(ceo)];

  const nodeTemplate = (node) => {
    return (
      <div className="p-3 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
        <img 
          src={node.data.avatar || '/Images/avatar.png'} 
          alt={node.label}
          className="w-12 h-12 rounded-full mx-auto mb-2 object-cover"
        />
        <div className="text-lg font-semibold text-gray-900">{node.label}</div>
        <div className="text-sm text-gray-500">{node.data.role}</div>
      </div>
    );
  };

  return (
    <div className="space-y-6 overflow-x-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 shadow-inner">
      <h2 className="text-3xl font-bold text-gray-800 text-center">
        Organization Chart
      </h2>
      <div className="h-[600px] w-full overflow-auto">
        <OrganizationChart
          value={data}
          nodeTemplate={nodeTemplate}
          className="p-organizationchart-table"
          selectionMode="single"
        />
      </div>
    </div>
  );
}