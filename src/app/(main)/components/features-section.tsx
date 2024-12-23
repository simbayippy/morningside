export function FeaturesSection() {
  return (
    <section className="bg-white px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-gray-900">
          Stay Connected with Your Alma Mater
        </h2>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-lg bg-primary/10 p-3">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Global Network</h3>
            <p className="mt-2 text-gray-600">
              Connect with accomplished alumni across different continents and
              industries
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-lg bg-primary/10 p-3">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Exclusive Events</h3>
            <p className="mt-2 text-gray-600">
              Participate in networking events, reunions, and professional
              development workshops
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-lg bg-primary/10 p-3">
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
            <h3 className="text-xl font-semibold">Alumni Resources</h3>
            <p className="mt-2 text-gray-600">
              Access exclusive resources, career services, and mentorship
              opportunities
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
