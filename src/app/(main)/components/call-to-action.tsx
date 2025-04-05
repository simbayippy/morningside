import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallToAction() {
  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <h2 className="text-4xl font-bold text-primary">
            Join Our Alumni Community
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-primary">
            Stay connected, get involved, and make a difference in the
            Morningside community
          </p>
          <Link href="/membership">
            <Button
              size="lg"
              className="mt-8 rounded-full bg-primary px-8 py-6 text-lg font-semibold text-secondary hover:bg-primary/90"
            >
              Become a Member
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
