import { useState } from "react";
import { useEmployees } from "@/hooks/use-employees";
import EmployeeForm from "@/components/employee-form";
import CompensationForm from "@/components/compensation-form";
import { useLocation, useRoute } from "wouter";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Download } from "lucide-react";
import type { Employee } from "@db/schema";

export default function EmployeeManagement() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const { data: employeesData, isLoading } = useQuery(['employees', page, filter, sort], 
    () => fetch(`/api/employees?page=${page}&filter=${filter}&sort=${sort}`).then(res => res.json())
  );
  const [compensationDialogOpen, setCompensationDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [, setLocation] = useLocation();
  const [isEmployeeRoute] = useRoute("/employees/:id");

  const employees = employeesData?.data || [];
  const totalPages = employeesData?.totalPages || 1;

  const handleCompensationClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setCompensationDialogOpen(true);
  };

  const handleCloseCompensationDialog = () => {
    setCompensationDialogOpen(false);
    setSelectedEmployee(null);
  };

  const exportToCSV = () => {
    if (!employees) return;

    const headers = ["Name", "Employee ID", "Job Role", "Department", "Site", "Manager"];
    const csvContent = [
      headers.join(","),
      ...employees.map(emp => [
        emp.name,
        emp.employeeId,
        emp.jobRoleId,
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

  if (isEmployeeRoute) {
    const id = window.location.pathname.split('/').pop();
  const employee = employees?.find(e => e.id === Number(id));
  return <EmployeeForm employee={employee} />;
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
          <Button onClick={() => setLocation("/employees/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Filter employees..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => setSort(`name:${sort === 'name:asc' ? 'desc' : 'asc'}`)} className="cursor-pointer">
                  Name {sort.startsWith('name:') && (sort === 'name:asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead onClick={() => setSort(`employeeId:${sort === 'employeeId:asc' ? 'desc' : 'asc'}`)} className="cursor-pointer">
                  Employee ID {sort.startsWith('employeeId:') && (sort === 'employeeId:asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Job Role</TableHead>
                <TableHead onClick={() => setSort(`department:${sort === 'department:asc' ? 'desc' : 'asc'}`)} className="cursor-pointer">
                  Department {sort.startsWith('department:') && (sort === 'department:asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {employees?.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.employeeId}</TableCell>
                <TableCell>{employee.jobRoleId}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>{employee.siteId}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation(`/employees/${employee.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompensationClick(employee)}
                    >
                      Compensation
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>

      {selectedEmployee && (
        <Dialog 
          open={compensationDialogOpen} 
          onOpenChange={(open) => {
            if (!open) handleCloseCompensationDialog();
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Compensation</DialogTitle>
              <DialogDescription>
                Manage compensation details for {selectedEmployee.name}
              </DialogDescription>
            </DialogHeader>
            <CompensationForm
              employee={selectedEmployee}
              onSuccess={handleCloseCompensationDialog}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}