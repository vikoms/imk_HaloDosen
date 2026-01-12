import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Progress } from "./ui/progress";
import { 
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

interface HeadDashboardProps {
  onNavigateToQuotaApproval: () => void;
  onNavigateToDistribution: () => void;
  onLogout: () => void;
}

interface QuotaRequest {
  id: string;
  lecturer_name: string;
  nidn: string;
  current_quota: number;
  filled_quota: number; // approved submissions count
  requested_quota: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface DistributionStats {
    total_students: number;
    with_topic: number;
    without_topic: number;
}

interface LecturerStats {
    id: number;
    name: string;
    quota: number;
    filled: number;
    available: number;
    percentage: number;
}


export function HeadDashboard({
  onNavigateToQuotaApproval,
  onNavigateToDistribution,
  onLogout,
}: HeadDashboardProps) {
  const [quotaRequests, setQuotaRequests] = useState<QuotaRequest[]>([]);
  const [distributionStats, setDistributionStats] = useState<DistributionStats | null>(null);
  const [lecturers, setLecturers] = useState<LecturerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch Quota Requests
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const quotaRes = await (window as any).axios.get('/api/head/quota-requests');
            setQuotaRequests(quotaRes.data.data);

            // Fetch Distribution Stats
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const distRes = await (window as any).axios.get('/api/head/distribution');
            setDistributionStats(distRes.data.data.stats);
            setLecturers(distRes.data.data.lecturers);

        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Calculate derived stats for dashboard
  const totalQuota = lecturers.reduce((sum, l) => sum + l.quota, 0);
  
  const totalStudents = distributionStats?.total_students || 0;
  const assignedStudents = distributionStats?.with_topic || 0;
  const unassignedStudents = distributionStats?.without_topic || 0;
  
  const pendingQuotaRequests = quotaRequests.length; // API filters only pending by default for getQuotaRequests but let's check response structure. 
  // Wait, my controller getQuotaRequests returns ONLY "pending" requests. 
  // So `quotaRequests.length` is physically the number of pending requests.
  
  // Lecturers not filling quota
  const underfilledLecturers = lecturers.filter(l => {
    return l.percentage < 50 && l.quota > 0;
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
    { name: "Ditugaskan", value: assignedStudents, color: "#4f46e5" },
    { name: "Belum Ditugaskan", value: unassignedStudents, color: "#ef4444" },
  ];

  const stats = [
    {
      title: "Total Kapasitas Kuota",
      value: totalQuota,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Mahasiswa Ditugaskan",
      value: assignedStudents,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Mahasiswa Belum Ditugaskan",
      value: unassignedStudents,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Permohonan Menunggu",
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
              <div className="h-10 w-10 flex items-center justify-center overflow-hidden">
                <img src="/images/logo.png" alt="HaloDosen" className="h-full w-full object-contain" />
              </div>
              <div>
                <h1 className="font-semibold text-lg text-gray-900">HaloDosen</h1>
                <p className="text-sm text-gray-500">Dashboard Kaprodi</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
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
                <span>Ketersediaan Kuota vs Mahasiswa</span>
              </CardTitle>
              <CardDescription>Total kapasitas dibandingkan dengan penugasan saat ini</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Total Quota" fill="#4f46e5" name="Total Kuota" />
                  <Bar dataKey="Assigned Students" fill="#10b981" name="Mahasiswa Ditugaskan" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-semibold">Tingkat Penggunaan:</span>{" "}
                  {totalQuota > 0 ? Math.round((assignedStudents / totalQuota) * 100) : 0}%
                </p>
                <p className="text-gray-600">
                  {totalQuota - assignedStudents} slot tersisa
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <span>Distribusi Mahasiswa</span>
              </CardTitle>
              <CardDescription>Rincian status penugasan</CardDescription>
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
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
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
                  <p className="text-gray-600">Ditugaskan</p>
                  <p className="text-blue-600">{assignedStudents}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <p className="text-gray-600">Belum Ditugaskan</p>
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
            <AlertTitle>Peringatan Penggunaan Kuota</AlertTitle>
            <AlertDescription>
              {underfilledLecturers.length} dosen belum memenuhi kuota mereka:
              <ul className="mt-2 list-disc list-inside">
                {underfilledLecturers.slice(0, 3).map((lecturer) => (
                  <li key={lecturer.id}>
                    {lecturer.name}: {lecturer.filled}/{lecturer.quota} terisi (
                    {lecturer.percentage}%)
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
                  <span>Persetujuan Kuota</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardTitle>
              <CardDescription>Tinjau dan setujui permohonan kuota dosen</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingQuotaRequests > 0 ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="default">{pendingQuotaRequests} Menunggu</Badge>
                  <p className="text-gray-600">
                    {pendingQuotaRequests === 1 ? "permohonan" : "permohonan"} menunggu persetujuan
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">Semua permohonan kuota telah diproses</p>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToDistribution}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span>Pemantauan Distribusi</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardTitle>
              <CardDescription>Pantau distribusi penugasan mahasiswa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Kemajuan Keseluruhan:</p>
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
            <CardTitle>Ringkasan Status Kuota</CardTitle>
            <CardDescription>Ringkasan kuota semua dosen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quotaRequests.slice(0, 5).map((request) => {
                return (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <p>{request.lecturer_name}</p>
                        <Badge
                          variant={
                            request.status === "approved"
                              ? "default"
                              : request.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {request.status === "approved" ? "Disetujui" : request.status === "rejected" ? "Ditolak" : "Menunggu"}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-gray-600">
                          <span>
                            Permintaan: {request.requested_quota} (Saat ini: {request.current_quota})
                          </span>
                        </div>
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
