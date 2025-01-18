import { useEmployees } from "@/hooks/use-employees";
import { Loader2 } from "lucide-react";
import { DiagramComponent } from '@syncfusion/ej2-react-diagrams';

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
      Id: employee.id.toString(),
      Name: employee.name,
      Role: `${employee.department} - ${employee.jobRoleName}`,
      child: directReports.map(processEmployeeData)
    };
  };

  const dataSource = processEmployeeData(ceo);

  return (
    <div className="space-y-6 overflow-x-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 shadow-inner">
      <h2 className="text-3xl font-bold text-gray-800 text-center">
        Organization Chart
      </h2>
      <div className="h-[600px] w-full">
        <DiagramComponent 
          id="orgChart"
          dataSource={[dataSource]}
          getNodeDefaults={(obj) => {
            obj.shape = { type: 'Basic', shape: 'Rectangle' };
            obj.style = { fill: 'white' };
            obj.borderColor = '#94a3b8';
            obj.width = 250;
            obj.height = 80;
            return obj;
          }}
          getConnectorDefaults={(connector) => {
            connector.type = 'Orthogonal';
            connector.style.strokeColor = '#94a3b8';
            connector.targetDecorator.style.fill = '#94a3b8';
            return connector;
          }}
          nodeTemplate={(props) => {
            return (
              <div className="flex items-center p-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  {props.Name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{props.Name}</div>
                  <div className="text-sm text-gray-500">{props.Role}</div>
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}