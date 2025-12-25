import { ReactNode } from "react";
import { Bell, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  actions?: ReactNode;
}

const DashboardHeader = ({ 
  title, 
  subtitle, 
  showSearch = false, 
  searchPlaceholder = "Search...",
  actions 
}: DashboardHeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              className="pl-9 w-64 bg-muted border-0"
            />
          </div>
        )}

        {actions}

        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="w-4 h-4" />
          Schedule
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
