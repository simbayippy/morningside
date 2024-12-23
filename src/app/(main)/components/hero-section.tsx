import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative h-[80vh] w-full">
      <Image
        src="/photos/DSC04873.jpg"
        alt="University Campus"
        fill
        className="object-cover brightness-50"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Morningside College
          <br />
          Alumni Association
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-100">
          Building lifelong connections and fostering a vibrant community of
          distinguished alumni
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link href="/events">
            <Button variant="secondary" size="lg">
              Join Our Events
            </Button>
          </Link>
          <Link href="/directory">
            <Button size="lg">Alumni Directory</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
