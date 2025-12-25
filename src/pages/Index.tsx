import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import CreditSystem from "@/components/landing/CreditSystem";
import Ecosystem from "@/components/landing/Ecosystem";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <CreditSystem />
        <Ecosystem />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
