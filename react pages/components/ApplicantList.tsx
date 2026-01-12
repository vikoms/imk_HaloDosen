import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
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
import type { Applicant, ApplicationStatus } from "../App";

interface ApplicantListProps {
  applicants: Applicant[];
  onApplicantAction: (applicantId: string, action: "approve" | "reject", reason?: string) => void;
  onBack: () => void;
}

export function ApplicantList({ applicants, onApplicantAction, onBack }: ApplicantListProps) {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");

  const filteredApplicants = applicants.filter((applicant) => {
    if (statusFilter === "all") return true;
    return applicant.status === statusFilter;
  });

  const handleViewDetails = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    setShowDetailsDialog(true);
  };

  const handleApprove = (applicant: Applicant) => {
    if (window.confirm(`Are you sure you want to approve ${applicant.studentName}'s application?`)) {
      onApplicantAction(applicant.id, "approve");
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
      onApplicantAction(selectedApplicant.id, "reject", rejectionReason);
      setShowRejectDialog(false);
      setSelectedApplicant(null);
      setRejectionReason("");
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const pendingCount = applicants.filter(a => a.status === "pending").length;
  const approvedCount = applicants.filter(a => a.status === "approved").length;
  const rejectedCount = applicants.filter(a => a.status === "rejected").length;

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
                <h1>Student Applications</h1>
                <p className="text-gray-500">Review and manage thesis guidance requests</p>
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
                  <p className="text-gray-600 mb-1">Pending</p>
                  <p className="text-yellow-600">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Approved</p>
                  <p className="text-green-600">{approvedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Rejected</p>
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
              <span>Filter Applications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Label htmlFor="status-filter">Status:</Label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ApplicationStatus | "all")}>
                <SelectTrigger id="status-filter" className="w-[200px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending">Pending Only</SelectItem>
                  <SelectItem value="approved">Approved Only</SelectItem>
                  <SelectItem value="rejected">Rejected Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applicant Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications List</CardTitle>
            <CardDescription>
              {filteredApplicants.length} application{filteredApplicants.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredApplicants.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No applications found matching the filter</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Topic Title</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
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
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Review the student's thesis proposal</DialogDescription>
          </DialogHeader>

          {selectedApplicant && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student ID</Label>
                  <p className="mt-1">{selectedApplicant.studentId}</p>
                </div>
                <div>
                  <Label>Student Name</Label>
                  <p className="mt-1">{selectedApplicant.studentName}</p>
                </div>
              </div>

              <div>
                <Label>Submission Date</Label>
                <p className="mt-1">{selectedApplicant.submittedDate}</p>
              </div>

              <div>
                <Label>Status</Label>
                <div className="mt-1">{getStatusBadge(selectedApplicant.status)}</div>
              </div>

              <div>
                <Label>Thesis Title</Label>
                <p className="mt-1">{selectedApplicant.title}</p>
              </div>

              <div>
                <Label>Research Description</Label>
                <div className="mt-1 p-4 bg-gray-50 rounded-md border">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApplicant.description}</p>
                </div>
              </div>

              {selectedApplicant.rejectionReason && (
                <div>
                  <Label className="text-red-600">Rejection Reason</Label>
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
                  Reject
                </Button>
                <Button onClick={() => selectedApplicant && handleApprove(selectedApplicant)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
                </Button>
              </>
            )}
            {selectedApplicant?.status !== "pending" && (
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application (optional)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedApplicant && (
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-600">Student: {selectedApplicant.studentName}</p>
                <p className="text-gray-600">Title: {selectedApplicant.title}</p>
              </div>
            )}

            <div>
              <Label htmlFor="rejectionReason">Reason for Rejection</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Explain why you're rejecting this application..."
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
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectConfirm}>
              <XCircle className="h-4 w-4 mr-2" />
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
