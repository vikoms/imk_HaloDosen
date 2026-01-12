import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { ArrowLeft, Search, Users, AlertCircle } from "lucide-react";

interface LecturerSearchProps {
  onBack: () => void;
  hasActiveSubmission: boolean;
  onSubmit: (submission: any) => void; 
}

interface Lecturer {
  id: number;
  name: string;
  nidn: string;
  skills: { id: number; name: string }[];
  quota: number;
  available: number;
  filled: number;
}

export function LecturerSearch({ onBack, hasActiveSubmission, onSubmit }: LecturerSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLecturers();
  }, [searchTerm]);

  const fetchLecturers = async () => {
      setLoading(true);
      try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const response = await (window as any).axios.get('/api/student/lecturers', {
              params: { search: searchTerm }
          });
          setLecturers(response.data.data);
      } catch (error) {
          console.error("Error fetching lecturers", error);
      } finally {
          setLoading(false);
      }
  };

  const handleOpenDialog = (lecturer: Lecturer) => {
    setSelectedLecturer(lecturer);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedLecturer(null);
    setTitle("");
    setDescription("");
  };

  const handleSubmitApplication = async () => {
    if (!selectedLecturer || !title || !description) return;

    setIsSubmitting(true);
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await (window as any).axios.post('/api/student/submissions', {
            lecturer_profile_id: selectedLecturer.id,
            title,
            description
        });

        // Assuming onSubmit handles navigation or success feedback in parent
        onSubmit(response.data.data);
        handleCloseDialog();
    } catch (error) {
        console.error("Error submitting application", error);
        alert("Gagal mengajukan permohonan. Silakan coba lagi.");
    } finally {
        setIsSubmitting(false);
    }
  };

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
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1>Cari Dosen</h1>
                <p className="text-gray-500">Temukan pembimbing skripsi Anda</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {hasActiveSubmission && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Anda sudah memiliki permohonan yang tertunda. Anda tidak dapat mengajukan permohonan lain sampai permohonan Anda saat ini diselesaikan.
            </AlertDescription>
          </Alert>
        )}

        {/* Search Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Temukan Dosen</CardTitle>
            <CardDescription>Cari berdasarkan nama atau bidang keahlian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari berdasarkan nama dosen atau keahlian"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lecturer List */}
        {loading ? <div>Loading...</div> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lecturers.map((lecturer) => (
            <Card key={lecturer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lecturer.name}`} alt={lecturer.name} />
                    <AvatarFallback>{lecturer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="mb-1">{lecturer.name}</CardTitle>
                    <CardDescription>NIDN: {lecturer.nidn}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700 mb-2">Keahlian:</p>
                    <div className="flex flex-wrap gap-2">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {lecturer.skills.map((skill: any, index) => (
                        <Badge key={index} variant="secondary">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-gray-600">Kuota Tersedia</p>
                      <p className={lecturer.available === 0 ? "text-red-600" : "text-green-600"}>
                        {lecturer.available} / {lecturer.quota}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleOpenDialog(lecturer)}
                      disabled={lecturer.available === 0 || hasActiveSubmission}
                    >
                      {lecturer.available === 0 ? "Penuh" : "Ajukan"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {!loading && lecturers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Tidak ditemukan dosen yang sesuai dengan kriteria pencarian Anda.</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Submission Form Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajukan Permohonan Bimbingan</DialogTitle>
            <DialogDescription>
              Isi formulir di bawah ini untuk mengajukan permohonan bimbingan skripsi.
            </DialogDescription>
          </DialogHeader>

          {selectedLecturer && (
            <div className="space-y-4">
              {/* Lecturer Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-2">Dosen Terpilih</p>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedLecturer.name}`} alt={selectedLecturer.name} />
                    <AvatarFallback>{selectedLecturer.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{selectedLecturer.name}</p>
                    <p className="text-gray-600">NIDN: {selectedLecturer.nidn}</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Skripsi / Topik Penelitian *</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul skripsi Anda"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi Singkat Rencana Penelitian *</Label>
                <Textarea
                  id="description"
                  placeholder="Jelaskan tujuan penelitian, metodologi, dan hasil yang diharapkan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Batal
            </Button>
            <Button
              onClick={handleSubmitApplication}
              disabled={!title || !description || isSubmitting}
            >
              {isSubmitting ? "Mengirim..." : "Kirim Permohonan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
