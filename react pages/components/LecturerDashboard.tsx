import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Home, 
  LogOut, 
  Users, 
  UserCheck, 
  Clock,
  CheckCircle,
  Settings,
  ChevronRight,
  BarChart3
} from "lucide-react";
import type { LecturerData, Applicant } from "../App";

interface LecturerDashboardProps {
  lecturerData: LecturerData;
  applicants: Applicant[];
  onNavigateToProfile: () => void;
  onNavigateToApplicants: () => void;
  onLogout: () => void;
}

export function LecturerDashboard({
  lecturerData,
  applicants,
  onNavigateToProfile,
  onNavigateToApplicants,
  onLogout,
}: LecturerDashboardProps) {
  const pendingCount = applicants.filter(app => app.status === "pending").length;
  const approvedCount = applicants.filter(app => app.status === "approved").length;
  const remainingQuota = lecturerData.approvedQuota - approvedCount;

  const stats = [
    {
      title: "Total Quota",
      value: lecturerData.approvedQuota,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Quota Filled",
      value: approvedCount,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Remaining Quota",
      value: remainingQuota,
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Pending Applicants",
      value: pendingCount,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1>Lecturer Dashboard</h1>
                <p className="text-gray-500">Welcome, {lecturerData.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 mb-1">{stat.title}</p>
                      <p className={stat.color}>{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToApplicants}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-indigo-600" />
                  <span>Student Approval</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardTitle>
              <CardDescription>Review and manage student applications</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingCount > 0 ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="default">{pendingCount} Pending</Badge>
                  <p className="text-gray-600">
                    {pendingCount === 1 ? "application" : "applications"} waiting for your review
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">No pending applications at the moment</p>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToProfile}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-indigo-600" />
                  <span>Profile & Quota Settings</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardTitle>
              <CardDescription>Manage your expertise and quota preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Quota Status:</p>
                  <Badge
                    variant={
                      lecturerData.quotaStatus === "approved"
                        ? "default"
                        : lecturerData.quotaStatus === "rejected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {lecturerData.quotaStatus.charAt(0).toUpperCase() + lecturerData.quotaStatus.slice(1)}
                  </Badge>
                </div>
                <p className="text-gray-600">
                  {lecturerData.skills.length} skill{lecturerData.skills.length !== 1 ? "s" : ""} listed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applicants */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applicants</CardTitle>
            <CardDescription>Latest student applications</CardDescription>
          </CardHeader>
          <CardContent>
            {applicants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No applications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.slice(0, 5).map((applicant) => (
                  <div
                    key={applicant.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <p>{applicant.studentName}</p>
                        <Badge
                          variant={
                            applicant.status === "approved"
                              ? "default"
                              : applicant.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{applicant.title}</p>
                      <p className="text-gray-500">Submitted: {applicant.submittedDate}</p>
                    </div>
                  </div>
                ))}
                {applicants.length > 5 && (
                  <Button variant="outline" className="w-full" onClick={onNavigateToApplicants}>
                    View All Applications
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
