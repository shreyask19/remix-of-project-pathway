import { ArrowRight, Briefcase, Award, FileX, Handshake } from "lucide-react";
import buildProjectIcon from "@/assets/build-project-icon.png";
import creditsIcon from "@/assets/credits-icon.png";
import skipExamIcon from "@/assets/skip-exam-icon.png";
import getHiredIcon from "@/assets/get-hired-icon.png";

const steps = [
  {
    number: "01",
    title: "Build Real Projects",
    description: "Work on actual backlog items from companies like Spotify, Tesla, and Airbnb. No more hypothetical assignments.",
    icon: Briefcase,
    image: buildProjectIcon,
  },
  {
    number: "02",
    title: "Earn Credits",
    description: "Each completed project earns verified credits. These replace traditional internal assessment marks.",
    icon: Award,
    image: creditsIcon,
  },
  {
    number: "03",
    title: "Skip Exams",
    description: "Accumulate enough credits and request exam exemption. Teachers approve based on your project portfolio.",
    icon: FileX,
    image: skipExamIcon,
  },
  {
    number: "04",
    title: "Get Hired",
    description: "Companies see your actual work. Top performers receive direct job offers before graduation.",
    icon: Handshake,
    image: getHiredIcon,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4 animate-fade-in">
            How It Works
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-foreground leading-tight animate-fade-in-up">
            From Projects to<br />
            <span className="text-primary">Career Success</span>
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="group premium-card relative overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Step Number */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-black text-primary">
                  {step.number}
                </span>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50 hidden lg:block" />
                )}
              </div>

              {/* Icon/Image */}
              <div className="w-20 h-20 mb-6 rounded-2xl overflow-hidden bg-secondary group-hover:scale-110 transition-transform duration-300">
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold font-display text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Decorative Line */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary group-hover:w-full transition-all duration-500 rounded-b-3xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
