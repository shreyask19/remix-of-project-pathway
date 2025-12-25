import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, BookOpen, ClipboardCheck, BarChart3, Clock, Users, Star, Shield } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const ForEducators = () => {
  const benefits = [
    {
      icon: ClipboardCheck,
      title: "Zero Grading Fatigue",
      description: "Companies validate projects automatically. No more manually correcting hundreds of papers."
    },
    {
      icon: BarChart3,
      title: "Seamless Marks Sync",
      description: "Internal assessment grades auto-sync to your records based on industry-standard reviews."
    },
    {
      icon: BookOpen,
      title: "Industry-Aligned Curriculum",
      description: "Ensure students build what the market actually needs right now."
    },
    {
      icon: Clock,
      title: "Save 20+ Hours Weekly",
      description: "Automated workflows free you to focus on mentorship and teaching."
    }
  ];

  const howItWorks = [
    { step: "01", title: "Onboard Your Class", description: "Add students via email or bulk upload from your institution." },
    { step: "02", title: "Assign Projects", description: "Choose from company challenges or create custom assignments." },
    { step: "03", title: "Monitor Progress", description: "Real-time dashboards show student activity and submissions." },
    { step: "04", title: "Approve Credits", description: "Review company grades and approve exam exemption requests." },
  ];

  const testimonials = [
    {
      name: "Dr. Ananya Rao",
      role: "Professor, Computer Science Dept.",
      quote: "My grading workload dropped by 80%. Students are more engaged because the projects feel real.",
      rating: 5
    },
    {
      name: "Prof. Vikram Singh",
      role: "Head of Engineering Faculty",
      quote: "The analytics dashboard helps me identify struggling students before it's too late.",
      rating: 5
    },
    {
      name: "Dr. Meera Patel",
      role: "Associate Professor, IT",
      quote: "Industry-aligned projects mean my curriculum stays relevant without constant manual updates.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">For Educators</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black font-display text-foreground leading-tight mb-6">
                Automated Assessment.<br />
                <span className="text-primary">Focus on Mentorship.</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Let companies grade the projects. You focus on guiding students toward career success 
                with real-time analytics and automated workflows.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/teacher/onboarding">
                  <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/get-started">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-2xl">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Why Heuristic</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-foreground">
                Transform Your <span className="text-primary">Teaching</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="premium-card group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">How It Works</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-foreground">
                Simple <span className="text-primary">Integration</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="premium-card h-full">
                    <span className="text-4xl font-black text-primary/20 mb-4 block">{item.step}</span>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  {idx < howItWorks.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 w-6 h-6 text-primary/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Deep Dive */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Powerful Tools</p>
                <h2 className="text-3xl sm:text-4xl font-black font-display text-foreground mb-6">
                  Everything You Need to <span className="text-primary">Manage Classes</span>
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  From onboarding to exam exemption approval, Heuristic provides a complete 
                  toolkit for modern educators.
                </p>

                <ul className="space-y-4">
                  {[
                    "Real-time student progress tracking",
                    "Automated plagiarism detection",
                    "One-click exam exemption approval",
                    "Detailed analytics and reports",
                    "Direct communication with companies"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="premium-card text-center">
                  <p className="text-4xl font-black text-primary mb-2">80%</p>
                  <p className="text-sm text-muted-foreground">Less Grading Time</p>
                </div>
                <div className="premium-card text-center">
                  <p className="text-4xl font-black text-primary mb-2">95%</p>
                  <p className="text-sm text-muted-foreground">Student Engagement</p>
                </div>
                <div className="premium-card text-center">
                  <p className="text-4xl font-black text-primary mb-2">100+</p>
                  <p className="text-sm text-muted-foreground">Partner Universities</p>
                </div>
                <div className="premium-card text-center">
                  <p className="text-4xl font-black text-primary mb-2">24/7</p>
                  <p className="text-sm text-muted-foreground">Support Available</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Educator Stories</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-foreground">
                Loved by <span className="text-primary">Faculty</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="premium-card">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28 bg-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-primary-foreground mb-6">
              Ready to Transform Your Classroom?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-10">
              Join hundreds of educators who automated grading and focused on what matters most.
            </p>
            <Link to="/teacher/onboarding">
              <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ForEducators;
