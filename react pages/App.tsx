import { useState } from "react";
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

export interface QuotaRequest {
  id: string;
  lecturerId: string;
  lecturerName: string;
  nidn: string;
  requestedQuota: number;
  approvedQuota: number;
  currentFilled: number;
  status: "pending" | "approved" | "rejected";
}

export interface StudentDistribution {
  studentId: string;
  studentName: string;
  hasAssignment: boolean;
  assignedLecturerId?: string;
  assignedLecturerName?: string;
}

export default function App() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  
  // Student state
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to the thesis guidance system!",
  ]);

  // Lecturer state
  const [lecturerData, setLecturerData] = useState<LecturerData>({
    id: "1",
    name: "Dr. Sarah Johnson",
    nidn: "0123456789",
    skills: ["Machine Learning", "Data Science", "AI"],
    requestedQuota: 10,
    approvedQuota: 10,
    quotaStatus: "approved",
  });

  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: "1",
      studentId: "STD001",
      studentName: "John Doe",
      title: "Deep Learning for Image Classification",
      description: "This research aims to develop a deep learning model for accurate image classification using convolutional neural networks.",
      submittedDate: "2024-01-15",
      status: "pending",
    },
    {
      id: "2",
      studentId: "STD002",
      studentName: "Jane Smith",
      title: "Natural Language Processing for Sentiment Analysis",
      description: "A study on implementing NLP techniques to analyze sentiment in social media data.",
      submittedDate: "2024-01-16",
      status: "pending",
    },
    {
      id: "3",
      studentId: "STD003",
      studentName: "Mike Johnson",
      title: "Predictive Analytics for Business Intelligence",
      description: "Research on using machine learning algorithms for business forecasting and decision-making.",
      submittedDate: "2024-01-14",
      status: "approved",
    },
    {
      id: "4",
      studentId: "STD004",
      studentName: "Emily Davis",
      title: "Computer Vision for Autonomous Vehicles",
      description: "Developing computer vision systems for object detection in self-driving cars.",
      submittedDate: "2024-01-13",
      status: "rejected",
      rejectionReason: "Topic does not align with my current research focus.",
    },
  ]);

  // Head of Study Program state
  const [quotaRequests, setQuotaRequests] = useState<QuotaRequest[]>([
    {
      id: "1",
      lecturerId: "L001",
      lecturerName: "Dr. Sarah Johnson",
      nidn: "0123456789",
      requestedQuota: 12,
      approvedQuota: 10,
      currentFilled: 7,
      status: "pending",
    },
    {
      id: "2",
      lecturerId: "L002",
      lecturerName: "Prof. Michael Chen",
      nidn: "0987654321",
      requestedQuota: 10,
      approvedQuota: 8,
      currentFilled: 8,
      status: "approved",
    },
    {
      id: "3",
      lecturerId: "L003",
      lecturerName: "Dr. Emily Rodriguez",
      nidn: "1122334455",
      requestedQuota: 15,
      approvedQuota: 10,
      currentFilled: 5,
      status: "approved",
    },
    {
      id: "4",
      lecturerId: "L004",
      lecturerName: "Dr. David Kim",
      nidn: "5544332211",
      requestedQuota: 8,
      approvedQuota: 12,
      currentFilled: 10,
      status: "approved",
    },
    {
      id: "5",
      lecturerId: "L005",
      lecturerName: "Prof. Amanda Taylor",
      nidn: "6677889900",
      requestedQuota: 10,
      approvedQuota: 10,
      currentFilled: 9,
      status: "approved",
    },
  ]);

  const [students, setStudents] = useState<StudentDistribution[]>([
    { studentId: "STD001", studentName: "John Doe", hasAssignment: true, assignedLecturerId: "L001", assignedLecturerName: "Dr. Sarah Johnson" },
    { studentId: "STD002", studentName: "Jane Smith", hasAssignment: true, assignedLecturerId: "L001", assignedLecturerName: "Dr. Sarah Johnson" },
    { studentId: "STD003", studentName: "Mike Johnson", hasAssignment: true, assignedLecturerId: "L002", assignedLecturerName: "Prof. Michael Chen" },
    { studentId: "STD004", studentName: "Emily Davis", hasAssignment: false },
    { studentId: "STD005", studentName: "Robert Brown", hasAssignment: true, assignedLecturerId: "L003", assignedLecturerName: "Dr. Emily Rodriguez" },
    { studentId: "STD006", studentName: "Sarah Wilson", hasAssignment: false },
    { studentId: "STD007", studentName: "David Lee", hasAssignment: false },
    { studentId: "STD008", studentName: "Lisa Anderson", hasAssignment: true, assignedLecturerId: "L004", assignedLecturerName: "Dr. David Kim" },
  ]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage("dashboard");
  };

  // Student handlers
  const handleSubmitApplication = (newSubmission: Submission) => {
    setSubmission(newSubmission);
    setNotifications(prev => [...prev, `Application submitted to ${newSubmission.lecturerName}`]);
    setCurrentPage("dashboard");
  };

  const handleCancelSubmission = () => {
    if (submission) {
      setSubmission(null);
      setNotifications(prev => [...prev, "Application has been cancelled"]);
    }
  };

  // Lecturer handlers
  const handleUpdateProfile = (data: { skills: string[]; requestedQuota: number }) => {
    setLecturerData(prev => ({
      ...prev,
      skills: data.skills,
      requestedQuota: data.requestedQuota,
      quotaStatus: "pending",
    }));
  };

  const handleApplicantAction = (applicantId: string, action: "approve" | "reject", reason?: string) => {
    setApplicants(prev =>
      prev.map(app => {
        if (app.id === applicantId) {
          return {
            ...app,
            status: action === "approve" ? "approved" : "rejected",
            rejectionReason: reason,
          };
        }
        return app;
      })
    );
  };

  // Head handlers
  const handleUpdateQuota = (requestId: string, approvedQuota: number) => {
    setQuotaRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          return { ...req, approvedQuota };
        }
        return req;
      })
    );
  };

  const handleApproveQuota = (requestId: string) => {
    setQuotaRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          return { ...req, status: "approved" };
        }
        return req;
      })
    );
  };

  const handleApproveAllQuotas = () => {
    setQuotaRequests(prev =>
      prev.map(req => ({ ...req, status: "approved" }))
    );
  };

  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Student Module
  if (userRole === "student") {
    return (
      <>
        {currentPage === "dashboard" && (
          <StudentDashboard
            submission={submission}
            notifications={notifications}
            onNavigateToSearch={() => setCurrentPage("search")}
            onNavigateToStatus={() => setCurrentPage("status")}
            onLogout={handleLogout}
          />
        )}
        {currentPage === "search" && (
          <LecturerSearch
            onSubmit={handleSubmitApplication}
            onBack={() => setCurrentPage("dashboard")}
            hasActiveSubmission={submission?.status === "pending"}
          />
        )}
        {currentPage === "status" && (
          <SubmissionStatus
            submission={submission}
            onBack={() => setCurrentPage("dashboard")}
            onCancel={handleCancelSubmission}
          />
        )}
      </>
    );
  }

  // Lecturer Module
  if (userRole === "lecturer") {
    return (
      <>
        {currentPage === "dashboard" && (
          <LecturerDashboard
            lecturerData={lecturerData}
            applicants={applicants}
            onNavigateToProfile={() => setCurrentPage("profile")}
            onNavigateToApplicants={() => setCurrentPage("applicants")}
            onLogout={handleLogout}
          />
        )}
        {currentPage === "profile" && (
          <LecturerProfile
            lecturerData={lecturerData}
            onUpdateProfile={handleUpdateProfile}
            onBack={() => setCurrentPage("dashboard")}
          />
        )}
        {currentPage === "applicants" && (
          <ApplicantList
            applicants={applicants}
            onApplicantAction={handleApplicantAction}
            onBack={() => setCurrentPage("dashboard")}
          />
        )}
      </>
    );
  }

  // Head of Study Program Module
  if (userRole === "head") {
    return (
      <>
        {currentPage === "dashboard" && (
          <HeadDashboard
            quotaRequests={quotaRequests}
            students={students}
            onNavigateToQuotaApproval={() => setCurrentPage("quota-approval")}
            onNavigateToDistribution={() => setCurrentPage("distribution")}
            onLogout={handleLogout}
          />
        )}
        {currentPage === "quota-approval" && (
          <QuotaApproval
            quotaRequests={quotaRequests}
            onUpdateQuota={handleUpdateQuota}
            onApproveQuota={handleApproveQuota}
            onApproveAll={handleApproveAllQuotas}
            onBack={() => setCurrentPage("dashboard")}
          />
        )}
        {currentPage === "distribution" && (
          <DistributionMonitoring
            quotaRequests={quotaRequests}
            students={students}
            onBack={() => setCurrentPage("dashboard")}
          />
        )}
      </>
    );
  }

  return null;
}
