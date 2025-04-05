import Link from "next/link";
import { Button } from "../ui/button";
import { getCurrentUser } from "@/app/(auth)/actions";
import { signOut } from "@/app/(auth)/actions";
import MobileMenu from "./MobileMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { api } from "@/trpc/server";

const publicRoutes: { title: string; href: string }[] = [
  { title: "Home", href: "/" },
  { title: "News", href: "/news" },
  { title: "Events", href: "/events" },
];

const privateRoutes: { title: string; href: string }[] = [
  ...publicRoutes,
  { title: "Alumni Directory", href: "/directory" },
  { title: "My Profile", href: "/profile" },
];

const adminRoutes: { title: string; href: string }[] = [
  ...privateRoutes,
  { title: "Admin Dashboard", href: "/admin/dashboard" },
];

export default async function Navbar() {
  const user = await getCurrentUser();
  const membership = user ? await api.member.getMyMembership() : null;

  // Choose routes based on user status
  const routes = user
    ? user.isAdmin
      ? adminRoutes
      : privateRoutes
    : publicRoutes;

  return (
    <div className="sticky top-0 z-50 flex h-20 items-center justify-between bg-primary px-6 lg:px-14">
      {/* Logo */}
      <Link href={"/"} className="flex shrink-0 items-center gap-2">
        <Image
          src="/Logo.png"
          alt="MCAA Logo"
          width={40}
          height={40}
          className="h-10 w-10"
        />
        <h1 className="text-2xl font-bold text-primary-foreground">MCAA</h1>
      </Link>

      {/* Right side navigation and user menu */}
      <div className="flex items-center gap-6">
        {/* Navigation Menu */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {routes.map((route, index) => (
              <NavigationMenuItem key={index}>
                <Link href={route.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle({
                        padding: "default",
                      }),
                      "text-white hover:bg-white/10 hover:text-white",
                    )}
                  >
                    {route.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* User menu or auth buttons */}
        <div className="hidden items-center md:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full text-white hover:bg-white/10"
                >
                  {user.image ? (
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.image}
                        alt={user.name ?? user.email}
                      />
                      <AvatarFallback>
                        {user.name?.[0] ?? user.email[0]!.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <UserCircle className="h-6 w-6 text-white" />
                  )}
                  {!user.isVerified && (
                    <span className="absolute -right-1 -top-1 h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-500"></span>
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span>{user.name ?? user.email}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
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
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/membership">Membership Details</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action={signOut} className="w-full">
                    <button className="w-full text-left">Log Out</button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button
                size="sm"
                className="border border-white/20 bg-[#383590] text-white hover:bg-white/10"
              >
                Log In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button and menu */}
        <MobileMenu user={user} routes={routes} />
      </div>
    </div>
  );
}
