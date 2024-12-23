import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, GraduationCap } from "lucide-react";

interface DirectoryHeaderProps {
  totalMembers: number;
  totalIndustries: number;
  totalFaculties: number;
}

export function DirectoryHeader({
  totalMembers,
  totalIndustries,
  totalFaculties,
}: DirectoryHeaderProps) {
  return (
    <>
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Alumni Directory</h1>
        <p className="mt-2 text-gray-600">
          Browse and connect with fellow alumni
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="rounded-full bg-purple-100 p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Alumni</p>
              <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
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
    </>
  );
}
