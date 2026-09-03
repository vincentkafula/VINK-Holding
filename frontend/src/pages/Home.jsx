import Hero from "../components/Hero.jsx";
import SlidingAdverts from "../components/SlidingAdverts.jsx";
import BusinessSectors from "../components/BusinessSectors.jsx";
import StatsBar from "../components/StatsBar.jsx";
import WhyPartner from "../components/WhyPartner.jsx";
import SupportingSections from "../components/SupportingSections.jsx";
import NewsUpdates from "../components/NewsUpdates.jsx";
import ClosingCTA from "../components/ClosingCTA.jsx";

export default function Home() {
  return (
    <>
      <Hero />
      <SlidingAdverts />
      <BusinessSectors />
      <StatsBar />
      <WhyPartner />
      <SupportingSections />
      <NewsUpdates limit={3} />
      <ClosingCTA />
    </>
  );
}
