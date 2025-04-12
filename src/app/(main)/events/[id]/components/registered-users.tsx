"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp, Users } from "lucide-react";
import { useState } from "react";

interface RegisteredUsersProps {
  registrations: {
    user: {
      name: string | null;
      email: string;
    };
  }[];
}

export function RegisteredUsers({ registrations }: RegisteredUsersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-8">
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-4 w-full justify-between border-[#383590]/20 text-[#383590] hover:bg-[#383590]/5 hover:text-[#383590]"
      >
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#F5BC4C]" />
          <span>Registered Users ({registrations.length})</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isExpanded && (
        <Card className="border-[#383590]/20 p-4">
          <div className="space-y-3">
            {registrations.map((registration, index) => (
              <div key={registration.user.email}>
                {index > 0 && <Separator className="my-3" />}
                <div className="flex flex-col">
                  <span className="font-medium text-[#383590]">
                    {registration.user.name ?? "Non-member"}
                  </span>
                  {/* <span className="text-sm text-[#383590]/70">
                    {registration.user.email}
                  </span> */}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
