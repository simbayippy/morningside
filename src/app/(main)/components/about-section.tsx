export function AboutSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* First Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div>
            <h2 className="text-4xl font-bold text-primary">
              About Our
              <br />
              Alumni Association
            </h2>
          </div>

          {/* Right Column */}
          <div>
            <p className="mb-8 text-lg text-primary">
              Founded in 2016, Morningside College Alumni Association (MCAA) has been a cornerstone
              of Morningside College (MC), The Chinese University of Hong Kong (CUHK). Our members
              encompass over 40 different countries globally and spread across different backgrounds
              and industries.
            </p>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center gap-4">
                  <div className="h-0.5 w-12 bg-primary"></div>
                  <h3 className="text-2xl font-bold text-primary">
                    MCAA Mission
                  </h3>
                </div>
                <p className="text-lg text-primary">
                  To foster meaningful connections among graduates and cultivate a culture of philanthropy
                  among our community, providing a heart of servitude for future generations of
                  Morningsiders!
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-4">
                  <div className="h-0.5 w-12 bg-primary"></div>
                  <h3 className="text-2xl font-bold text-primary">
                    MCAA Impact
                  </h3>
                </div>
                <p className="text-lg text-primary">
                  With over 2 decades worth of alumni worldwide, our network continues to grow yearly to
                  make positive impacts on our college & the world!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Second Section - with spacing */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div>
            <h2 className="text-4xl font-bold text-primary">
              Stay Connected with
              <br />
              Your Alma Mater
            </h2>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center gap-4">
                <div className="h-0.5 w-12 bg-primary"></div>
                <h3 className="text-2xl font-bold text-primary">
                  Global Network
                </h3>
              </div>
              <p className="text-lg text-primary">
                Participate in networking events, reunions, and professional
                development workshops
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-4">
                <div className="h-0.5 w-12 bg-primary"></div>
                <h3 className="text-2xl font-bold text-primary">
                  Exclusive Events
                </h3>
              </div>
              <p className="text-lg text-primary">
                Connect with accomplished alumni across different continents and
                industries
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-4">
                <div className="h-0.5 w-12 bg-primary"></div>
                <h3 className="text-2xl font-bold text-primary">
                  Alumni Resources
                </h3>
              </div>
              <p className="text-lg text-primary">
                Access exclusive resources, career services, and mentorship
                opportunities
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
