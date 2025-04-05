import { getInitials } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { type MemberWithUser } from "@/lib/types";
import { ChevronRight } from "lucide-react";

interface MemberCardProps {
  member: MemberWithUser;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Link href={`/directory/${member.id}`}>
      <div className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-background shadow-sm transition-all hover:shadow-md">
        {/* Profile Image */}
        <div className="relative h-[60%] w-full overflow-hidden bg-[#FDF1F1]">
          {member.user?.image ? (
            <Image
              src={member.user.image}
              alt={member.englishName}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-primary">
              {getInitials(member.englishName)}
            </div>
          )}

          {/* Arrow Icon */}
          <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#FDF1F1] text-[#383590] transition-transform group-hover:translate-x-1">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>

        {/* Member Info */}
        <div className="flex h-[40%] flex-col justify-between p-4">
          <div className="space-y-1">
            <h3 className="line-clamp-1 text-lg font-semibold text-[#383590]">
              {member.englishName}
              {member.chineseName && (
                <span className="ml-2 text-sm text-[#383590]/70">
                  {member.chineseName}
                </span>
              )}
            </h3>
            {member.position && (
              <p className="line-clamp-1 text-sm text-[#383590]">
                {member.position}
              </p>
            )}
            {member.employer && (
              <p className="line-clamp-1 text-sm text-[#383590]">
                {member.employer}
              </p>
            )}
          </div>
          <p className="text-sm text-[#383590]/70">
            {member.major}, {member.class}
          </p>
        </div>
      </div>
    </Link>
  );
}
