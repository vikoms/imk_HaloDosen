import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  LogOut, 
  Users, 
  UserCheck, 
  Clock,
  CheckCircle,
  Settings,
  ChevronRight,
  BarChart3
} from "lucide-react";

interface LecturerDashboardProps {
  onNavigateToProfile: () => void;
  onNavigateToApplicants: () => void;
  onLogout: () => void;
}

interface DashboardData {
    profile: {
        name: string;
        nidn: string;
        current_quota: number;
        is_active: boolean;
        skills: { name: string }[];
    };
    quota_usage: {
        total: number;
        filled: number;
        remaining: number;
    };
    applicants: {
        id: number;
        title: string;
        status: string;
        created_at: string;
        student: {
            user: {
                name: string;
            };
        };
    }[];
}

export function LecturerDashboard({
  onNavigateToProfile,
  onNavigateToApplicants,
  onLogout,
}: LecturerDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const profileRes = await (window as any).axios.get('/api/lecturer/profile');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const applicantsRes = await (window as any).axios.get('/api/lecturer/applicants');

            setData({
                profile: profileRes.data.data.profile,
                quota_usage: profileRes.data.data.quota_usage,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                applicants: applicantsRes.data.data.map((app: any) => ({
                    id: app.id,
                    title: app.title,
                    status: app.status,
                    created_at: app.created_at, // Consider formatting date
                    student: app.student
                }))
            });
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

  if (loading || !data) {
      return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  const pendingCount = data.applicants.filter(app => app.status === "pending").length;
  const approvedCount = data.quota_usage.filled;
  const remainingQuota = data.quota_usage.remaining;

  const stats = [
    {
      title: "Total Kuota",
      value: data.quota_usage.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Kuota Terisi",
      value: approvedCount,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Sisa Kuota",
      value: remainingQuota,
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Permohonan Menunggu",
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
              <div className="h-10 w-10 flex items-center justify-center overflow-hidden">
                <img src="/images/logo.png" alt="HaloDosen" className="h-full w-full object-contain" />
              </div>
              <div>
                <h1 className="font-semibold text-lg text-gray-900">HaloDosen</h1>
                <p className="text-sm text-gray-500">Dashboard Dosen</p>
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

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToApplicants}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-indigo-600" />
                  <span>Persetujuan Mahasiswa</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardTitle>
              <CardDescription>Tinjau dan kelola permohonan mahasiswa</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingCount > 0 ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="default">{pendingCount} Menunggu</Badge>
                  <p className="text-gray-600">
                    {pendingCount === 1 ? "permohonan" : "permohonan"} menunggu tinjauan Anda
                  </p>
                </div>
              ) : (
                <p className="text-gray-600">Tidak ada permohonan tertunda saat ini</p>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onNavigateToProfile}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-indigo-600" />
                  <span>Pengaturan Profil & Kuota</span>
                </span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardTitle>
              <CardDescription>Kelola keahlian dan preferensi kuota Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {/* Status Kuota logic can be added later if needed from API */}
                </div>
                <p className="text-gray-600">
                  {data.profile.skills.length} keahlian terdaftar
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applicants */}
        <Card>
          <CardHeader>
            <CardTitle>Permohonan Terbaru</CardTitle>
            <CardDescription>Permohonan mahasiswa terkini</CardDescription>
          </CardHeader>
          <CardContent>
            {data.applicants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Belum ada permohonan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.applicants.slice(0, 5).map((applicant) => (
                  <div
                    key={applicant.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <p>{applicant.student.user.name}</p>
                        <Badge
                          variant={
                            applicant.status === "approved"
                              ? "default"
                              : applicant.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {applicant.status === "approved" ? "Disetujui" : applicant.status === "rejected" ? "Ditolak" : "Menunggu"}
                        </Badge>
                      </div>
                      <p className="text-gray-600">{applicant.title}</p>
                      <p className="text-gray-500">Diajukan: {new Date(applicant.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {data.applicants.length > 5 && (
                  <Button variant="outline" className="w-full" onClick={onNavigateToApplicants}>
                    Lihat Semua Permohonan
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
