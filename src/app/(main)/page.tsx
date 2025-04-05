// app/(main)/page.tsx
import { HeroSection } from "./components/hero-section";
import { AboutSection } from "./components/about-section";
import { NewsSection } from "./components/news-section";
import { EventsSection } from "./components/events-section";
import { CallToAction } from "./components/call-to-action";
import { Footer } from "./components/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <NewsSection />
      <EventsSection />
      <AboutSection />
      <CallToAction />
      <Footer />
    </div>
  );
}
