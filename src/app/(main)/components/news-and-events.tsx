import Image from "next/image";
import Link from "next/link";

// Sample data - in a real app, this would come from an API or CMS
const newsItems = [
  {
    date: "DECEMBER 16, 2023",
    title: "Alumni Spotlight: Leadership in Tech",
    description:
      "Meet Sarah Chen '15, who's making waves in Silicon Valley with her innovative startup focused on sustainable technology.",
    image: "/photos/MTP02272.jpg",
  },
  {
    date: "OCTOBER 28, 2023",
    title: "Morningside Honors Distinguished Alumni",
    description:
      "The Alumni Association has announced this year's recipients of the Outstanding Alumni Achievement Awards.",
    image: "/photos/MTP02508.jpg",
  },
  {
    date: "OCTOBER 24, 2023",
    title: "Impact of Liberal Arts in Modern Workplace",
    description:
      "A panel discussion featuring alumni leaders explores how liberal arts education shapes professional success.",
    image: "/photos/DSC04789.jpg",
  },
];

const upcomingEvents = [
  {
    date: {
      month: "DEC",
      day: "23",
    },
    location: "SIOUX CITY, IA | SOCIAL",
    title: "Annual Holiday Gathering @ Alumni Center",
    organizer: "Morningside Alumni Association",
  },
  {
    date: {
      month: "DEC",
      day: "27",
    },
    location: "VIRTUAL | CAREER DEVELOPMENT",
    title: "Alumni Career Network: Mentorship Program Launch",
    organizer: "Career Services Office",
  },
  {
    date: {
      month: "JAN",
      day: "15",
    },
    location: "SIOUX CITY, IA | VOLUNTEER",
    title: "Community Service Day: Local Schools Initiative",
    organizer: "Alumni Volunteer Committee",
  },
  {
    date: {
      month: "JAN",
      day: "20",
    },
    location: "VIRTUAL | NETWORKING",
    title: "Young Alumni Virtual Networking Night",
    organizer: "Young Alumni Council",
  },
];

export function NewsAndEvents() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {/* News Column */}
          <div>
            <h2 className="mb-8 font-mono text-2xl font-bold">Alumni News</h2>
            <div className="space-y-8">
              {newsItems.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="relative h-28 w-40 flex-shrink-0 overflow-hidden rounded">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">{item.date}</p>
                    <h3 className="mt-1 font-mono text-lg font-bold">
                      <Link href="#" className="hover:text-primary">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/news"
                className="text-sm font-semibold text-primary hover:text-primary/80"
              >
                View All News →
              </Link>
            </div>
          </div>

          {/* Events Column */}
          <div>
            <h2 className="mb-8 font-mono text-2xl font-bold">
              Programs & Events
            </h2>
            <div className="space-y-6">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 text-center">
                    <div className="text-sm font-semibold text-purple-600">
                      {event.date.month}
                    </div>
                    <div className="text-xl font-bold">{event.date.day}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">{event.location}</p>
                    <h3 className="mt-0.5 font-mono text-base font-bold">
                      <Link href="#" className="hover:text-primary">
                        {event.title}
                      </Link>
                    </h3>
                    <p className="mt-0.5 text-sm text-gray-600">
                      {event.organizer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/events"
                className="text-sm font-semibold text-purple-600 hover:text-purple-500"
              >
                View All Upcoming Events →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
