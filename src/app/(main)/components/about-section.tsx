import Image from "next/image";

export function AboutSection() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Image */}
          <div className="relative h-[500px] overflow-hidden rounded-xl">
            <Image
              src="/photos/DSC04873.jpg"
              alt="Morningside University Campus"
              fill
              className="object-cover"
            />
          </div>
          {/* Text Content */}
          <div className="flex flex-col justify-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              About Our Alumni Association
            </h2>
            <p className="font-body mt-6 text-lg leading-8 text-gray-600">
              Founded in 1894, Morningside University has been a cornerstone of
              academic excellence and community engagement. Our Alumni
              Association continues this legacy by fostering meaningful
              connections among graduates who have made their mark across the
              globe.
            </p>
            <div className="mt-8 space-y-4 text-gray-600">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-gray-900">
                    Our Mission
                  </h3>
                  <p className="font-body">
                    To cultivate lifelong relationships between alumni and the
                    university, fostering a spirit of loyalty, involvement, and
                    support.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <svg
                    className="h-6 w-6 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-gray-900">
                    Our Impact
                  </h3>
                  <p className="font-body">
                    With over 20,000 alumni worldwide, our network continues to
                    grow and make positive changes in their communities and
                    professions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
