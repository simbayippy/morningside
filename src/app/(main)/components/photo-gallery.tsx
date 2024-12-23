import Image from "next/image";

export function PhotoGallery() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-tight text-gray-900">
          Campus Life & Alumni Events
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative h-64 overflow-hidden rounded-lg">
            <Image
              src="/photos/MTP02272.jpg"
              alt="Campus Event"
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="relative h-64 overflow-hidden rounded-lg">
            <Image
              src="/photos/MTP02508.jpg"
              alt="Alumni Gathering"
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="relative h-64 overflow-hidden rounded-lg">
            <Image
              src="/photos/DSC04789.jpg"
              alt="Campus Life"
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
