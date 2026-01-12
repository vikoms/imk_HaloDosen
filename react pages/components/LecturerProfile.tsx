import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ArrowLeft, Settings, Plus, X, CheckCircle, Clock, XCircle } from "lucide-react";
import type { LecturerData } from "../App";

interface LecturerProfileProps {
  lecturerData: LecturerData;
  onUpdateProfile: (data: { skills: string[]; requestedQuota: number }) => void;
  onBack: () => void;
}

export function LecturerProfile({ lecturerData, onUpdateProfile, onBack }: LecturerProfileProps) {
  const [skills, setSkills] = useState<string[]>(lecturerData.skills);
  const [newSkill, setNewSkill] = useState("");
  const [requestedQuota, setRequestedQuota] = useState(lecturerData.requestedQuota.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      const quota = parseInt(requestedQuota) || 0;
      onUpdateProfile({
        skills,
        requestedQuota: quota,
      });
      setIsSaving(false);
      alert("Profile updated successfully! Your quota change is pending approval.");
    }, 1000);
  };

  const getStatusInfo = () => {
    switch (lecturerData.quotaStatus) {
      case "approved":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          message: "Your quota request has been approved by the Head of Study Program.",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          message: "Your quota request was not approved. Please submit a new request.",
        };
      default:
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          message: "Your quota request is pending approval from the Head of Study Program.",
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
                <h1>Profile & Quota Settings</h1>
                <p className="text-gray-500">Manage your expertise and quota preferences</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lecturer Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Lecturer Information</CardTitle>
            <CardDescription>Your basic profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-gray-600">Name</p>
                <p>{lecturerData.name}</p>
              </div>
              <div>
                <p className="text-gray-600">NIDN</p>
                <p>{lecturerData.nidn}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Expertise & Skills</CardTitle>
            <CardDescription>Add tags that represent your areas of expertise</CardDescription>
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
                  <p className="text-gray-500">No skills added yet</p>
                )}
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Add a skill (e.g., AI, Data Mining, Web Development)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  />
                </div>
                <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quota Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quota Settings</CardTitle>
            <CardDescription>Set the maximum number of students you can supervise this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="requestedQuota">Requested Quota</Label>
                  <Input
                    id="requestedQuota"
                    type="number"
                    min="0"
                    max="20"
                    value={requestedQuota}
                    onChange={(e) => setRequestedQuota(e.target.value)}
                    placeholder="Enter quota number"
                  />
                  <p className="text-gray-500 mt-1">Maximum students you wish to supervise</p>
                </div>
                <div>
                  <Label>Current Approved Quota</Label>
                  <div className="p-3 bg-gray-50 rounded-md border mt-2">
                    <p className="text-indigo-600">{lecturerData.approvedQuota} students</p>
                  </div>
                  <p className="text-gray-500 mt-1">Currently approved by Head of Program</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quota Approval Status */}
        <Alert className={`${statusInfo.bgColor} ${statusInfo.borderColor} mb-6`}>
          <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
          <AlertTitle className={statusInfo.color}>
            Quota Approval Status: {lecturerData.quotaStatus.charAt(0).toUpperCase() + lecturerData.quotaStatus.slice(1)}
          </AlertTitle>
          <AlertDescription>{statusInfo.message}</AlertDescription>
        </Alert>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isSaving} className="flex-1">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
        </div>
      </main>
    </div>
  );
}
