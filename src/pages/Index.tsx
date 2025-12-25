import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import TrustedBy from "@/components/landing/TrustedBy";
import Process from "@/components/landing/Process";
import Ecosystem from "@/components/landing/Ecosystem";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Process />
        <Ecosystem />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
