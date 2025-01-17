import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Employee } from "@db/schema";

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");

  const { data: employees } = useQuery<Employee[]>({
    queryKey: ['/api/employees'],
  });

  const filteredEmployees = employees?.filter((employee) =>
    employee.name.toLowerCase().includes(search.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(search.toLowerCase()) ||
    employee.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          <Search className="mr-2 h-4 w-4" />
          {value
            ? employees?.find((employee) => employee.name === value)?.name
            : "Search employees..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search employees..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>No employee found.</CommandEmpty>
          <CommandGroup>
            {filteredEmployees?.map((employee) => (
              <CommandItem
                key={employee.id}
                value={employee.name}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === employee.name ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{employee.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {employee.department} • ID: {employee.employeeId}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}