import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { LecturerSearch } from "./components/LecturerSearch";
import { SubmissionStatus } from "./components/SubmissionStatus";
import { LecturerDashboard } from "./components/LecturerDashboard";
import { LecturerProfile } from "./components/LecturerProfile";
import { ApplicantList } from "./components/ApplicantList";
import { HeadDashboard } from "./components/HeadDashboard";
import { QuotaApproval } from "./components/QuotaApproval";
import { DistributionMonitoring } from "./components/DistributionMonitoring";

export type ApplicationStatus = "not_submitted" | "pending" | "approved" | "rejected";
export type UserRole = "student" | "lecturer" | "head";

export interface Lecturer {
  id: string;
  name: string;
  nidn: string;
  photo: string;
  expertise: string[];
  quota: number;
  maxQuota: number;
}

export interface Submission {
  id: string;
  lecturerId: string;
  lecturerName: string;
  title: string;
  description: string;
  status: ApplicationStatus;
  submittedDate: string;
  viewedDate?: string;
  responseDate?: string;
  rejectionReason?: string;
}

export interface LecturerData {
  id: string;
  name: string;
  nidn: string;
  skills: string[];
  requestedQuota: number;
  approvedQuota: number;
  quotaStatus: "pending" | "approved" | "rejected";
}

export interface Applicant {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  submittedDate: string;
  status: ApplicationStatus;
  rejectionReason?: string;
}



function MainApp() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const response = await (window as any).axios.get('/api/user'); 
                setUserRole(response.data.data.role as UserRole);
            } catch (error) {
                console.error("Session expired or invalid", error);
                localStorage.removeItem('auth_token');
                setUserRole(null);
            }
        }
        setIsAuthLoading(false);
    };

    checkAuth();
  }, []);





  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'lecturer') navigate('/lecturer/dashboard');
    else if (role === 'head') navigate('/head/dashboard');
  };

  const handleLogout = async () => {
    try {
        await (window as any).axios.post('/api/logout');
        localStorage.removeItem('token');
        setUserRole(null);
        navigate('/');
    } catch (error) {
        console.error("Logout failed", error);
    }
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: UserRole }) => {
    if (!userRole) return <Navigate to="/login" replace />;
    if (userRole !== allowedRole) return <Navigate to="/" replace />;
    return <>{children}</>;
  };

  if (isAuthLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={
        userRole ? (
           userRole === 'student' ? <Navigate to="/student/dashboard" replace /> :
           userRole === 'lecturer' ? <Navigate to="/lecturer/dashboard" replace /> :
           <Navigate to="/head/dashboard" replace />
        ) : (
          <LoginPage onLogin={handleLogin} />
        )
      } />
      
      {/* Student Routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute allowedRole="student">
          <StudentDashboard
            onNavigateToSearch={() => navigate('/student/search')}
            onNavigateToStatus={() => navigate('/student/status')}
            onLogout={handleLogout}
          />
        </ProtectedRoute>
      } />
      <Route path="/student/search" element={
        <ProtectedRoute allowedRole="student">
          <LecturerSearch
            onSubmit={() => navigate('/student/dashboard')}
            onBack={() => navigate('/student/dashboard')}
            hasActiveSubmission={false} // This component now handles this check internally or via API status in dashboard
          />
        </ProtectedRoute>
      } />
      <Route path="/student/status" element={
        <ProtectedRoute allowedRole="student">
          <SubmissionStatus
            onBack={() => navigate('/student/dashboard')}
            onCancel={() => navigate('/student/dashboard')}
          />
        </ProtectedRoute>
      } />

      {/* Lecturer Routes (Placeholder for now) */}
      <Route path="/lecturer/dashboard" element={
        <ProtectedRoute allowedRole="lecturer">
            <LecturerDashboard
            onNavigateToProfile={() => navigate('/lecturer/profile')} // Assume this route exists
            onNavigateToApplicants={() => navigate('/lecturer/applicants')} // Assume this route exists
            onLogout={handleLogout}
          />
        </ProtectedRoute>
      } />
       <Route path="/lecturer/profile" element={
        <ProtectedRoute allowedRole="lecturer">
            <LecturerProfile
            onBack={() => navigate('/lecturer/dashboard')}
          />
        </ProtectedRoute>
      } />
        <Route path="/lecturer/applicants" element={
        <ProtectedRoute allowedRole="lecturer">
          <ApplicantList
            onBack={() => navigate('/lecturer/dashboard')}
          />
        </ProtectedRoute>
      } />


      {/* Head Routes (Placeholder for now) */}
      <Route path="/head/dashboard" element={
        <ProtectedRoute allowedRole="head">
           <HeadDashboard
            onNavigateToQuotaApproval={() => navigate('/head/quota-approval')}
            onNavigateToDistribution={() => navigate('/head/distribution')}
            onLogout={handleLogout}
          />
        </ProtectedRoute>
      } />
        <Route path="/head/quota-approval" element={
        <ProtectedRoute allowedRole="head">
          <QuotaApproval
            onBack={() => navigate('/head/dashboard')}
          />
        </ProtectedRoute>
      } />
        <Route path="/head/distribution" element={
        <ProtectedRoute allowedRole="head">
          <DistributionMonitoring
            onBack={() => navigate('/head/dashboard')}
          />
        </ProtectedRoute>
      } />

    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}
