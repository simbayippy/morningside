import { type Member } from "@prisma/client";

export interface MemberWithUser extends Member {
  user: {
    email: string;
    name: string | null;
  } | null;
}