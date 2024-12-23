import { type MemberWithUser } from "@/lib/types";
import { MemberCard } from "./MemberCard";

interface MemberGroupProps {
  groupName: string;
  members: MemberWithUser[];
  showGroupName?: boolean;
}

export function MemberGroup({
  groupName,
  members,
  showGroupName = true,
}: MemberGroupProps) {
  return (
    <div className="space-y-6">
      {showGroupName && (
        <h2 className="text-2xl font-semibold text-gray-900">
          {groupName}
          <span className="ml-2 text-base font-normal text-gray-500">
            ({members.length} {members.length === 1 ? "member" : "members"})
          </span>
        </h2>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
