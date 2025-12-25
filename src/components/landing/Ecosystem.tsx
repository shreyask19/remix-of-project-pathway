import { GraduationCap, BookOpen, Building2, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  {
    title: "For Students",
    subtitle: "Ditch the blue books. Build for your future.",
    icon: GraduationCap,
    highlights: [
      "Replace 30-page handwritten assignments with real-world projects that actually matter.",
      "Build a verifiable portfolio. Your code, your architecture, and your deployed apps speak louder than any GPA.",
      "Get hired directly. If companies love your project, they can skip the resume screen and invite you for an interview immediately.",
    ],
    link: "/student",
  },
  {
    title: "For Educators",
    subtitle: "Automated assessment, focus on mentorship.",
    icon: BookOpen,
    highlights: [
      "Zero grading fatigue. Companies validate the projects automatically, so you don't have to manually correct hundreds of papers.",
      "Seamless marks allocation. Internal assessment grades are auto-synced to your records based on industry-standard reviews.",
      "Industry-aligned curriculum. Ensure your students are building what the market actually needs right now.",
    ],
    link: "/teacher",
  },
  {
    title: "For Companies",
    subtitle: "Hire builders, not just keyword matches.",
    icon: Building2,
    highlights: [
      "Stop relying on resume buzzwords. See the real-world impact of a candidate through their actual project builds and code quality.",
      "Identify talent early. Scout high-performing students before they even graduate based on their problem-solving skills.",
      "Streamlined hiring. Send interview requests directly to students who excel in your specific engineering challenges.",
    ],
    link: "/company",
  },
];

const Ecosystem = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4 animate-fade-in">
            Ecosystem
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-foreground leading-tight animate-fade-in-up">
            One Platform,<br />
            <span className="text-primary">Everyone Wins</span>
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              className="premium-card group animate-fade-in-up flex flex-col"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold font-display text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-primary font-semibold mb-6">
                {feature.subtitle}
              </p>

              {/* Highlights */}
              <ul className="space-y-4 mb-8 flex-1">
                {feature.highlights.map((highlight, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              {/* Link */}
              <a 
                href={feature.link}
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all duration-300 mt-auto"
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;
