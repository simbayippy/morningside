// app/(main)/page.tsx
import { HeroSection } from "./components/hero-section";
import { FeaturesSection } from "./components/features-section";
import { NewsAndEvents } from "./components/news-and-events";
import { CallToAction } from "./components/call-to-action";
import { Footer } from "./components/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturesSection />
      <NewsAndEvents />
      <CallToAction />
      <Footer />
    </div>
  );
}
