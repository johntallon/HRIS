import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobRole, Site } from "@db/schema";
import { debounce } from "lodash";

type SearchFilters = {
  search?: string;
  department?: string;
  jobRoleId?: number;
  siteId?: number;
};

type Props = {
  onFilterChange: (filters: SearchFilters) => void;
};

export default function AdvancedSearch({ onFilterChange }: Props) {
  const [filters, setFilters] = useState<SearchFilters>({});

  const { data: jobRoles } = useQuery<JobRole[]>({
    queryKey: ['/api/job-roles'],
  });

  const { data: sites } = useQuery<Site[]>({
    queryKey: ['/api/sites'],
  });

  // Debounce the filter change to prevent too many API calls
  const debouncedFilterChange = useCallback(
    debounce((newFilters: SearchFilters) => {
      onFilterChange(newFilters);
    }, 300),
    [onFilterChange]
  );

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    debouncedFilterChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              className="pl-8"
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
        </div>
        <div className="w-[200px]">
          <Select
            value={filters.jobRoleId?.toString()}
            onValueChange={(value) => handleFilterChange("jobRoleId", value ? parseInt(value) : undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              {jobRoles?.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[200px]">
          <Select
            value={filters.siteId?.toString()}
            onValueChange={(value) => handleFilterChange("siteId", value ? parseInt(value) : undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select site" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sites</SelectItem>
              {sites?.map((site) => (
                <SelectItem key={site.id} value={site.id.toString()}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
