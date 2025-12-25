import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 lg:py-28 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
          Ready to upgrade your future?
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
          Join thousands of students and companies redefining what education means in the 21st century.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            variant="secondary"
            className="rounded-lg px-8 bg-background text-foreground hover:bg-background/90"
          >
            Get Started Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-lg px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
          >
            View Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
