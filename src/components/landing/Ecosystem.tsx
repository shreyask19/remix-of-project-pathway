import { GraduationCap, BookOpen, Building2, ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import educationCareerImg from "@/assets/education-career.png";

const features = [
  {
    title: "For Students",
    icon: GraduationCap,
    color: "from-primary to-blue-400",
    description: "Build a portfolio that proves your skills while earning your degree. Skip exams, get hired.",
    highlights: ["Real company projects", "Verified credentials", "Direct job pipeline"],
    link: "/student",
  },
  {
    title: "For Educators",
    icon: BookOpen,
    color: "from-amber-500 to-orange-400",
    description: "Automate grading with AI. Focus on mentorship while companies evaluate student work.",
    highlights: ["AI-assisted grading", "Real-time analytics", "Industry curriculum"],
    link: "/teacher",
  },
  {
    title: "For Companies",
    icon: Building2,
    color: "from-accent to-pink-500",
    description: "Access pre-vetted talent who've already proven themselves on real projects.",
    highlights: ["Work-ready graduates", "Lower hiring costs", "3.2x conversion rate"],
    link: "/company",
  },
];

const Ecosystem = () => {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/30 via-background to-muted/30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4 animate-fade-in">
            Ecosystem
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-foreground leading-tight animate-fade-in-up">
            One Platform,<br />
            <span className="gradient-text">Everyone Wins</span>
          </h2>
        </div>

        {/* Central Visual + Cards */}
        <div className="relative">
          {/* Central Image (Large Screens) */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 z-10">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse-subtle" />
              <img 
                src={educationCareerImg} 
                alt="Education to career transition" 
                className="w-full h-full object-contain relative z-10 animate-float drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-12">
            {features.map((feature, idx) => (
              <div
                key={feature.title}
                className={`premium-card group animate-fade-in-up ${
                  idx === 1 ? 'lg:mt-16' : ''
                }`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold font-display text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2 mb-6">
                  {feature.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2 text-sm text-foreground">
                      <Zap className="w-4 h-4 text-primary" />
                      {highlight}
                    </li>
                  ))}
                </ul>

                {/* Link */}
                <a 
                  href={feature.link}
                  className={`inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent hover:gap-3 transition-all duration-300`}
                >
                  Explore {feature.title.split(" ")[1]}
                  <ArrowRight className="w-4 h-4 text-primary" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;
