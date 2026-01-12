import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { ArrowLeft, CheckCircle, FileCheck, Edit, CheckCheck } from "lucide-react";
import type { QuotaRequest } from "../App";

interface QuotaApprovalProps {
  quotaRequests: QuotaRequest[];
  onUpdateQuota: (requestId: string, approvedQuota: number) => void;
  onApproveQuota: (requestId: string) => void;
  onApproveAll: () => void;
  onBack: () => void;
}

export function QuotaApproval({
  quotaRequests,
  onUpdateQuota,
  onApproveQuota,
  onApproveAll,
  onBack,
}: QuotaApprovalProps) {
  const [editingRequest, setEditingRequest] = useState<QuotaRequest | null>(null);
  const [editedQuota, setEditedQuota] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);

  const pendingRequests = quotaRequests.filter(req => req.status === "pending");
  const approvedRequests = quotaRequests.filter(req => req.status === "approved");

  const handleEditClick = (request: QuotaRequest) => {
    setEditingRequest(request);
    setEditedQuota(request.approvedQuota.toString());
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (editingRequest) {
      const newQuota = parseInt(editedQuota) || 0;
      onUpdateQuota(editingRequest.id, newQuota);
      setShowEditDialog(false);
      setEditingRequest(null);
      setEditedQuota("");
    }
  };

  const handleApprove = (requestId: string) => {
    onApproveQuota(requestId);
  };

  const handleApproveAll = () => {
    if (window.confirm(`Are you sure you want to approve all ${pendingRequests.length} pending quota requests?`)) {
      onApproveAll();
    }
  };

  const getStatusBadge = (status: string) => {
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
                <FileCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1>Lecturer Quota Approval</h1>
                <p className="text-gray-500">Review and approve quota requests</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Total Requests</p>
                  <p className="text-blue-600">{quotaRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Pending</p>
                  <p className="text-yellow-600">{pendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">Approved</p>
                  <p className="text-green-600">{approvedRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        {pendingRequests.length > 0 && (
          <div className="mb-6 flex justify-end">
            <Button onClick={handleApproveAll} className="bg-green-600 hover:bg-green-700">
              <CheckCheck className="h-4 w-4 mr-2" />
              Approve All Pending Requests
            </Button>
          </div>
        )}

        {/* Quota Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Quota Recapitulation</CardTitle>
            <CardDescription>
              Review, edit, and approve lecturer quota requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lecturer Name</TableHead>
                    <TableHead>NIDN</TableHead>
                    <TableHead>Requested Quota</TableHead>
                    <TableHead>Approved Quota</TableHead>
                    <TableHead>Current Filled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotaRequests.map((request) => {
                    const isOverQuota = request.requestedQuota !== request.approvedQuota;
                    return (
                      <TableRow key={request.id}>
                        <TableCell>{request.lecturerName}</TableCell>
                        <TableCell>{request.nidn}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{request.requestedQuota}</span>
                            {isOverQuota && (
                              <Badge variant="outline" className="text-orange-600">
                                Adjusted
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{request.approvedQuota}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(request)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={request.currentFilled >= request.approvedQuota ? "text-red-600" : ""}>
                            {request.currentFilled}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-right">
                          {request.status === "pending" ? (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleApprove(request.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          ) : (
                            <span className="text-gray-500">Processed</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {quotaRequests.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <FileCheck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No quota requests found</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Approval Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>Review each lecturer's requested quota against their capacity and expertise.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>You can edit the approved quota if it doesn't match the optimal ratio.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>Consider the number of final-year students when approving quotas.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-indigo-600 mt-1">•</span>
                <span>Use "Approve All" to quickly approve all pending requests at once.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Approved Quota</DialogTitle>
            <DialogDescription>
              Adjust the approved quota for this lecturer
            </DialogDescription>
          </DialogHeader>

          {editingRequest && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-600">Lecturer: {editingRequest.lecturerName}</p>
                <p className="text-gray-600">NIDN: {editingRequest.nidn}</p>
                <p className="text-gray-600">Requested: {editingRequest.requestedQuota}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approvedQuota">Approved Quota</Label>
                <Input
                  id="approvedQuota"
                  type="number"
                  min="0"
                  max="30"
                  value={editedQuota}
                  onChange={(e) => setEditedQuota(e.target.value)}
                  placeholder="Enter approved quota"
                />
                <p className="text-gray-500">
                  Current filled: {editingRequest.currentFilled} students
                </p>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800">
                  Note: Make sure the approved quota considers the lecturer's capacity and the total number of students.
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
