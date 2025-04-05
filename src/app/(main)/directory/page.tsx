"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";
import { type MemberWithUser } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MemberCard } from "./components/MemberCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [facultyFilter, setFacultyFilter] = useState<string>("all");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");

  // Get all verified members
  const { data: members = [], isLoading: membersLoading } =
    api.member.getAllMembers.useQuery();

  // Function to clear all filters
  const clearAllFilters = () => {
    setFacultyFilter("all");
    setClassFilter("all");
    setIndustryFilter("all");
  };

  // Loading state
  if (membersLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  // Get unique values for filters, filtering out null/empty values
  const faculties = Array.from(
    new Set(
      members
        .map((member) => member.faculty)
        .filter((faculty): faculty is string => !!faculty),
    ),
  ).sort();

  const classYears = Array.from(
    new Set(
      members
        .map((member) => member.class?.toString())
        .filter((year): year is string => !!year),
    ),
  ).sort();

  const industries = Array.from(
    new Set(
      members
        .map((member) => member.industry)
        .filter((industry): industry is string => !!industry),
    ),
  ).sort();

  // Filter members based on search query and filters
  const filteredMembers = members.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      member.englishName.toLowerCase().includes(searchLower) ||
      (member.chineseName?.toLowerCase().includes(searchLower) ?? false) ||
      (member.faculty?.toLowerCase().includes(searchLower) ?? false) ||
      (member.major?.toLowerCase().includes(searchLower) ?? false) ||
      (member.employer?.toLowerCase().includes(searchLower) ?? false) ||
      (member.position?.toLowerCase().includes(searchLower) ?? false);

    const matchesFaculty =
      facultyFilter === "all" ||
      (member.faculty && member.faculty === facultyFilter);

    const matchesClass =
      classFilter === "all" ||
      (member.class && member.class.toString() === classFilter);

    const matchesIndustry =
      industryFilter === "all" ||
      (member.industry && member.industry === industryFilter);

    return matchesSearch && matchesFaculty && matchesClass && matchesIndustry;
  });

  // Check if any filters are active
  const hasActiveFilters =
    facultyFilter !== "all" ||
    classFilter !== "all" ||
    industryFilter !== "all";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-8 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-primary">Alumni Directory</h1>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex-1">
            <div className="relative max-w-md">
              <Input
                type="text"
                placeholder="Search alumni..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-[#F5BC4C] pl-10 pr-4 focus-visible:ring-[#F5BC4C]"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F5BC4C]" />
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-[#F5BC4C] text-[#383590] hover:bg-[#F5BC4C]/10"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Set Filter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-[#383590]">
                  Filter Alumni
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {faculties.length > 0 && (
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[#383590]">
                      Faculty
                    </label>
                    <Select
                      value={facultyFilter}
                      onValueChange={setFacultyFilter}
                    >
                      <SelectTrigger className="border-[#F5BC4C] focus:ring-[#F5BC4C]">
                        <SelectValue placeholder="All Faculties" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Faculties</SelectItem>
                        {faculties.map((faculty) => (
                          <SelectItem key={faculty} value={faculty}>
                            {faculty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {classYears.length > 0 && (
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[#383590]">
                      Class Year
                    </label>
                    <Select value={classFilter} onValueChange={setClassFilter}>
                      <SelectTrigger className="border-[#F5BC4C] focus:ring-[#F5BC4C]">
                        <SelectValue placeholder="All Classes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        {classYears.map((year) => (
                          <SelectItem key={year} value={year}>
                            Class of {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {industries.length > 0 && (
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-[#383590]">
                      Industry
                    </label>
                    <Select
                      value={industryFilter}
                      onValueChange={setIndustryFilter}
                    >
                      <SelectTrigger className="border-[#F5BC4C] focus:ring-[#F5BC4C]">
                        <SelectValue placeholder="All Industries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Industries</SelectItem>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {facultyFilter !== "all" && (
              <div className="flex items-center gap-1 rounded-full bg-[#F5BC4C]/10 px-3 py-1 text-sm text-[#383590]">
                <span>Faculty: {facultyFilter}</span>
                <button
                  onClick={() => setFacultyFilter("all")}
                  className="ml-1 rounded-full p-0.5 hover:bg-[#F5BC4C]/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {classFilter !== "all" && (
              <div className="flex items-center gap-1 rounded-full bg-[#F5BC4C]/10 px-3 py-1 text-sm text-[#383590]">
                <span>Class of {classFilter}</span>
                <button
                  onClick={() => setClassFilter("all")}
                  className="ml-1 rounded-full p-0.5 hover:bg-[#F5BC4C]/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {industryFilter !== "all" && (
              <div className="flex items-center gap-1 rounded-full bg-[#F5BC4C]/10 px-3 py-1 text-sm text-[#383590]">
                <span>Industry: {industryFilter}</span>
                <button
                  onClick={() => setIndustryFilter("all")}
                  className="ml-1 rounded-full p-0.5 hover:bg-[#F5BC4C]/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-sm text-[#383590] hover:bg-[#F5BC4C]/10"
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 text-sm text-[#383590]/70">
          Showing {filteredMembers.length} of {members.length} alumni
        </div>

        {/* Members Grid */}
        {filteredMembers.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-[#383590]/70 shadow-sm">
            No alumni found matching your search criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMembers.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
