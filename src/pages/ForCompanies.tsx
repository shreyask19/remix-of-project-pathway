import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Building2, Search, Users, Zap, Target, Star, TrendingUp } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const ForCompanies = () => {
  const benefits = [
    {
      icon: Search,
      title: "See Real Work",
      description: "Stop relying on resume buzzwords. Evaluate candidates through their actual project builds and code quality."
    },
    {
      icon: Target,
      title: "Identify Talent Early",
      description: "Scout high-performing students before they even graduate based on their problem-solving skills."
    },
    {
      icon: Users,
      title: "Streamlined Hiring",
      description: "Send interview requests directly to students who excel in your specific engineering challenges."
    },
    {
      icon: Zap,
      title: "Reduce Time-to-Hire",
      description: "Skip the resume screen. Hire builders who've already proven they can do the job."
    }
  ];

  const howItWorks = [
    { step: "01", title: "Post Challenges", description: "Create real engineering problems from your backlog." },
    { step: "02", title: "Review Submissions", description: "Evaluate student solutions with detailed code reviews." },
    { step: "03", title: "Identify Top Talent", description: "Rank candidates by actual performance, not keywords." },
    { step: "04", title: "Hire Directly", description: "Send interview requests to your top picks instantly." },
  ];

  const testimonials = [
    {
      name: "Amit Gupta",
      role: "CTO, TechStartup Inc.",
      quote: "We hired 3 engineers directly from Heuristic. They hit the ground running because we'd already seen their work.",
      rating: 5
    },
    {
      name: "Sarah Chen",
      role: "VP Engineering, FinanceApp",
      quote: "The quality of candidates is incredible. These students can actually code, not just talk about coding.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Head of Talent, DataCorp",
      quote: "Our time-to-hire dropped by 40%. We skip the resume pile and go straight to proven performers.",
      rating: 5
    }
  ];

  const stats = [
    { value: "40%", label: "Faster Hiring" },
    { value: "3x", label: "Better Retention" },
    { value: "500+", label: "Companies Trust Us" },
    { value: "10K+", label: "Successful Placements" }
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
                <Building2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">For Companies</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black font-display text-foreground leading-tight mb-6">
                Hire Builders,<br />
                <span className="text-primary">Not Keywords.</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Stop sifting through resumes. See the real-world impact of candidates through 
                their actual project builds and code quality.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/company/onboarding">
                  <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl">
                    Start Hiring
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/get-started">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-2xl">
                    View Talent Pool
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-12 bg-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-3xl md:text-4xl font-black text-primary-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-primary-foreground/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Why Heuristic</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-foreground">
                Smarter <span className="text-primary">Hiring</span>
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
                Simple <span className="text-primary">Process</span>
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
                <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Talent Pipeline</p>
                <h2 className="text-3xl sm:text-4xl font-black font-display text-foreground mb-6">
                  Build Your <span className="text-primary">Future Team</span>
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Create engineering challenges from your actual backlog. Students solve them, 
                  and you see exactly who can do the job before you hire them.
                </p>

                <ul className="space-y-4">
                  {[
                    "Post unlimited engineering challenges",
                    "Automated code quality scoring",
                    "Direct messaging with candidates",
                    "Integration with your ATS",
                    "Dedicated account manager"
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

              <div className="space-y-4">
                <div className="premium-card">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Talent Analytics</h3>
                      <p className="text-sm text-muted-foreground">Real-time insights on your hiring pipeline</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xl font-bold text-primary">156</p>
                      <p className="text-xs text-muted-foreground">Applicants</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xl font-bold text-primary">42</p>
                      <p className="text-xs text-muted-foreground">Shortlisted</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50">
                      <p className="text-xl font-bold text-primary">12</p>
                      <p className="text-xs text-muted-foreground">Hired</p>
                    </div>
                  </div>
                </div>

                <div className="premium-card">
                  <h3 className="font-bold text-foreground mb-3">Top Skills in Demand</h3>
                  <div className="space-y-3">
                    {[
                      { skill: "React & TypeScript", percent: 85 },
                      { skill: "Node.js & APIs", percent: 72 },
                      { skill: "System Design", percent: 65 }
                    ].map((item, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{item.skill}</span>
                          <span className="text-primary font-medium">{item.percent}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${item.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Success Stories</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-foreground">
                Trusted by <span className="text-primary">Leaders</span>
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
              Ready to Hire Proven Talent?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-10">
              Join 500+ companies who hire builders, not just resume writers.
            </p>
            <Link to="/company/onboarding">
              <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Start Hiring Now
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

export default ForCompanies;
