import { useState } from "react";
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
import type { QuotaRequest, StudentDistribution } from "../App";

interface DistributionMonitoringProps {
  quotaRequests: QuotaRequest[];
  students: StudentDistribution[];
  onBack: () => void;
}

export function DistributionMonitoring({
  quotaRequests,
  students,
  onBack,
}: DistributionMonitoringProps) {
  const [sortBy, setSortBy] = useState<"name" | "filled" | "remaining">("name");
  const [filterStatus, setFilterStatus] = useState<"all" | "full" | "available">("all");

  const unassignedStudents = students.filter(s => !s.hasAssignment);
  const assignedStudents = students.filter(s => s.hasAssignment);

  // Calculate statistics
  const totalQuota = quotaRequests.reduce((sum, req) => sum + req.approvedQuota, 0);
  const totalFilled = quotaRequests.reduce((sum, req) => sum + req.currentFilled, 0);
  const utilizationRate = totalQuota > 0 ? Math.round((totalFilled / totalQuota) * 100) : 0;

  // Sort and filter lecturers
  let sortedLecturers = [...quotaRequests];

  // Apply sorting
  switch (sortBy) {
    case "filled":
      sortedLecturers.sort((a, b) => b.currentFilled - a.currentFilled);
      break;
    case "remaining":
      sortedLecturers.sort((a, b) => 
        (b.approvedQuota - b.currentFilled) - (a.approvedQuota - a.currentFilled)
      );
      break;
    default:
      sortedLecturers.sort((a, b) => a.lecturerName.localeCompare(b.lecturerName));
  }

  // Apply filter
  if (filterStatus === "full") {
    sortedLecturers = sortedLecturers.filter(req => req.currentFilled >= req.approvedQuota);
  } else if (filterStatus === "available") {
    sortedLecturers = sortedLecturers.filter(req => req.currentFilled < req.approvedQuota);
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
                <h1>Distribution Monitoring</h1>
                <p className="text-gray-500">Real-time student assignment tracking</p>
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
                  <p className="text-gray-600 mb-1">Total Students</p>
                  <p className="text-blue-600">{students.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Assigned</p>
                  <p className="text-green-600">{assignedStudents.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Unassigned</p>
                  <p className="text-red-600">{unassignedStudents.length}</p>
                </div>
                <UserX className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Utilization</p>
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
            <CardTitle>Filter & Sort</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">Sort by:</span>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Lecturer Name</SelectItem>
                    <SelectItem value="filled">Most Filled</SelectItem>
                    <SelectItem value="remaining">Most Available</SelectItem>
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
                    <SelectItem value="all">All Lecturers</SelectItem>
                    <SelectItem value="available">Available Only</SelectItem>
                    <SelectItem value="full">Full Capacity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lecturer Distribution Table */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lecturer Capacity Overview</CardTitle>
            <CardDescription>
              Current student distribution across all lecturers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lecturer Name</TableHead>
                    <TableHead>NIDN</TableHead>
                    <TableHead>Filled / Capacity</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLecturers.map((lecturer) => {
                    const remaining = lecturer.approvedQuota - lecturer.currentFilled;
                    const percentage = lecturer.approvedQuota > 0 
                      ? Math.round((lecturer.currentFilled / lecturer.approvedQuota) * 100)
                      : 0;
                    const isFull = lecturer.currentFilled >= lecturer.approvedQuota;

                    return (
                      <TableRow key={lecturer.id}>
                        <TableCell>{lecturer.lecturerName}</TableCell>
                        <TableCell>{lecturer.nidn}</TableCell>
                        <TableCell>
                          <span className={isFull ? "text-red-600" : ""}>
                            {lecturer.currentFilled} / {lecturer.approvedQuota}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={percentage} className="w-32" />
                            <span className="text-gray-600 min-w-[3rem]">{percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {isFull ? (
                            <Badge variant="destructive">Full</Badge>
                          ) : remaining <= 2 ? (
                            <Badge variant="secondary">
                              {remaining} left
                            </Badge>
                          ) : (
                            <Badge variant="default">
                              {remaining} available
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
                <p>No lecturers found matching the filter</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Unassigned Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Students Without Supervisor</span>
            </CardTitle>
            <CardDescription>
              Students who have not been assigned a thesis supervisor
            </CardDescription>
          </CardHeader>
          <CardContent>
            {unassignedStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="flex items-center justify-center space-x-2">
                  <span>All students have been assigned supervisors!</span>
                  <span className="text-green-600">✓</span>
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unassignedStudents.map((student) => (
                      <TableRow key={student.studentId}>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>{student.studentName}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Unassigned</Badge>
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
            <CardTitle>Distribution Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-gray-700 mb-2">Overall Capacity</p>
                <p className="text-blue-600">
                  {totalFilled} / {totalQuota} slots filled ({utilizationRate}%)
                </p>
                <Progress value={utilizationRate} className="mt-2" />
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-gray-700 mb-2">Assignment Rate</p>
                <p className="text-green-600">
                  {assignedStudents.length} / {students.length} students assigned (
                  {students.length > 0 ? Math.round((assignedStudents.length / students.length) * 100) : 0}%)
                </p>
                <Progress 
                  value={students.length > 0 ? (assignedStudents.length / students.length) * 100 : 0} 
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
