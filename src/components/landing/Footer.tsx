import { ArrowRight, Twitter, Linkedin, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeuristicLogo from "@/components/HeuristicLogo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <HeuristicLogo />
            </div>
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
              Building the future where portfolios replace GPAs and real projects replace exams.
            </p>
            
            {/* Newsletter */}
            <div className="flex gap-2 max-w-sm">
              <Input
                type="email"
                placeholder="Your email"
                className="rounded-2xl bg-background border-border focus:border-primary"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="icon" className="shrink-0 rounded-2xl bg-primary hover:bg-primary/90">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Platform */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-bold font-display text-foreground mb-6">Platform</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/for-students" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                  <motion.span whileHover={{ x: 3 }} className="inline-block">For Students</motion.span>
                </Link>
              </li>
              <li>
                <Link to="/for-educators" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                  <motion.span whileHover={{ x: 3 }} className="inline-block">For Educators</motion.span>
                </Link>
              </li>
              <li>
                <Link to="/for-companies" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                  <motion.span whileHover={{ x: 3 }} className="inline-block">For Companies</motion.span>
                </Link>
              </li>
              <li>
                <Link to="/get-started" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                  <motion.span whileHover={{ x: 3 }} className="inline-block">Pricing</motion.span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-bold font-display text-foreground mb-6">Company</h4>
            <ul className="space-y-4">
              {["About Us", "Careers", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                    <motion.span whileHover={{ x: 3 }} className="inline-block">{item}</motion.span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-bold font-display text-foreground mb-6">Legal</h4>
            <ul className="space-y-4">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                    <motion.span whileHover={{ x: 3 }} className="inline-block">{item}</motion.span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground">
            © {currentYear} Heuristic Inc. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {[
              { icon: Twitter, label: "Twitter" },
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Github, label: "GitHub" },
            ].map((social) => (
              <motion.a 
                key={social.label}
                href="#" 
                className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all duration-300"
                whileHover={{ y: -3, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
