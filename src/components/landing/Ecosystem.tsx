import { GraduationCap, BookOpen, Building2, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
    link: "/for-students",
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
    link: "/for-educators",
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
    link: "/for-companies",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const,
    },
  },
};

const Ecosystem = () => {
  return (
    <section className="py-24 lg:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm font-bold text-primary uppercase tracking-widest mb-4"
          >
            Ecosystem
          </motion.p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-foreground leading-tight">
            One Platform,<br />
            <span className="text-primary">Everyone Wins</span>
          </h2>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="premium-card group flex flex-col h-full"
            >
              {/* Icon */}
              <motion.div 
                className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </motion.div>

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
                  <motion.li 
                    key={hIdx} 
                    className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + hIdx * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    </motion.div>
                    <span>{highlight}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Link */}
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="mt-auto"
              >
                <Link 
                  to={feature.link}
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Ecosystem;
