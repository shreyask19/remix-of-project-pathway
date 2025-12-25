import { Award, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CreditSystem = () => {
  const creditTiers = [
    { credits: "0-50", level: "Beginner", perks: ["Access to starter projects", "Basic feedback"] },
    { credits: "51-100", level: "Intermediate", perks: ["Company mentorship", "Priority project access"] },
    { credits: "101-150", level: "Advanced", perks: ["Exam exemption eligible", "Direct company contact"] },
    { credits: "150+", level: "Expert", perks: ["Job offers pipeline", "Portfolio featured"] },
  ];

  const benefits = [
    "Credits count toward internal assessment marks",
    "Earn credits from real company grading",
    "Transparent progress tracking dashboard",
    "Request exam exemption at 150 credits",
  ];

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm font-bold text-primary uppercase tracking-widest mb-4"
            >
              Credit System
            </motion.p>
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
              {benefits.map((benefit, idx) => (
                <motion.div 
                  key={idx} 
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                >
                  <motion.div 
                    className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                    whileHover={{ scale: 1.2, backgroundColor: "hsl(var(--primary))" }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </motion.div>
                  <span className="text-foreground font-medium">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Link 
                to="/for-students" 
                className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all duration-300 group"
              >
                See your potential credits
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Credit Tiers */}
          <div className="space-y-4">
            {creditTiers.map((tier, idx) => (
              <motion.div
                key={tier.level}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="premium-card group relative overflow-hidden"
              >
                <div className="flex items-center gap-6">
                  {/* Credit Badge */}
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shrink-0"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Award className="w-7 h-7 text-primary-foreground" />
                  </motion.div>

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
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                  >
                    <TrendingUp className="w-5 h-5 text-muted-foreground/50 shrink-0" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditSystem;
