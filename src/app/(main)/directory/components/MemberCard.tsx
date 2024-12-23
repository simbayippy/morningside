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
      <Card className="h-[220px] cursor-pointer transition-colors hover:bg-gray-50">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-16 w-16">
            <AvatarImage src={member.user?.image ?? undefined} />
            <AvatarFallback>{getInitials(member.englishName)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <CardTitle className="text-base">
              {member.englishName}
              {member.chineseName && (
                <span className="ml-2 text-gray-500">{member.chineseName}</span>
              )}
            </CardTitle>
            <div className="text-sm text-gray-500">
              {member.user?.email ?? "No email"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <div className="text-sm text-gray-500">
              {member.faculty} · Class of {member.class}
            </div>
          </div>
          {member.industry && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Briefcase className="h-4 w-4" />
              {member.industry}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
