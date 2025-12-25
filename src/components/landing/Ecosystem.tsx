import { GraduationCap, BookOpen, Building2, Check, ArrowRight } from "lucide-react";
import studentsImg from "@/assets/students-collab.png";
import educatorImg from "@/assets/educator.png";
import companiesImg from "@/assets/companies.png";

const audiences = [
  {
    label: "For Students",
    icon: GraduationCap,
    color: "text-primary",
    image: studentsImg,
    description: "Stop wasting time on disposable assignments. Build a portfolio that gets you hired while earning your degree.",
    features: ["Real world experience", "Earn for your resume"],
    link: "/student",
  },
  {
    label: "For Educators",
    icon: BookOpen,
    color: "text-warning",
    image: educatorImg,
    description: "Keep your curriculum cutting-edge without the burnout. Let us handle grading and focus on mentorship.",
    features: ["AI-assisted grading", "Industry-aligned course design"],
    link: "/teacher",
  },
  {
    label: "For Companies",
    icon: Building2,
    color: "text-destructive",
    image: companiesImg,
    description: "Skip the boring résumé screen. Access a pipeline of pre-vetted, work-ready talent.",
    features: ["Clear hiring costs", "3.2x conversion rate"],
    link: "/company",
  },
];

const Ecosystem = () => {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">ECOSYSTEM</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Built for the entire education loop
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience) => (
            <div
              key={audience.label}
              className="dashboard-card group hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden mb-5">
                <img
                  src={audience.image}
                  alt={audience.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className={`flex items-center gap-2 mb-3 ${audience.color}`}>
                <audience.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{audience.label}</span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {audience.description}
              </p>

              <ul className="space-y-2 mb-4">
                {audience.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-success" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={audience.link}
                className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline"
              >
                Learn more
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
