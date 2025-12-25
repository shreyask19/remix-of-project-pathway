import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Index from "./pages/Index";
import RoleSelection from "./pages/RoleSelection";
import StudentDashboard from "./pages/StudentDashboard";
import StudentOnboarding from "./pages/StudentOnboarding";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherOnboarding from "./pages/TeacherOnboarding";
import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyOnboarding from "./pages/CompanyOnboarding";
import ForStudents from "./pages/ForStudents";
import ForEducators from "./pages/ForEducators";
import ForCompanies from "./pages/ForCompanies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/get-started" element={<RoleSelection />} />
            <Route path="/for-students" element={<ForStudents />} />
            <Route path="/for-educators" element={<ForEducators />} />
            <Route path="/for-companies" element={<ForCompanies />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/student/onboarding" element={<StudentOnboarding />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/teacher/onboarding" element={<TeacherOnboarding />} />
            <Route path="/company" element={<CompanyDashboard />} />
            <Route path="/company/onboarding" element={<CompanyOnboarding />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
