import { Award, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

const CreditSystem = () => {
  const creditTiers = [
    { credits: "0-50", level: "Beginner", perks: ["Access to starter projects", "Basic feedback"] },
    { credits: "51-100", level: "Intermediate", perks: ["Company mentorship", "Priority project access"] },
    { credits: "101-150", level: "Advanced", perks: ["Exam exemption eligible", "Direct company contact"] },
    { credits: "150+", level: "Expert", perks: ["Job offers pipeline", "Portfolio featured"] },
  ];

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">
              Credit System
            </p>
            <h2 className="text-4xl sm:text-5xl font-black font-display text-foreground leading-tight mb-6">
              Credits Replace<br />
              <span className="text-primary">Grades Forever</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Every project you complete earns verified credits accepted by 100+ universities. 
              The more you build, the closer you get to exam exemption and direct hiring.
            </p>

            {/* Credit Benefits */}
            <div className="space-y-4 mb-8">
              {[
                "Credits count toward internal assessment marks",
                "Earn credits from real company grading",
                "Transparent progress tracking dashboard",
                "Request exam exemption at 150 credits",
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <span className="text-foreground font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <a href="/student" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all duration-300 group">
              See your potential credits
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Right - Credit Tiers */}
          <div className="space-y-4 animate-fade-in-up animation-delay-200">
            {creditTiers.map((tier, idx) => (
              <div
                key={tier.level}
                className="premium-card group relative overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center gap-6">
                  {/* Credit Badge */}
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-7 h-7 text-primary-foreground" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-foreground">{tier.level}</h3>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        {tier.credits} credits
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tier.perks.map((perk) => (
                        <span key={perk} className="text-xs text-muted-foreground">
                          • {perk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <TrendingUp className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditSystem;
