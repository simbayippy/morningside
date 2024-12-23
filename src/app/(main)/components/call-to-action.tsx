import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Join Our Alumni Community
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg">
          Stay connected, get involved, and make a difference in the Morningside
          community
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="mt-8 bg-white text-primary hover:bg-gray-100"
        >
          Become a Member
        </Button>
      </div>
    </section>
  );
}
