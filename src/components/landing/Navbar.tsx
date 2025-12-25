import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mountain } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mountain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">Heuristic</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/student" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              For Students
            </Link>
            <Link to="/teacher" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              For Educators
            </Link>
            <Link to="/company" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              For Companies
            </Link>
          </div>
          
          <Button size="sm" className="rounded-full px-5">
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
