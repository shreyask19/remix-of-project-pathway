import { Button } from "@/components/ui/button";
import dashboardMockup from "@/assets/dashboard-mockup.png";

const Hero = () => {
  return (
    <section className="pt-32 pb-16 lg:pt-40 lg:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              THE FUTURE OF EDUCATION
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Your<br />
              Portfolio is<br />
              the <span className="text-primary">New</span><br />
              <span className="text-primary">GPA.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              Heuristic replaces standardized testing with real-world projects from the world's leading companies. Prove your skills, not your memorization.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="rounded-lg px-6">
                Start Your Project
              </Button>
              <Button size="lg" variant="outline" className="rounded-lg px-6">
                Partner with Us
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-muted border-2 border-background"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Join by 10,000+ students this month
              </span>
            </div>
          </div>
          
          <div className="animate-fade-in animation-delay-200 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={dashboardMockup}
                alt="Heuristic Dashboard showing project management and approval status"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-primary/5 to-primary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
