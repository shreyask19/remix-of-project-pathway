import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeuristicLogo from "@/components/HeuristicLogo";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="group">
            <HeuristicLogo />
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <Link 
              to="/student" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
            >
              For Students
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/teacher" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
            >
              For Educators
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
            <Link 
              to="/company" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
            >
              For Companies
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300" />
            </Link>
          </div>
          
          <Link to="/student/onboarding">
            <Button 
              size="lg" 
              className="rounded-2xl px-8 font-semibold bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
