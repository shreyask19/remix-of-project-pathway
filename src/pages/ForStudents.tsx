import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Code, Award, Briefcase, FileX, Users, Star, Zap } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const ForStudents = () => {
  const benefits = [
    {
      icon: Code,
      title: "Build Real Projects",
      description: "Work on actual company backlog items from industry leaders. No more hypothetical case studies."
    },
    {
      icon: Award,
      title: "Earn Verified Credits",
      description: "Each completed project earns credits that count toward your internal assessment marks."
    },
    {
      icon: FileX,
      title: "Skip Traditional Exams",
      description: "Accumulate 150+ credits and request exam exemption approved by your educators."
    },
    {
      icon: Briefcase,
      title: "Get Hired Directly",
      description: "Top performers receive interview requests and job offers before graduation."
    }
  ];

  const howItWorks = [
    { step: "01", title: "Sign Up", description: "Create your free account and complete your student profile." },
    { step: "02", title: "Browse Projects", description: "Explore real company challenges matching your skills and interests." },
    { step: "03", title: "Build & Submit", description: "Complete projects with code, documentation, and deployed demos." },
    { step: "04", title: "Get Graded", description: "Companies review your work and award verified credits." },
  ];

  const testimonials = [
    {
      name: "Arjun Mehta",
      role: "Computer Science, IIT Delhi",
      quote: "I landed my dream internship at a fintech startup because they saw my actual code, not just my resume.",
      rating: 5
    },
    {
      name: "Priya Sharma",
      role: "Software Engineering, BITS Pilani",
      quote: "Skipping exams felt unreal at first. Now I have a portfolio that speaks louder than any GPA.",
      rating: 5
    },
    {
      name: "Rahul Krishnan",
      role: "Data Science, NIT Trichy",
      quote: "The credit system motivated me to build consistently. I earned 180 credits in one semester.",
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
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">For Students</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black font-display text-foreground leading-tight mb-6">
                Ditch the Blue Books.<br />
                <span className="text-primary">Build Your Future.</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Replace 30-page handwritten assignments with real-world projects. 
                Build a verifiable portfolio that gets you hired before graduation.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/student/onboarding">
                  <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl">
                    Start Building Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/get-started">
                  <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold rounded-2xl">
                    View Demo
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
                Everything You Need to <span className="text-primary">Succeed</span>
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
                Your Path to <span className="text-primary">Success</span>
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

        {/* Credit System Preview */}
        <section className="py-20 lg:py-28 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Credit System</p>
                <h2 className="text-3xl sm:text-4xl font-black font-display text-foreground mb-6">
                  Credits Replace <span className="text-primary">Grades Forever</span>
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Every project you complete earns verified credits accepted by universities. 
                  The more you build, the closer you get to exam exemption and direct hiring.
                </p>

                <ul className="space-y-4">
                  {[
                    "Credits count toward internal assessment marks",
                    "Earn credits from real company grading",
                    "Transparent progress tracking dashboard",
                    "Request exam exemption at 150 credits"
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
                {[
                  { level: "Beginner", credits: "0-50", perks: "Access to starter projects" },
                  { level: "Intermediate", credits: "51-100", perks: "Company mentorship access" },
                  { level: "Advanced", credits: "101-150", perks: "Exam exemption eligible" },
                  { level: "Expert", credits: "150+", perks: "Direct job offers pipeline" }
                ].map((tier, idx) => (
                  <div key={idx} className="premium-card flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-foreground">{tier.level}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                          {tier.credits} credits
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{tier.perks}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Student Stories</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-foreground">
                Trusted by <span className="text-primary">Thousands</span>
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
              Ready to Start Building?
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-10">
              Join thousands of students who replaced exams with real projects and landed their dream jobs.
            </p>
            <Link to="/student/onboarding">
              <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Get Started Free
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

export default ForStudents;
