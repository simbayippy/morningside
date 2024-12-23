"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { type MemberWithUser } from "@/lib/types";
import { DirectoryHeader } from "./components/DirectoryHeader";
import { DirectoryFilters } from "./components/DirectoryFilters";
import { MemberGroup } from "./components/MemberGroup";

type GroupingCriteria = "none" | "class" | "industry" | "faculty";
type GroupedMembers = Record<string, MemberWithUser[]>;

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [facultyFilter, setFacultyFilter] = useState<string | undefined>();
  const [classFilter, setClassFilter] = useState<string | undefined>();
  const [industryFilter, setIndustryFilter] = useState<string | undefined>();
  const [groupBy, setGroupBy] = useState<GroupingCriteria>("class");

  // Get all verified members
  const { data: members = [], isLoading: membersLoading } =
    api.member.getAllMembers.useQuery();

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

  // Filter members based on search query and filters
  const filteredMembers = members.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      member.englishName.toLowerCase().includes(searchLower) ||
      (member.chineseName?.toLowerCase().includes(searchLower) ?? false) ||
      member.faculty.toLowerCase().includes(searchLower) ||
      member.major.toLowerCase().includes(searchLower) ||
      (member.employer?.toLowerCase().includes(searchLower) ?? false) ||
      (member.industry?.toLowerCase().includes(searchLower) ?? false);

    const matchesFaculty =
      !facultyFilter ||
      facultyFilter === "all" ||
      member.faculty === facultyFilter;

    const matchesClass =
      !classFilter ||
      classFilter === "all" ||
      member.class.toString() === classFilter;

    const matchesIndustry =
      !industryFilter ||
      industryFilter === "all" ||
      member.industry === industryFilter;

    return matchesSearch && matchesFaculty && matchesClass && matchesIndustry;
  });

  // Get unique values for filters
  const faculties = Array.from(
    new Set(members.map((member) => member.faculty)),
  ).sort();
  const classYears = Array.from(
    new Set(members.map((member) => member.class.toString())),
  ).sort();
  const industries = Array.from(
    new Set(
      members
        .map((member) => member.industry)
        .filter((industry): industry is string => industry !== null),
    ),
  ).sort();

  // Calculate statistics
  const totalMembers = members.length;
  const totalIndustries = industries.length;
  const totalFaculties = faculties.length;

  // Group members by selected criteria
  const groupedMembers =
    groupBy === "none"
      ? { "All Alumni": filteredMembers }
      : filteredMembers.reduce<GroupedMembers>((groups, member) => {
          let key: string;
          switch (groupBy) {
            case "class":
              key = `Class of ${member.class}`;
              break;
            case "industry":
              key = member.industry ?? "Unspecified Industry";
              break;
            case "faculty":
              key = member.faculty;
              break;
            default:
              key = "Other";
          }
          groups[key] = groups[key] ?? [];
          groups[key]?.push(member);
          return groups;
        }, {});

  // Sort groups by key
  const sortedGroups = Object.entries(groupedMembers).sort(([a], [b]) => {
    if (groupBy === "class") {
      // Extract year numbers and sort in descending order
      const yearA = parseInt(a.split(" ")[2] ?? "0", 10);
      const yearB = parseInt(b.split(" ")[2] ?? "0", 10);
      return yearB - yearA;
    }
    return a.localeCompare(b);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1200px] px-8 py-16">
        <DirectoryHeader
          totalMembers={totalMembers}
          totalIndustries={totalIndustries}
          totalFaculties={totalFaculties}
        />

        <DirectoryFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          facultyFilter={facultyFilter}
          onFacultyChange={setFacultyFilter}
          classFilter={classFilter}
          onClassChange={setClassFilter}
          industryFilter={industryFilter}
          onIndustryChange={setIndustryFilter}
          groupBy={groupBy}
          onGroupByChange={(value) => {
            if (
              value === "none" ||
              value === "class" ||
              value === "industry" ||
              value === "faculty"
            ) {
              setGroupBy(value as GroupingCriteria);
            }
          }}
          faculties={faculties}
          classYears={classYears}
          industries={industries}
        />

        <div className="mb-6 text-sm text-gray-600">
          Showing {filteredMembers.length} of {totalMembers} alumni
        </div>

        <div className="space-y-12">
          {sortedGroups.map(([groupName, groupMembers]) => (
            <MemberGroup
              key={groupName}
              groupName={groupName}
              members={groupMembers}
              showGroupName={groupBy !== "none"}
            />
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <Card>
            <CardContent className="flex min-h-[200px] items-center justify-center text-gray-500">
              No alumni found matching your search criteria
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
