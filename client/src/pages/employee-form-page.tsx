import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import EmployeeForm from "@/components/employee-form";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CompensationForm from "@/components/compensation-form";
import CompensationHistory from "@/components/compensation-history";
import type { Employee } from "@db/schema";

export default function EmployeeFormPage() {
  const [, params] = useRoute("/employees/:id");
  const [, setLocation] = useLocation();
  const isNewEmployee = params?.id === "new";

  const [compensationDialogOpen, setCompensationDialogOpen] = useState(false); // Added state

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
    <div className="space-y-4 container py-4">
      <h2 className="text-2xl font-bold">
        {isNewEmployee ? "Add Employee" : `Edit ${employee?.name}`}
      </h2>

      {!isNewEmployee && employee && (
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="compensation">Compensation</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <EmployeeForm employee={employee} />
          </TabsContent>

          <TabsContent value="compensation">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Compensation Records</h3>
                <Button onClick={() => setCompensationDialogOpen(true)}>
                  Add Compensation
                </Button>
              </div>
              <CompensationHistory employeeId={employee.id} />
              <Dialog open={compensationDialogOpen} onOpenChange={setCompensationDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Compensation</DialogTitle>
                    <DialogDescription>
                      Add a new compensation record for {employee.name}
                    </DialogDescription>
                  </DialogHeader>
                  <CompensationForm 
                    employee={employee} 
                    onSuccess={() => setCompensationDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {isNewEmployee && (
        <EmployeeForm employee={employee} />
      )}
    </div>
  );
}