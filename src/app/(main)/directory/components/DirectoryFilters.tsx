import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface DirectoryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  facultyFilter: string | undefined;
  onFacultyChange: (value: string) => void;
  classFilter: string | undefined;
  onClassChange: (value: string) => void;
  industryFilter: string | undefined;
  onIndustryChange: (value: string) => void;
  groupBy: string;
  onGroupByChange: (value: string) => void;
  faculties: string[];
  classYears: string[];
  industries: string[];
}

export function DirectoryFilters({
  searchQuery,
  onSearchChange,
  facultyFilter,
  onFacultyChange,
  classFilter,
  onClassChange,
  industryFilter,
  onIndustryChange,
  groupBy,
  onGroupByChange,
  faculties,
  classYears,
  industries,
}: DirectoryFiltersProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative min-w-[300px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search alumni by name, industry, or employer..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={facultyFilter ?? "all"}
            onValueChange={onFacultyChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by faculty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Faculties</SelectItem>
              {faculties.map((faculty) => (
                <SelectItem key={faculty} value={faculty || "unspecified"}>
                  {faculty || "Unspecified"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={classFilter ?? "all"} onValueChange={onClassChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classYears.map((year) => (
                <SelectItem key={year} value={year || "unspecified"}>
                  Class of {year || "Unspecified"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={industryFilter ?? "all"}
            onValueChange={onIndustryChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry || "unspecified"}>
                  {industry || "Unspecified"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={groupBy}
            onValueChange={(value) => {
              if (
                value === "none" ||
                value === "class" ||
                value === "industry" ||
                value === "faculty"
              ) {
                onGroupByChange(value);
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Grouping</SelectItem>
              <SelectItem value="class">Group by Class</SelectItem>
              <SelectItem value="industry">Group by Industry</SelectItem>
              <SelectItem value="faculty">Group by Faculty</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
