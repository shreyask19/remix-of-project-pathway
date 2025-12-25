import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Index from "@/pages/Index";
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
        <Route path="/" element={<PageWrapper><Index /></PageWrapper>} />
        <Route path="/get-started" element={<PageWrapper><RoleSelection /></PageWrapper>} />
        <Route path="/for-students" element={<PageWrapper><ForStudents /></PageWrapper>} />
        <Route path="/for-educators" element={<PageWrapper><ForEducators /></PageWrapper>} />
        <Route path="/for-companies" element={<PageWrapper><ForCompanies /></PageWrapper>} />
        <Route path="/student" element={<PageWrapper><StudentDashboard /></PageWrapper>} />
        <Route path="/student/onboarding" element={<PageWrapper><StudentOnboarding /></PageWrapper>} />
        <Route path="/teacher" element={<PageWrapper><TeacherDashboard /></PageWrapper>} />
        <Route path="/teacher/onboarding" element={<PageWrapper><TeacherOnboarding /></PageWrapper>} />
        <Route path="/company" element={<PageWrapper><CompanyDashboard /></PageWrapper>} />
        <Route path="/company/onboarding" element={<PageWrapper><CompanyOnboarding /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
