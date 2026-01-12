import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { 
  Home, 
  Search, 
  FileText, 
  LogOut, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Bell
} from "lucide-react";
import type { Submission } from "../App";

interface StudentDashboardProps {
  submission: Submission | null;
  notifications: string[];
  onNavigateToSearch: () => void;
  onNavigateToStatus: () => void;
  onLogout: () => void;
}

export function StudentDashboard({
  submission,
  notifications,
  onNavigateToSearch,
  onNavigateToStatus,
  onLogout,
}: StudentDashboardProps) {
  const getStatusInfo = () => {
    if (!submission) {
      return {
        label: "Not Submitted",
        description: "You haven't submitted any thesis guidance application yet.",
        icon: AlertCircle,
        variant: "secondary" as const,
        color: "text-gray-600",
      };
    }

    switch (submission.status) {
      case "pending":
        return {
          label: "Pending Review",
          description: "Your application is waiting for lecturer approval.",
          icon: Clock,
          variant: "default" as const,
          color: "text-yellow-600",
        };
      case "approved":
        return {
          label: "Approved",
          description: "Your thesis guidance application has been approved!",
          icon: CheckCircle,
          variant: "default" as const,
          color: "text-green-600",
        };
      case "rejected":
        return {
          label: "Rejected",
          description: "Your application was not approved. You can submit a new application.",
          icon: XCircle,
          variant: "destructive" as const,
          color: "text-red-600",
        };
      default:
        return {
          label: "Not Submitted",
          description: "You haven't submitted any thesis guidance application yet.",
          icon: AlertCircle,
          variant: "secondary" as const,
          color: "text-gray-600",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

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
                <h1>Student Dashboard</h1>
                <p className="text-gray-500">Thesis Guidance System</p>
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
        <div className="grid gap-6 md:grid-cols-3">
          {/* Status Card */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Current status of your thesis guidance application</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`p-3 rounded-full bg-white ${statusInfo.color}`}>
                    <StatusIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3>{statusInfo.label}</h3>
                      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{statusInfo.description}</p>
                    {submission && (
                      <div className="space-y-1 text-gray-700">
                        <p><span className="font-medium">Lecturer:</span> {submission.lecturerName}</p>
                        <p><span className="font-medium">Title:</span> {submission.title}</p>
                        <p><span className="font-medium">Submitted:</span> {submission.submittedDate}</p>
                      </div>
                    )}
                  </div>
                </div>

                {submission && submission.status === "pending" && (
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={onNavigateToStatus}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Detailed Status
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Navigation Menu */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Navigate to different sections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button 
                    className="w-full justify-start h-auto py-4"
                    variant="outline"
                    onClick={onNavigateToSearch}
                    disabled={submission?.status === "pending"}
                  >
                    <Search className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div>Search Lecturers</div>
                      <div className="text-gray-500">Find your thesis supervisor</div>
                    </div>
                  </Button>
                  <Button 
                    className="w-full justify-start h-auto py-4"
                    variant="outline"
                    onClick={onNavigateToStatus}
                    disabled={!submission}
                  >
                    <FileText className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div>My Status</div>
                      <div className="text-gray-500">Track application progress</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notifications</span>
                </CardTitle>
                <CardDescription>Recent updates and messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500">No new notifications</p>
                  ) : (
                    notifications.slice(-5).reverse().map((notification, index) => (
                      <Alert key={index}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Update</AlertTitle>
                        <AlertDescription>{notification}</AlertDescription>
                      </Alert>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
