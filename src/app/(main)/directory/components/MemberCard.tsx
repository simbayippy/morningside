import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase } from "lucide-react";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { type MemberWithUser } from "@/lib/types";

interface MemberCardProps {
  member: MemberWithUser;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link href={`/directory/${member.id}`}>
      <Card className="h-[240px] transition-all hover:scale-[1.02] hover:shadow-md">
        <CardHeader className="pb-2 pt-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={member.user!.image ?? undefined} />
              <AvatarFallback className="text-lg">
                {getInitials(member.englishName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1.5">
              <CardTitle className="flex items-baseline gap-2 text-lg">
                <span className="line-clamp-1">{member.englishName}</span>
                {member.chineseName && (
                  <span className="text-sm text-gray-500">
                    {member.chineseName}
                  </span>
                )}
              </CardTitle>
              <div className="space-y-0.5">
                <p className="text-sm text-gray-600">{member.faculty}</p>
                <p className="text-sm text-gray-600">Class of {member.class}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 px-6 pb-6">
          <p className="line-clamp-1 font-medium text-gray-900">
            {member.major}
          </p>
          {(member.employer ?? member.industry) && (
            <div className="space-y-3">
              {member.employer && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="h-4 w-4 shrink-0" />
                  <span className="line-clamp-1">
                    {member.position && (
                      <span className="font-medium text-gray-700">
                        {member.position}
                      </span>
                    )}
                    {member.position && member.employer && (
                      <span className="mx-1">at</span>
                    )}
                    {member.employer}
                  </span>
                </div>
              )}
              {member.industry && (
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                    {member.industry}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
