import { Building2, Rocket, Globe, Zap, FlaskConical } from "lucide-react";

const companies = [
  { name: "Acme Inc.", icon: Building2 },
  { name: "StarTech", icon: Rocket },
  { name: "GlobalNet", icon: Globe },
  { name: "EnergyPlus", icon: Zap },
  { name: "PureLabs", icon: FlaskConical },
];

const TrustedBy = () => {
  return (
    <section className="py-12 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-muted-foreground uppercase tracking-wider mb-8">
          Trusted by <span className="text-foreground font-medium">100+</span> leading institutions
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {companies.map((company) => (
            <div
              key={company.name}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <company.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{company.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
