import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-10">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">The Future of Education</span>
          </div>

          {/* Main Headlines */}
          <div className="space-y-4 mb-12">
            <h1 className="animate-fade-in-up animation-delay-100 text-5xl sm:text-6xl lg:text-8xl font-black font-display text-foreground leading-none tracking-tighter">
              Build Projects.
            </h1>
            <h1 className="animate-fade-in-up animation-delay-200 text-5xl sm:text-6xl lg:text-8xl font-black font-display leading-none tracking-tighter text-primary">
              Skip Exams.
            </h1>
            <h1 className="animate-fade-in-up animation-delay-300 text-5xl sm:text-6xl lg:text-8xl font-black font-display text-foreground leading-none tracking-tighter">
              Get Hired.
            </h1>
          </div>

          {/* Subheadline */}
          <p className="animate-fade-in-up animation-delay-400 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Heuristic replaces traditional exams with real-world company projects. 
            Earn credits, prove your skills, and land your dream job before graduation.
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in-up animation-delay-500">
            <Button 
              size="lg" 
              className="h-16 px-12 text-lg font-bold rounded-3xl bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-xl group"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          {/* Stats Row */}
          <div className="animate-fade-in-up animation-delay-600 mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-black font-display text-foreground">500+</p>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Active Projects</p>
            </div>
            <div className="text-center border-x border-border">
              <p className="text-4xl lg:text-5xl font-black font-display text-primary">40%</p>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Hired Before Grad</p>
            </div>
            <div className="text-center">
              <p className="text-4xl lg:text-5xl font-black font-display text-foreground">100+</p>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Partner Companies</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
