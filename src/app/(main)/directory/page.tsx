"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Loader2, Search, Briefcase, GraduationCap, Users } from "lucide-react";
import Link from "next/link";
import { type Member } from "@prisma/client";

interface MemberWithUser extends Member {
  user: {
    email: string;
    image: string | null;
  };
}

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
  const filteredMembers = members.filter((member: MemberWithUser) => {
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
    new Set(members.map((member: MemberWithUser) => member.faculty)),
  ).sort();
  const classYears = Array.from(
    new Set(members.map((member: MemberWithUser) => member.class.toString())),
  ).sort();
  const industries = Array.from(
    new Set(
      members
        .map((member: MemberWithUser) => member.industry)
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
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Alumni Directory</h1>
          <p className="mt-2 text-gray-600">
            Browse and connect with fellow alumni
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-purple-100 p-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Alumni</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalMembers}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-purple-100 p-3">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Industries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalIndustries}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-purple-100 p-3">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Faculties</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalFaculties}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative min-w-[300px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search alumni by name, industry, or employer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={facultyFilter ?? "all"}
                onValueChange={setFacultyFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by faculty" />
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
              <Select
                value={classFilter ?? "all"}
                onValueChange={setClassFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by class" />
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
              <Select
                value={industryFilter ?? "all"}
                onValueChange={setIndustryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by industry" />
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
              <Select
                value={groupBy}
                onValueChange={(value) => {
                  if (
                    value === "none" ||
                    value === "class" ||
                    value === "industry" ||
                    value === "faculty"
                  ) {
                    setGroupBy(value);
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

        {/* Results Summary */}
        <div className="mb-6 text-sm text-gray-600">
          Showing {filteredMembers.length} of {totalMembers} alumni
        </div>

        {/* Alumni Sections */}
        <div className="space-y-12">
          {sortedGroups.map(([groupName, groupMembers]) => (
            <div key={groupName} className="space-y-6">
              {groupBy !== "none" && (
                <h2 className="text-2xl font-semibold text-gray-900">
                  {groupName}
                  <span className="ml-2 text-base font-normal text-gray-500">
                    ({groupMembers.length}{" "}
                    {groupMembers.length === 1 ? "member" : "members"})
                  </span>
                </h2>
              )}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {groupMembers.map((member: MemberWithUser) => (
                  <Link key={member.id} href={`/directory/${member.id}`}>
                    <Card className="h-[280px] transition-all hover:scale-[1.02] hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={member.user.image ?? undefined} />
                            <AvatarFallback>
                              {getInitials(member.englishName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {member.salutation} {member.englishName}
                              {member.chineseName && (
                                <span className="ml-2 text-sm text-gray-500">
                                  ({member.chineseName})
                                </span>
                              )}
                            </CardTitle>
                            <div className="mt-1 text-sm text-gray-600">
                              {member.faculty} - Class of {member.class}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <p className="font-medium text-gray-900">
                            {member.major}
                          </p>
                          {(member.employer ?? member.industry) && (
                            <div className="space-y-1">
                              {member.employer && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Briefcase className="h-4 w-4 shrink-0" />
                                  <span className="line-clamp-1">
                                    {member.position &&
                                      `${member.position} at `}
                                    {member.employer}
                                  </span>
                                </div>
                              )}
                              {member.industry && (
                                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                                  {member.industry}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
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
