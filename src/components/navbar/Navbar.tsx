"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { signOut } from "@/app/(auth)/actions";

const publicRoutes: { title: string; href: string }[] = [
  { title: "Features", href: "#features" },
  { title: "Resources", href: "#resources" },
  { title: "Pricing", href: "#pricing" },
];

const privateRoutes: { title: string; href: string }[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Profile", href: "/profile" },
  { title: "Settings", href: "/settings" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // Check current auth status
    void supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    }).catch((error) => {
      console.error('Error fetching user:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const routes = user ? privateRoutes : publicRoutes;

  if (loading) {
    return <div className="flex h-16 items-center justify-between px-6 lg:px-14">Loading...</div>;
  }

  return (
    <div className="flex h-16 items-center justify-between px-6 lg:px-14">
      <div className="flex items-center">
        <Link href={"/"} className="shrink-0">
          <h1 className="text-accent-foreground text-2xl font-bold">devlink</h1>
        </Link>
        <div className="bg-background hidden w-full justify-end gap-1 px-4 py-2 sm:flex">
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.href}
              className={`hover:text-accent-foreground text-muted-foreground inline-flex h-10 w-full items-center px-4 py-2 text-sm transition-colors sm:w-auto`}
            >
              {route.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <form action={signOut}>
              <Button variant="secondary" size="sm" className="w-full">
                Log Out
              </Button>
            </form>
          </>
        ) : (
          <>
            <Link href={"/login"} className="w-full sm:w-auto">
              <Button variant="secondary" size="sm" className="w-full">
                Log In
              </Button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="default" size="sm" className="w-full">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center sm:hidden">
        <button onClick={toggleMenu} className="p-2">
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {menuOpen && <MobileMenu toggleMenu={toggleMenu} user={user} routes={routes} />}
    </div>
  );
};

interface MobileMenuProps {
  toggleMenu: () => void;
  user: User | null;
  routes: { title: string; href: string }[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ toggleMenu, user, routes }) => {
  return (
    <div className="bg-background absolute left-0 top-16 z-50 w-full px-6 py-4 sm:hidden">
      {routes.map((route, index) => (
        <Link
          key={index}
          href={route.href}
          onClick={toggleMenu}
          className="hover:text-accent-foreground text-muted-foreground block py-2 text-sm"
        >
          {route.title}
        </Link>
      ))}
      <div className="mt-4 flex flex-col gap-2">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground">
              {user.email}
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
  );
};

export default Navbar;