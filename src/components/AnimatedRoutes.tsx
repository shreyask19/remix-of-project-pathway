import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import RoleSelection from "@/pages/RoleSelection";
import StudentDashboard from "@/pages/StudentDashboard";
import StudentOnboarding from "@/pages/StudentOnboarding";
import TeacherDashboard from "@/pages/TeacherDashboard";
import TeacherOnboarding from "@/pages/TeacherOnboarding";
import CompanyDashboard from "@/pages/CompanyDashboard";
import CompanyOnboarding from "@/pages/CompanyOnboarding";
import ForStudents from "@/pages/ForStudents";
import ForEducators from "@/pages/ForEducators";
import ForCompanies from "@/pages/ForCompanies";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><Auth /></PageWrapper>} />
        <Route path="/get-started" element={<PageWrapper><RoleSelection /></PageWrapper>} />
        <Route path="/for-students" element={<PageWrapper><ForStudents /></PageWrapper>} />
        <Route path="/for-educators" element={<PageWrapper><ForEducators /></PageWrapper>} />
        <Route path="/for-companies" element={<PageWrapper><ForCompanies /></PageWrapper>} />
        
        {/* Student routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute requiredRole="student">
              <PageWrapper><StudentDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/onboarding"
          element={
            <ProtectedRoute requiredRole="student" requireOnboarding={false}>
              <PageWrapper><StudentOnboarding /></PageWrapper>
            </ProtectedRoute>
          }
        />
        
        {/* Teacher routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute requiredRole="teacher">
              <PageWrapper><TeacherDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/onboarding"
          element={
            <ProtectedRoute requiredRole="teacher" requireOnboarding={false}>
              <PageWrapper><TeacherOnboarding /></PageWrapper>
            </ProtectedRoute>
          }
        />
        
        {/* Company routes */}
        <Route
          path="/company"
          element={
            <ProtectedRoute requiredRole="company">
              <PageWrapper><CompanyDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/company/onboarding"
          element={
            <ProtectedRoute requiredRole="company" requireOnboarding={false}>
              <PageWrapper><CompanyOnboarding /></PageWrapper>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
