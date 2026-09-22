import Hero from "../components/Hero.jsx";
import SlidingAdverts from "../components/SlidingAdverts.jsx";
import BusinessSectors from "../components/BusinessSectors.jsx";
import StatsBar from "../components/StatsBar.jsx";
import WhyPartner from "../components/WhyPartner.jsx";
import SupportingSections from "../components/SupportingSections.jsx";
import NewsUpdates from "../components/NewsUpdates.jsx";
import ClosingCTA from "../components/ClosingCTA.jsx";
import Reveal from "../components/Reveal.jsx";

export default function Home() {
  return (
    <>
      {/* Hero stays un-revealed — it's the first thing visible on load, so
          fading it in would just delay the page feeling ready. */}
      <Hero />
      <Reveal>
        <SlidingAdverts />
      </Reveal>
      <Reveal>
        <BusinessSectors />
      </Reveal>
      <Reveal>
        <StatsBar />
      </Reveal>
      <Reveal>
        <WhyPartner />
      </Reveal>
      <Reveal>
        <SupportingSections />
      </Reveal>
      <Reveal>
        <NewsUpdates limit={3} />
      </Reveal>
      <Reveal>
        <ClosingCTA />
      </Reveal>
    </>
  );
}
