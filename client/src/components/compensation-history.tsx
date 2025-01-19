
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CompensationForm from "./compensation-form";
import type { Employee, Compensation } from "@db/schema";

type Props = {
  employeeId: number;
};

export default function CompensationHistory({ employeeId }: Props) {
  const [editingCompensation, setEditingCompensation] = useState<Compensation | null>(null);

  const { data: compensations } = useQuery<Compensation[]>({
    queryKey: [`/api/compensation/${employeeId}`],
    queryFn: async () => {
      const res = await fetch(`/api/compensation/${employeeId}`);
      if (!res.ok) throw new Error('Failed to fetch compensations');
      return res.json();
    },
  });

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {compensations?.map((comp) => (
            <TableRow key={comp.id}>
              <TableCell>{comp.title}</TableCell>
              <TableCell>{new Intl.DateTimeFormat(navigator.language).format(new Date(comp.startDate))}</TableCell>
              <TableCell>${comp.amount.toLocaleString()}</TableCell>
              <TableCell>{comp.notes}</TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  onClick={() => setEditingCompensation(comp)}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!editingCompensation} onOpenChange={() => setEditingCompensation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Compensation</DialogTitle>
          </DialogHeader>
          {editingCompensation && (
            <CompensationForm
              employee={{ id: employeeId } as Employee}
              existingCompensation={editingCompensation}
              onSuccess={() => setEditingCompensation(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
