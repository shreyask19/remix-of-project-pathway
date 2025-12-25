import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="relative py-24 lg:py-32 bg-primary overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
            <span className="text-sm font-semibold text-primary-foreground">Join the Revolution</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black font-display text-primary-foreground leading-tight mb-6 animate-fade-in-up">
            Ready to Replace<br />
            Exams Forever?
          </h2>

          {/* Subheadline */}
          <p className="text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            Start building real projects today. Earn credits. Skip exams. 
            Get hired by the companies you actually work for.
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in-up animation-delay-300">
            <Button 
              size="lg" 
              className="h-16 px-12 text-lg font-bold rounded-3xl bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all duration-300 hover:shadow-xl group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          {/* Trust Note */}
          <p className="text-sm text-primary-foreground/60 mt-8 animate-fade-in-up animation-delay-400">
            No credit card required • Start in 60 seconds
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
