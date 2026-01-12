import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ArrowLeft, FileText, Clock, Eye, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { Submission } from "../App";

interface SubmissionStatusProps {
  submission: Submission | null;
  onBack: () => void;
  onCancel: () => void;
}

export function SubmissionStatus({ submission, onBack, onCancel }: SubmissionStatusProps) {
  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1>Submission Status</h1>
                  <p className="text-gray-500">Track your application</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>You don't have any active submission.</p>
              <p className="mb-4">Submit an application to a lecturer to see your status here.</p>
              <Button onClick={onBack}>Go Back to Dashboard</Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const getStatusSteps = () => {
    const steps = [
      {
        label: "Submitted",
        date: submission.submittedDate,
        completed: true,
        icon: FileText,
      },
      {
        label: "Viewed by Lecturer",
        date: submission.viewedDate,
        completed: !!submission.viewedDate,
        icon: Eye,
      },
      {
        label: submission.status === "approved" ? "Accepted" : submission.status === "rejected" ? "Rejected" : "Decision Pending",
        date: submission.responseDate,
        completed: submission.status === "approved" || submission.status === "rejected",
        icon: submission.status === "approved" ? CheckCircle : submission.status === "rejected" ? XCircle : Clock,
      },
    ];

    return steps;
  };

  const steps = getStatusSteps();

  const handleCancelSubmission = () => {
    if (window.confirm("Are you sure you want to cancel this submission? This action cannot be undone.")) {
      onCancel();
      onBack();
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
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1>Submission Status</h1>
                <p className="text-gray-500">Track your application progress</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Application Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>Thesis guidance request information</CardDescription>
              </div>
              <Badge
                variant={
                  submission.status === "approved"
                    ? "default"
                    : submission.status === "rejected"
                    ? "destructive"
                    : "secondary"
                }
              >
                {submission.status === "pending"
                  ? "Pending Review"
                  : submission.status === "approved"
                  ? "Approved"
                  : "Rejected"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Lecturer</p>
                <p>{submission.lecturerName}</p>
              </div>
              <div>
                <p className="text-gray-600">Thesis Title</p>
                <p>{submission.title}</p>
              </div>
              <div>
                <p className="text-gray-600">Research Description</p>
                <p className="text-gray-700">{submission.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Status Timeline</CardTitle>
            <CardDescription>Track the progress of your application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === steps.length - 1;

                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          step.completed
                            ? submission.status === "rejected" && isLast
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 h-12 ${
                            step.completed ? "bg-green-300" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <p className={step.completed ? "" : "text-gray-500"}>
                          {step.label}
                        </p>
                        {step.date && (
                          <p className="text-gray-500">{step.date}</p>
                        )}
                      </div>
                      {!step.date && !step.completed && (
                        <p className="text-gray-400">Waiting...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Rejection Reason */}
        {submission.status === "rejected" && submission.rejectionReason && (
          <Alert variant="destructive" className="mb-6">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Reason for Rejection</AlertTitle>
            <AlertDescription>{submission.rejectionReason}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        {submission.status === "pending" && (
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>Manage your application</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleCancelSubmission}>
                Cancel Submission
              </Button>
              <p className="text-gray-500 mt-2">
                You can cancel your submission while it's still pending review.
              </p>
            </CardContent>
          </Card>
        )}

        {submission.status === "approved" && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Application Approved!</AlertTitle>
            <AlertDescription>
              Congratulations! Your thesis guidance application has been approved. Please contact your lecturer for the next steps.
            </AlertDescription>
          </Alert>
        )}

        {submission.status === "rejected" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>What's Next?</AlertTitle>
            <AlertDescription>
              You can submit a new application to a different lecturer or revise your proposal and try again.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}
