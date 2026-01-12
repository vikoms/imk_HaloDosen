import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ArrowLeft, Users, AlertTriangle, TrendingUp, UserX } from "lucide-react";

interface DistributionMonitoringProps {
  onBack: () => void;
}

interface DistributionStats {
    total_students: number;
    with_topic: number;
    without_topic: number;
}

interface LecturerStats {
    id: number;
    name: string;
    nidn: string;
    quota: number;
    filled: number;
    available: number;
    percentage: number;
}

interface UnassignedStudent {
    id: string;
    nim: string;
    name: string;
}

export function DistributionMonitoring({
  onBack,
}: DistributionMonitoringProps) {
  const [sortBy, setSortBy] = useState<"name" | "filled" | "remaining">("name");
  const [filterStatus, setFilterStatus] = useState<"all" | "full" | "available">("all");
  
  const [stats, setStats] = useState<DistributionStats | null>(null);
  const [lecturers, setLecturers] = useState<LecturerStats[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<UnassignedStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response = await (window as any).axios.get('/api/head/distribution');
            setStats(response.data.data.stats);
            setLecturers(response.data.data.lecturers);
            setUnassignedStudents(response.data.data.unassigned_students);
        } catch (error) {
            console.error("Error fetching distribution data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const totalQuota = lecturers.reduce((sum, l) => sum + l.quota, 0);
  const totalFilled = lecturers.reduce((sum, l) => sum + l.filled, 0);
  const utilizationRate = totalQuota > 0 ? Math.round((totalFilled / totalQuota) * 100) : 0;
  
  // Stats
  const totalStudentCount = stats?.total_students || 0;
  const assignedStudentCount = stats?.with_topic || 0;
  const unassignedStudentCount = stats?.without_topic || 0;

  // Sort and filter lecturers
  let sortedLecturers = [...lecturers];

  // Apply sorting
  switch (sortBy) {
    case "filled":
      sortedLecturers.sort((a, b) => b.filled - a.filled);
      break;
    case "remaining":
      sortedLecturers.sort((a, b) => 
        (b.available) - (a.available)
      );
      break;
    default:
      sortedLecturers.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Apply filter
  if (filterStatus === "full") {
    sortedLecturers = sortedLecturers.filter(l => l.filled >= l.quota);
  } else if (filterStatus === "available") {
    sortedLecturers = sortedLecturers.filter(l => l.filled < l.quota);
  }

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
                <h1>Pemantauan Distribusi</h1>
                <p className="text-gray-500">Pelacakan penugasan mahasiswa secara real-time</p>
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
                  <p className="text-gray-600 mb-1">Total Mahasiswa</p>
                  <p className="text-blue-600">{totalStudentCount}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Ditugaskan</p>
                  <p className="text-green-600">{assignedStudentCount}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Belum Ditugaskan</p>
                  <p className="text-red-600">{unassignedStudentCount}</p>
                </div>
                <UserX className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Pemanfaatan</p>
                  <p className="text-indigo-600">{utilizationRate}%</p>
                </div>
                <div className="w-full mt-2">
                  <Progress value={utilizationRate} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter & Urutkan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Urutkan:</span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nama Dosen</SelectItem>
                    <SelectItem value="filled">Paling Banyak Terisi</SelectItem>
                    <SelectItem value="remaining">Paling Banyak Tersedia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Filter:</span>
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Dosen</SelectItem>
                    <SelectItem value="available">Hanya Tersedia</SelectItem>
                    <SelectItem value="full">Kapasitas Penuh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lecturer Distribution Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gambaran Kapasitas Dosen</CardTitle>
            <CardDescription>
              Distribusi mahasiswa saat ini di seluruh dosen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Dosen</TableHead>
                    <TableHead>NIDN</TableHead>
                    <TableHead>Terisi / Kapasitas</TableHead>
                    <TableHead>Progres</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLecturers.map((lecturer) => {
                    const isFull = lecturer.filled >= lecturer.quota;

                    return (
                      <TableRow key={lecturer.id}>
                        <TableCell>{lecturer.name}</TableCell>
                        <TableCell>{lecturer.nidn}</TableCell>
                        <TableCell>
                          <span className={isFull ? "text-red-600" : ""}>
                            {lecturer.filled} / {lecturer.quota}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={lecturer.percentage} className="w-32" />
                            <span className="text-gray-600 min-w-[3rem]">{lecturer.percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isFull ? (
                            <Badge variant="destructive">Penuh</Badge>
                          ) : lecturer.available <= 2 ? (
                            <Badge variant="secondary">
                              {lecturer.available} tersisa
                            </Badge>
                          ) : (
                            <Badge variant="default">
                              {lecturer.available} tersedia
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {sortedLecturers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Tidak ada dosen yang sesuai dengan filter</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unassigned Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Mahasiswa Tanpa Pembimbing</span>
            </CardTitle>
            <CardDescription>
              Mahasiswa yang belum mendapatkan dosen pembimbing skripsi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {unassignedStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="flex items-center justify-center space-x-2">
                  <span>Semua mahasiswa telah mendapatkan pembimbing!</span>
                  <span className="text-green-600">✓</span>
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NIM</TableHead>
                      <TableHead>Nama Mahasiswa</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unassignedStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.nim}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Belum Ditugaskan</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Ringkasan Distribusi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-2">Kapasitas Keseluruhan</p>
                <p className="text-blue-600">
                  {totalFilled} / {totalQuota} slot terisi ({utilizationRate}%)
                </p>
                <Progress value={utilizationRate} className="mt-2" />
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-gray-700 mb-2">Tingkat Penugasan</p>
                <p className="text-green-600">
                  {assignedStudentCount} / {totalStudentCount} mahasiswa ditugaskan (
                  {totalStudentCount > 0 ? Math.round((assignedStudentCount / totalStudentCount) * 100) : 0}%)
                </p>
                <Progress 
                  value={totalStudentCount > 0 ? (assignedStudentCount / totalStudentCount) * 100 : 0} 
                  className="mt-2" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
