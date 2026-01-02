import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

type AppRole = "student" | "teacher" | "company";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AppRole;
  requireOnboarding?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole,
  requireOnboarding = true 
}: ProtectedRouteProps) => {
  const { user, role, isOnboarded, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated - redirect to auth page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // No role selected - redirect to role selection (NEVER default to student)
  if (!role) {
    console.log("[ProtectedRoute] No role found, redirecting to /get-started");
    return <Navigate to="/get-started" replace />;
  }

  // Role doesn't match required role - redirect to correct dashboard
  if (requiredRole && role !== requiredRole) {
    // CRITICAL: Log any cross-role routing attempt for debugging
    console.warn(`[ProtectedRoute] Role mismatch: user has "${role}" but route requires "${requiredRole}". Redirecting to ${role} dashboard.`);
    
    const dashboardRoutes: Record<AppRole, string> = {
      student: "/student",
      teacher: "/teacher",
      company: "/company",
    };
    return <Navigate to={dashboardRoutes[role]} replace />;
  }

  // Not onboarded - redirect to role-specific onboarding (NEVER cross-role)
  if (requireOnboarding && !isOnboarded) {
    const onboardingRoutes: Record<AppRole, string> = {
      student: "/student/onboarding",
      teacher: "/teacher/onboarding",
      company: "/company/onboarding",
    };
    
    const targetRoute = onboardingRoutes[role];
    console.log(`[ProtectedRoute] User not onboarded, redirecting to ${targetRoute}`);
    
    return <Navigate to={targetRoute} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
