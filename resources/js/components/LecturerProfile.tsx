import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ArrowLeft, Settings, Plus, X, CheckCircle, Clock, XCircle } from "lucide-react";

interface LecturerProfileProps {
  onBack: () => void;
}

interface ProfileData {
    name: string;
    nidn: string;
    skills: { name: string, slug: string }[]; 
    current_quota: number;
    quota_status: string; 
}

export function LecturerProfile({ onBack }: LecturerProfileProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [requestedQuota, setRequestedQuota] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quotaRequestStatus, setQuotaRequestStatus] = useState<string>("approved"); // Default or fetched

  useEffect(() => {
    const fetchData = async () => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await (window as any).axios.get('/api/lecturer/profile');
            const data = response.data.data;
            
            setProfile({
                name: data.profile.user?.name || data.user.name,
                nidn: data.profile.nidn,
                skills: data.profile.skills,
                current_quota: data.profile.current_quota,
                quota_status: "approved" // Placeholder, need API support for this if critical
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setSkills(data.profile.skills.map((s: any) => s.name));
            setRequestedQuota(data.profile.current_quota.toString());
        } catch (error) {
           console.error("Error fetching profile", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
        // Update Profile (Skills)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (window as any).axios.put('/api/lecturer/profile', {
            skills: skills
        });

        // Request Quota if changed
        const quota = parseInt(requestedQuota);
        if (profile && quota !== profile.current_quota) {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             await (window as any).axios.post('/api/lecturer/quota-request', {
                 requested_quota: quota
             });
             alert("Profil diperbarui dan permintaan kuota telah dikirim.");
             setQuotaRequestStatus("pending"); // Optimistic update
        } else {
            alert("Profil berhasil diperbarui!");
        }

    } catch (error) {
        console.error("Error updating profile", error);
        alert("Gagal memperbarui profil.");
    } finally {
        setIsSaving(false);
    }
  };

  if (loading || !profile) return <div>Loading...</div>;

  const getStatusInfo = () => {
    // This part is a bit tricky without real status from API, defaulting to "approved" or local state
    // Ideally we fetch the latest quota request status.
    switch (quotaRequestStatus) {
      case "approved":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          message: "Kuota saat ini aktif.",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          message: "Permohonan kuota Anda ditolak.",
        };
      default:
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          message: "Permohonan kuota Anda sedang menunggu persetujuan.",
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
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1>Pengaturan Profil & Kuota</h1>
                <p className="text-gray-500">Kelola keahlian dan preferensi kuota Anda</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lecturer Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informasi Dosen</CardTitle>
            <CardDescription>Detail profil dasar Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-gray-600">Nama</p>
                <p>{profile.name}</p>
              </div>
              <div>
                <p className="text-gray-600">NIDN</p>
                <p>{profile.nidn}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Keahlian & Keterampilan</CardTitle>
            <CardDescription>Tambahkan tag yang mewakili bidang keahlian Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1">
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {skills.length === 0 && (
                  <p className="text-gray-500">Belum ada keahlian yang ditambahkan</p>
                )}
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Tambahkan keterampilan (contoh: AI, Data Mining, Pengembangan Web)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  />
                </div>
                <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quota Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pengaturan Kuota</CardTitle>
            <CardDescription>Tetapkan jumlah maksimum mahasiswa yang dapat Anda bimbing semester ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="requestedQuota">Kuota yang Diajukan</Label>
                  <Input
                    id="requestedQuota"
                    type="number"
                    min="0"
                    max="20"
                    value={requestedQuota}
                    onChange={(e) => setRequestedQuota(e.target.value)}
                    placeholder="Masukkan jumlah kuota"
                  />
                  <p className="text-gray-500 mt-1">Maksimal mahasiswa yang ingin Anda bimbing</p>
                </div>
                <div>
                  <Label>Kuota Saat Ini Disetujui</Label>
                  <div className="p-3 bg-gray-50 rounded-md border mt-2">
                    <p className="text-indigo-600">{profile.current_quota} mahasiswa</p>
                  </div>
                  <p className="text-gray-500 mt-1">Saat ini disetujui oleh Kaprodi</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quota Approval Status */}
        <Alert className={`${statusInfo.bgColor} ${statusInfo.borderColor} mb-6`}>
          <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
          <AlertTitle className={statusInfo.color}>
            Info Kuota
          </AlertTitle>
          <AlertDescription>{statusInfo.message}</AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
          <Button variant="outline" onClick={onBack}>
            Batal
          </Button>
        </div>
      </main>
    </div>
  );
}
