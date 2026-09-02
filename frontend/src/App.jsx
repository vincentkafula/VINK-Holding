import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import BusinessSectors from "./components/BusinessSectors.jsx";
import StatsBar from "./components/StatsBar.jsx";
import WhyPartner from "./components/WhyPartner.jsx";
import SupportingSections from "./components/SupportingSections.jsx";
import NewsUpdates from "./components/NewsUpdates.jsx";
import Footer from "./components/Footer.jsx";
import ContactModal from "./components/ContactModal.jsx";
import InfoModal from "./components/InfoModal.jsx";

const SECTION_IDS = ["home", "about", "sectors", "investors", "sustainability", "careers", "news", "contact"];

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-vh-black">
      <Header onOpenContact={() => setContactOpen(true)} activeSection={activeSection} />

      <main>
        <Hero onWatchVideo={() => setVideoOpen(true)} />
        <BusinessSectors onSelect={setSelectedSector} />
        <StatsBar />
        <WhyPartner onLearnMore={() => document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })} />
        <SupportingSections />
        <NewsUpdates
          onReadMore={setSelectedArticle}
          onViewAll={() => document.querySelector("#news")?.scrollIntoView({ behavior: "smooth" })}
        />
      </main>

      <Footer />

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      <InfoModal open={videoOpen} onClose={() => setVideoOpen(false)} title="Vink Holdings Corporate Video">
        <div className="aspect-video rounded-sm bg-vh-black/60 border border-vh-line flex items-center justify-center text-vh-cream/50 text-xs">
          Corporate video coming soon.
        </div>
      </InfoModal>

      <InfoModal open={!!selectedSector} onClose={() => setSelectedSector(null)} title={selectedSector?.name}>
        <p>{selectedSector?.description}</p>
        <p className="mt-4 text-vh-cream/50 text-xs">
          To discuss partnership or investment opportunities in this sector, get in touch with our team.
        </p>
      </InfoModal>

      <InfoModal open={!!selectedArticle} onClose={() => setSelectedArticle(null)} title={selectedArticle?.title}>
        {selectedArticle && (
          <>
            <p className="text-xs text-vh-gold mb-3">
              {selectedArticle.category} •{" "}
              {new Date(selectedArticle.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p>{selectedArticle.excerpt}</p>
          </>
        )}
      </InfoModal>
    </div>
  );
}
