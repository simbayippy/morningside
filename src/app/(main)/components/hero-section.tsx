import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="flex min-h-[80vh] w-full items-center bg-background">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        {/* Left side - Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
          <Image
            src="/photos/DSC04873.jpg"
            alt="University Campus"
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>

        {/* Right side - Content */}
        <div className="flex flex-col justify-center space-y-8 text-center lg:text-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
              Morningside College
              <br />
              Alumni Association
            </h1>
            <p className="mt-6 text-lg leading-8 text-foreground">
              Building lifelong connections and fostering a vibrant community of
              distinguished alumni
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-col gap-4">
            <Link href="/events" className="w-full">
              <Button
                className={cn(
                  "w-full bg-secondary text-secondary-foreground hover:bg-secondary/90",
                  "rounded-full py-7 text-xl font-medium",
                )}
              >
                Join Our Events
              </Button>
            </Link>

            <Link href="/directory" className="w-full">
              <Button
                variant="outline"
                className={cn(
                  "w-full border-2 border-secondary text-foreground hover:bg-secondary hover:text-background",
                  "rounded-full py-7 text-xl font-medium",
                )}
              >
                Alumni Directory
              </Button>
            </Link>

            <Link href="/membership" className="w-full">
              <Button
                className={cn(
                  "w-full bg-primary text-secondary hover:bg-primary/90",
                  "rounded-full py-7 text-xl font-medium",
                )}
              >
                Become a Member
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
