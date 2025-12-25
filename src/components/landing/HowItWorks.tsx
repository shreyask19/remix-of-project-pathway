import { ArrowRight, Briefcase, Award, FileX, Handshake } from "lucide-react";
import { motion } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const HowItWorks = () => {
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
            How It Works
          </motion.p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-foreground leading-tight">
            From Projects to<br />
            <span className="text-primary">Career Success</span>
          </h2>
        </motion.div>

        {/* Steps Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={step.number}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group premium-card relative overflow-hidden"
            >
              {/* Step Number */}
              <div className="flex items-center justify-between mb-6">
                <motion.span 
                  className="text-sm font-black text-primary"
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                >
                  {step.number}
                </motion.span>
                {idx < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                  >
                    <ArrowRight className="w-4 h-4 text-muted-foreground/50 hidden lg:block" />
                  </motion.div>
                )}
              </div>

              {/* Icon/Image */}
              <motion.div 
                className="w-20 h-20 mb-6 rounded-2xl overflow-hidden bg-secondary"
                whileHover={{ scale: 1.1, rotate: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold font-display text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>

              {/* Decorative Line */}
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-primary rounded-b-3xl"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
