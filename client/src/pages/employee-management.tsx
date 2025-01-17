import { useState } from "react";
import { useEmployees } from "@/hooks/use-employees";
import EmployeeForm from "@/components/employee-form";
import CompensationForm from "@/components/compensation-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Download } from "lucide-react";
import type { Employee } from "@db/schema";

export default function EmployeeManagement() {
  const { employees, isLoading } = useEmployees();
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showCompensationForm, setShowCompensationForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleCompensationClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowCompensationForm(true);
  };

  const exportToCSV = () => {
    if (!employees) return;

    const headers = ["Name", "Employee ID", "Job Role", "Department", "Site", "Manager"];
    const csvContent = [
      headers.join(","),
      ...employees.map(emp => [
        emp.name,
        emp.employeeId,
        emp.jobRole,
        emp.department,
        emp.siteId,
        emp.managerId
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "employees.csv";
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Management</h2>
        <div className="space-x-2">
          <Button onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setShowEmployeeForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Job Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Site</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.employeeId}</TableCell>
                <TableCell>{employee.jobRole}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.siteId}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCompensationClick(employee)}
                  >
                    Compensation
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showEmployeeForm} onOpenChange={setShowEmployeeForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
          </DialogHeader>
          <EmployeeForm onSuccess={() => setShowEmployeeForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showCompensationForm} onOpenChange={setShowCompensationForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Compensation</DialogTitle>
          </DialogHeader>
          <CompensationForm
            employee={selectedEmployee!}
            onSuccess={() => setShowCompensationForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
