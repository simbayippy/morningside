import { type Member, type User } from "@prisma/client";

export interface MemberWithUser extends Member {
  user: User | null;
}