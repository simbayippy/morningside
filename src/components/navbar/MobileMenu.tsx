"use client";

import { useState } from "react";
import Link from "next/link";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { Button } from "../ui/button";
import { signOut } from "@/app/(auth)/actions";
import { api } from "@/trpc/react";

interface PrismaUser {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isVerified: boolean;
  image: string | null;
}

interface MobileMenuProps {
  user: PrismaUser | null;
  routes: { title: string; href: string }[];
}

export default function MobileMenu({ user, routes }: MobileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: membership } = api.member.getMyMembership.useQuery(undefined, {
    enabled: !!user,
  });

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="sm:hidden">
      <button onClick={toggleMenu} className="p-2">
        {menuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {menuOpen && (
        <div className="absolute left-0 top-16 z-50 w-full border-b bg-background px-6 py-4">
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.href}
              onClick={toggleMenu}
              className="block py-2 text-sm text-muted-foreground hover:text-accent-foreground"
            >
              {route.title}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            {user ? (
              <>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    {user.name ?? user.email}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {user.isSuperAdmin ? (
                      <span className="w-fit rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                        Super Admin
                      </span>
                    ) : user.isAdmin ? (
                      <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        Admin
                      </span>
                    ) : null}
                    {membership?.isVerified ? (
                      <span className="w-fit rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600">
                        {membership.membershipType === "STUDENT"
                          ? "Student Member"
                          : membership.membershipType === "ORDINARY_II"
                            ? "Ordinary Member II"
                            : membership.membershipType === "ORDINARY_I"
                              ? "Ordinary Member I"
                              : "Honorary Member"}
                      </span>
                    ) : membership?.status === "PENDING" ? (
                      <span className="w-fit rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-500">
                        Pending Member
                      </span>
                    ) : membership?.status === "REJECTED" ? (
                      <span className="w-fit rounded-full bg-red-500/10 px-2 py-0.5 text-xs text-red-600">
                        Rejected Member
                      </span>
                    ) : null}
                    {!user.isVerified && (
                      <span className="w-fit rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-500">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>
                <form action={signOut}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Log Out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" onClick={toggleMenu}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" onClick={toggleMenu}>
                  <Button variant="default" size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
