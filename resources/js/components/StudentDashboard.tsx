import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { 
  Search, 
  FileText, 
  LogOut, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Bell
} from "lucide-react";

interface StudentDashboardProps {
  onNavigateToSearch: () => void;
  onNavigateToStatus: () => void;
  onLogout: () => void;
}

interface SubmissionData {
  id: string;
  lecturerName: string;
  title: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
}

export function StudentDashboard({
  onNavigateToSearch,
  onNavigateToStatus,
  onLogout,
}: StudentDashboardProps) {
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch Submission
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const submissionRes = await (window as any).axios.get('/api/student/submission');
            const subData = submissionRes.data.data;

            
            if (subData) {
                setSubmission({
                    id: subData.id,
                    lecturerName: subData.lecturer_name,
                    title: subData.title,
                    status: subData.status,
                    submittedDate: new Date(subData.created_at).toLocaleDateString()
                });
            }
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const getStatusInfo = () => {
    if (!submission) {
      return {
        label: "Belum Mengajukan",
        description: "Anda belum mengajukan permohonan bimbingan skripsi.",
        icon: AlertCircle,
        variant: "secondary" as const,
        color: "text-gray-600",
      };
    }

    switch (submission.status) {
      case "pending":
        return {
          label: "Menunggu Peninjauan",
          description: "Permohonan Anda sedang menunggu persetujuan dosen.",
          icon: Clock,
          variant: "default" as const,
          color: "text-yellow-600",
        };
      case "approved":
        return {
          label: "Disetujui",
          description: "Permohonan bimbingan skripsi Anda telah disetujui!",
          icon: CheckCircle,
          variant: "default" as const,
          color: "text-green-600",
        };
      case "rejected":
        return {
          label: "Ditolak",
          description: "Permohonan Anda tidak disetujui. Anda dapat mengajukan permohonan baru.",
          icon: XCircle,
          variant: "destructive" as const,
          color: "text-red-600",
        };
      default:
        return {
          label: "Belum Mengajukan",
          description: "Anda belum mengajukan permohonan bimbingan skripsi.",
          icon: AlertCircle,
          variant: "secondary" as const,
          color: "text-gray-600",
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  if (loading) return <div>Loading...</div>;

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
                <p className="text-sm text-gray-500">Dashboard Mahasiswa</p>
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
        <div className="grid gap-6 md:grid-cols-3">
          {/* Status Card */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Status Permohonan</CardTitle>
                <CardDescription>Status terkini permohonan bimbingan skripsi Anda</CardDescription>
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
                        <p><span className="font-medium">Dosen:</span> {submission.lecturerName}</p>
                        <p><span className="font-medium">Judul:</span> {submission.title}</p>
                        <p><span className="font-medium">Diajukan Pada:</span> {submission.submittedDate}</p>
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
                    Lihat Status Lengkap
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Navigation Menu */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
                <CardDescription>Navigasi ke bagian lain</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button 
                    className="w-full justify-start h-auto py-4"
                    variant="outline"
                    onClick={onNavigateToSearch}
                    disabled={submission?.status === "pending" || submission?.status === "approved"}
                  >
                    <Search className="h-5 w-5 mr-3" />
                    <div className="text-left">
                      <div>Cari Dosen</div>
                      <div className="text-gray-500">Temukan pembimbing skripsi Anda</div>
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
                      <div>Status Saya</div>
                      <div className="text-gray-500">Pantau perkembangan permohonan</div>
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
                  <span>Notifikasi</span>
                </CardTitle>
                <CardDescription>Pembaruan dan pesan terbaru</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                    <p className="text-gray-500">Tidak ada notifikasi baru</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
