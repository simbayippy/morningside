"use client";

import { useState } from "react";
import Link from "next/link";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { Button } from "../ui/button";
import { signOut } from "@/app/(auth)/actions";

interface PrismaUser {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
  isVerified: boolean;
  image: string | null;
}

interface MobileMenuProps {
  user: PrismaUser | null;
  routes: { title: string; href: string }[];
}

export default function MobileMenu({ user, routes }: MobileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

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
                <span className="text-sm text-muted-foreground">
                  {user.name ?? user.email}
                  {user.isAdmin && (
                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                      Admin
                    </span>
                  )}
                  {!user.isVerified && (
                    <span className="ml-2 rounded-full bg-yellow-500/10 px-2 py-1 text-xs text-yellow-500">
                      Unverified
                    </span>
                  )}
                </span>
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
