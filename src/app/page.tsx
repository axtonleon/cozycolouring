import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { CollectionShowcase } from "@/components/CollectionShowcase";
import { FeaturedBooks } from "@/components/FeaturedBooks";
import { PeekInside } from "@/components/PeekInside";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <CollectionShowcase />
        <PeekInside />
        <FeaturedBooks />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
