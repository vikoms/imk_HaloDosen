import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Progress } from "./ui/progress";
import { 
  Home, 
  LogOut, 
  Users, 
  UserCheck, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  ChevronRight,
  BarChart3,
  FileCheck
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { QuotaRequest, StudentDistribution } from "../App";

interface HeadDashboardProps {
  quotaRequests: QuotaRequest[];
  students: StudentDistribution[];
  onNavigateToQuotaApproval: () => void;
  onNavigateToDistribution: () => void;
  onLogout: () => void;
}

export function HeadDashboard({
  quotaRequests,
  students,
  onNavigateToQuotaApproval,
  onNavigateToDistribution,
  onLogout,
}: HeadDashboardProps) {
  const totalQuota = quotaRequests.reduce((sum, req) => sum + req.approvedQuota, 0);
  const totalFilled = quotaRequests.reduce((sum, req) => sum + req.currentFilled, 0);
  const totalStudents = students.length;
  const assignedStudents = students.filter(s => s.hasAssignment).length;
  const unassignedStudents = totalStudents - assignedStudents;
  const pendingQuotaRequests = quotaRequests.filter(req => req.status === "pending").length;

  // Lecturers not filling quota
  const underfilledLecturers = quotaRequests.filter(req => {
    const fillRate = (req.currentFilled / req.approvedQuota) * 100;
    return fillRate < 50 && req.approvedQuota > 0;
  });

  // Chart data for quota vs students
  const chartData = [
    {
      name: "Capacity",
      "Total Quota": totalQuota,
      "Assigned Students": assignedStudents,
    },
  ];

  // Pie chart data
  const pieData = [
    { name: "Assigned", value: assignedStudents, color: "#4f46e5" },
    { name: "Unassigned", value: unassignedStudents, color: "#ef4444" },
  ];

  const stats = [
    {
      title: "Total Quota Capacity",
      value: totalQuota,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Students Assigned",
      value: assignedStudents,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Unassigned Students",
      value: unassignedStudents,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Pending Requests",
      value: pendingQuotaRequests,
      icon: FileCheck,
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
                <h1>Head of Study Program Dashboard</h1>
                <p className="text-gray-500">Operational monitoring and management</p>
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

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                <span>Quota Availability vs Students</span>
              </CardTitle>
              <CardDescription>Total capacity compared to current assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Total Quota" fill="#4f46e5" />
                  <Bar dataKey="Assigned Students" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-semibold">Utilization Rate:</span>{" "}
                  {totalQuota > 0 ? Math.round((assignedStudents / totalQuota) * 100) : 0}%
                </p>
                <p className="text-gray-600">
                  {totalQuota - assignedStudents} slots remaining
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <span>Student Distribution</span>
              </CardTitle>
              <CardDescription>Assignment status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <p className="text-gray-600">Assigned</p>
                  <p className="text-blue-600">{assignedStudents}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <p className="text-gray-600">Unassigned</p>
                  <p className="text-red-600">{unassignedStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        {underfilledLecturers.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Quota Utilization Alert</AlertTitle>
            <AlertDescription>
              {underfilledLecturers.length} lecturer{underfilledLecturers.length !== 1 ? "s have" : " has"} not filled their quota:
              <ul className="mt-2 list-disc list-inside">
                {underfilledLecturers.slice(0, 3).map((lecturer) => (
                  <li key={lecturer.id}>
                    {lecturer.lecturerName}: {lecturer.currentFilled}/{lecturer.approvedQuota} filled (
                    {Math.round((lecturer.currentFilled / lecturer.approvedQuota) * 100)}%)
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToQuotaApproval}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-indigo-600" />
                  <span>Quota Approval</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardTitle>
              <CardDescription>Review and approve lecturer quota requests</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingQuotaRequests > 0 ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="default">{pendingQuotaRequests} Pending</Badge>
                  <p className="text-gray-600">
                    {pendingQuotaRequests === 1 ? "request" : "requests"} waiting for approval
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">All quota requests have been processed</p>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToDistribution}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span>Distribution Monitoring</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardTitle>
              <CardDescription>Monitor student assignment distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Overall Progress:</p>
                  <p>{Math.round((assignedStudents / totalStudents) * 100)}%</p>
                </div>
                <Progress value={(assignedStudents / totalStudents) * 100} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Quota Status Overview</CardTitle>
            <CardDescription>Summary of all lecturer quotas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quotaRequests.slice(0, 5).map((request) => {
                const fillRate = (request.currentFilled / request.approvedQuota) * 100;
                return (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <p>{request.lecturerName}</p>
                        <Badge
                          variant={
                            request.status === "approved"
                              ? "default"
                              : request.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-gray-600">
                          <span>
                            {request.currentFilled} / {request.approvedQuota} filled
                          </span>
                          <span>{Math.round(fillRate)}%</span>
                        </div>
                        <Progress value={fillRate} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
