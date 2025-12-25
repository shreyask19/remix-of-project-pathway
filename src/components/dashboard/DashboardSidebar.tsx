import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  badge?: number;
}

interface SidebarSection {
  title?: string;
  items: NavItem[];
}

interface DashboardSidebarProps {
  logo: ReactNode;
  title: string;
  subtitle: string;
  sections: SidebarSection[];
  footer?: ReactNode;
}

const DashboardSidebar = ({ logo, title, subtitle, sections, footer }: DashboardSidebarProps) => {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {logo}
          </div>
          <div>
            <h1 className="font-semibold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {section.title && (
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 px-3">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={cn(
                        "sidebar-nav-item",
                        isActive ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="p-4 border-t border-border">
          {footer}
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;
