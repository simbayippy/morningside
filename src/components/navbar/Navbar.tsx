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
  { title: "Create", href: "/admin/create" },
  { title: "Admin Dashboard", href: "/admin/dashboard" },
];

export default async function Navbar() {
  const user = await getCurrentUser();

  // Choose routes based on user status
  const routes = user
    ? user.isAdmin
      ? adminRoutes
      : privateRoutes
    : publicRoutes;

  return (
    <div className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-14">
      {/* Logo */}
      <Link href={"/"} className="flex shrink-0 items-center gap-2">
        <Image
          src="/Logo.png"
          alt="MCAA Logo"
          width={40}
          height={40}
          className="h-10 w-10"
        />
        <h1 className="text-2xl font-bold text-primary">MCAA</h1>
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
                        underlineColor: "background",
                        padding: "default",
                      }),
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
                  className="relative h-9 w-9 rounded-full"
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
                    <UserCircle className="h-6 w-6 text-primary" />
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
                  {user.isAdmin && (
                    <span className="mt-1 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      Admin
                    </span>
                  )}
                  {!user.isVerified && (
                    <span className="mt-1 w-fit rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-500">
                      Unverified
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
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
              <Button size="sm">Log In</Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button and menu */}
        <MobileMenu user={user} routes={routes} />
      </div>
    </div>
  );
}
