import LandingNavbar from "../components/landing/LandingNavbar";
import HeroSection from "../components/landing/HeroSection";
import DeveloperSection from "../components/landing/DeveloperSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import LandingCta from "../components/landing/LandingCta";

function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <LandingNavbar />

      <main>
        <HeroSection />
        <DeveloperSection />
        <FeaturesSection />
        <LandingCta />
      </main>
    </div>
  );
}

export default LandingPage;