
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentDashboard from "./pages/student/Dashboard";
import ResitApplication from "./pages/student/ResitApplication";
import SupplementaryApplication from "./pages/student/SupplementaryApplication";
import ApplicationStatus from "./pages/student/ApplicationStatus";
import Timetable from "./pages/student/Timetable";
import Results from "./pages/student/Results";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageCourses from "./pages/admin/ManageCourses";
import ApproveApplications from "./pages/admin/ApproveApplications";
import PaymentsTracker from "./pages/admin/PaymentsTracker";
import ManageTimetable from "./pages/admin/ManageTimetable";
import ManageResults from "./pages/admin/ManageResults";
import ManageAccounts from "./pages/admin/ManageAccounts"; // Add the new page
import NotFound from "./pages/NotFound";

// Context
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";
import ManageStudents from "./pages/admin/ManageStudents";
import ManageLecturers from "./pages/admin/ManageLecturers";
// import SignupForm from "./pages/Signup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path="/signup" element={<SignupForm />} /> */}
              
              {/* Student Routes */}
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/resit-application" element={<ResitApplication />} />
              <Route path="/student/supplementary-application" element={<SupplementaryApplication />} />
              <Route path="/student/application-status" element={<ApplicationStatus />} />
              <Route path="/student/timetable" element={<Timetable />} />
              <Route path="/student/results" element={<Results />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/manage-courses" element={<ManageCourses />} />
              <Route path="/admin/approve-applications" element={<ApproveApplications />} />
              <Route path="/admin/payments" element={<PaymentsTracker />} />
              <Route path="/admin/manage-timetable" element={<ManageTimetable />} />
              <Route path="/admin/manage-results" element={<ManageResults />} />
              <Route path="/admin/manage-accounts" element={<ManageAccounts />} /> 
              <Route path="/admin/manage-students" element={<ManageStudents />} /> 
              <Route path="/admin/manage-lecturers" element={<ManageLecturers />} /> 
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
