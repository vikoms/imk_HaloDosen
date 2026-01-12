import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ArrowLeft, CheckCircle, XCircle, Eye, Filter } from "lucide-react";

interface ApplicantListProps {
  onBack: () => void;
}

interface Applicant {
  id: number;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  submittedDate: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
}

export function ApplicantList({ onBack }: ApplicantListProps) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const fetchApplicants = async () => {
    try {
        setLoading(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await (window as any).axios.get('/api/lecturer/applicants');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedApplicants = response.data.data.map((app: any) => ({
            id: app.id,
            studentId: app.student.nim || app.student.user.email, // Fallback if nim not available
            studentName: app.student.user.name,
            title: app.title,
            description: app.description,
            submittedDate: new Date(app.created_at).toLocaleDateString(),
            status: app.status,
            rejectionReason: app.rejection_reason
        }));
        setApplicants(mappedApplicants);
    } catch (error) {
        console.error("Failed to fetch applicants", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleApplicantAction = async (id: number, action: "approved" | "rejected", reason?: string) => {
      try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (window as any).axios.post(`/api/lecturer/applicants/${id}/decide`, {
              status: action,
              rejection_reason: reason
          });
          alert(`Permohonan berhasil ${action === "approved" ? "disetujui" : "ditolak"}`);
          fetchApplicants(); // Refresh list
      } catch (error) {
          console.error("Failed to update applicant status", error);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const message = (error as any).response?.data?.message || "Gagal memproses permohonan.";
          alert(message);
      }
  };

  const filteredApplicants = applicants.filter((applicant) => {
    if (statusFilter === "all") return true;
    return applicant.status === statusFilter;
  });

  const handleViewDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowDetailsDialog(true);
  };

  const handleApprove = (applicant: Applicant) => {
    if (window.confirm(`Apakah Anda yakin ingin menyetujui permohonan ${applicant.studentName}?`)) {
      handleApplicantAction(applicant.id, "approved");
      setShowDetailsDialog(false);
    }
  };

  const handleRejectClick = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowDetailsDialog(false);
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = () => {
    if (selectedApplicant) {
      handleApplicantAction(selectedApplicant.id, "rejected", rejectionReason);
      setShowRejectDialog(false);
      setSelectedApplicant(null);
      setRejectionReason("");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>;
      case "approved":
        return <Badge variant="default">Disetujui</Badge>;
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>;
      default:
        return <Badge>Tidak Diketahui</Badge>;
    }
  };

  const pendingCount = applicants.filter(a => a.status === "pending").length;
  const approvedCount = applicants.filter(a => a.status === "approved").length;
  const rejectedCount = applicants.filter(a => a.status === "rejected").length;

  if (loading && applicants.length === 0) return <div>Loading applicants...</div>;

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
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1>Permohonan Mahasiswa</h1>
                <p className="text-gray-500">Tinjau dan kelola permohonan bimbingan skripsi</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Total</p>
                  <p className="text-blue-600">{applicants.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Menunggu</p>
                  <p className="text-yellow-600">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Disetujui</p>
                  <p className="text-green-600">{approvedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Ditolak</p>
                  <p className="text-red-600">{rejectedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Permohonan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label htmlFor="status-filter">Status:</Label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
                <SelectTrigger id="status-filter" className="w-[200px]">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Permohonan</SelectItem>
                  <SelectItem value="pending">Hanya Menunggu</SelectItem>
                  <SelectItem value="approved">Hanya Disetujui</SelectItem>
                  <SelectItem value="rejected">Hanya Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applicant Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Permohonan</CardTitle>
            <CardDescription>
              {filteredApplicants.length} permohonan ditemukan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredApplicants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Tidak ada permohonan yang sesuai dengan filter</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NIM</TableHead>
                      <TableHead>Nama Mahasiswa</TableHead>
                      <TableHead>Judul Topik</TableHead>
                      <TableHead>Tanggal Pengajuan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell>{applicant.studentId}</TableCell>
                        <TableCell>{applicant.studentName}</TableCell>
                        <TableCell className="max-w-xs truncate">{applicant.title}</TableCell>
                        <TableCell>{applicant.submittedDate}</TableCell>
                        <TableCell>{getStatusBadge(applicant.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(applicant)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Details
                            </Button>
                            {applicant.status === "pending" && (
                              <>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleApprove(applicant)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRejectClick(applicant)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detail Permohonan</DialogTitle>
            <DialogDescription>Tinjau proposal skripsi mahasiswa</DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>NIM</Label>
                  <p className="mt-1">{selectedApplicant.studentId}</p>
                </div>
                <div>
                  <Label>Nama Mahasiswa</Label>
                  <p className="mt-1">{selectedApplicant.studentName}</p>
                </div>
              </div>

              <div>
                <Label>Tanggal Pengajuan</Label>
                <p className="mt-1">{selectedApplicant.submittedDate}</p>
              </div>

              <div>
                <Label>Status</Label>
                <div className="mt-1">{getStatusBadge(selectedApplicant.status)}</div>
              </div>

              <div>
                <Label>Judul Skripsi</Label>
                <p className="mt-1">{selectedApplicant.title}</p>
              </div>

              <div>
                <Label>Deskripsi Penelitian</Label>
                <div className="mt-1 p-4 bg-gray-50 rounded-md border">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApplicant.description}</p>
                </div>
              </div>

              {selectedApplicant.rejectionReason && (
                <div>
                  <Label className="text-red-600">Alasan Penolakan</Label>
                  <p className="mt-1 text-red-600">{selectedApplicant.rejectionReason}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedApplicant?.status === "pending" && (
              <>
                <Button
                  variant="destructive"
                  onClick={() => selectedApplicant && handleRejectClick(selectedApplicant)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Tolak
                </Button>
                <Button onClick={() => selectedApplicant && handleApprove(selectedApplicant)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Terima
                </Button>
              </>
            )}
            {selectedApplicant?.status !== "pending" && (
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Tutup
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tolak Permohonan</DialogTitle>
            <DialogDescription>
              Mohon berikan alasan penolakan permohonan ini (opsional)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedApplicant && (
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-600">Mahasiswa: {selectedApplicant.studentName}</p>
                <p className="text-gray-600">Judul: {selectedApplicant.title}</p>
              </div>
            )}

            <div>
              <Label htmlFor="rejectionReason">Alasan Penolakan</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Jelaskan mengapa Anda menolak permohonan ini..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowRejectDialog(false);
              setRejectionReason("");
            }}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleRejectConfirm}>
              <XCircle className="h-4 w-4 mr-2" />
              Konfirmasi Penolakan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
