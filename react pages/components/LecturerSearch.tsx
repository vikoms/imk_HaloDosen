import { useState } from "react";
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
import type { Lecturer, Submission } from "../App";

interface LecturerSearchProps {
  onSubmit: (submission: Submission) => void;
  onBack: () => void;
  hasActiveSubmission: boolean;
}

const MOCK_LECTURERS: Lecturer[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    nidn: "0123456789",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    expertise: ["Machine Learning", "Data Science", "AI"],
    quota: 3,
    maxQuota: 10,
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    nidn: "0987654321",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    expertise: ["Web Development", "Cloud Computing", "DevOps"],
    quota: 0,
    maxQuota: 8,
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    nidn: "1122334455",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    expertise: ["Cybersecurity", "Network Security", "Cryptography"],
    quota: 5,
    maxQuota: 10,
  },
  {
    id: "4",
    name: "Dr. David Kim",
    nidn: "5544332211",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    expertise: ["Mobile Development", "IoT", "Embedded Systems"],
    quota: 2,
    maxQuota: 12,
  },
  {
    id: "5",
    name: "Prof. Amanda Taylor",
    nidn: "6677889900",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda",
    expertise: ["Database Systems", "Big Data", "Data Analytics"],
    quota: 1,
    maxQuota: 10,
  },
  {
    id: "6",
    name: "Dr. James Wilson",
    nidn: "9988776655",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    expertise: ["Software Engineering", "Design Patterns", "Agile"],
    quota: 4,
    maxQuota: 10,
  },
];

export function LecturerSearch({ onSubmit, onBack, hasActiveSubmission }: LecturerSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const filteredLecturers = MOCK_LECTURERS.filter((lecturer) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lecturer.name.toLowerCase().includes(searchLower) ||
      lecturer.expertise.some((skill) => skill.toLowerCase().includes(searchLower))
    );
  });

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

  const handleSubmitApplication = () => {
    if (!selectedLecturer || !title || !description) return;

    const submission: Submission = {
      id: Date.now().toString(),
      lecturerId: selectedLecturer.id,
      lecturerName: selectedLecturer.name,
      title,
      description,
      status: "pending",
      submittedDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    onSubmit(submission);
    handleCloseDialog();
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
                <h1>Search Lecturers</h1>
                <p className="text-gray-500">Find your thesis supervisor</p>
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
              You already have a pending application. You cannot submit another application until your current one is resolved.
            </AlertDescription>
          </Alert>
        )}

        {/* Search Bar */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Find a Lecturer</CardTitle>
            <CardDescription>Search by name or expertise area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by lecturer name or skills (e.g., Machine Learning, Web Development)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Lecturer List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredLecturers.map((lecturer) => (
            <Card key={lecturer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={lecturer.photo} alt={lecturer.name} />
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
                    <p className="text-gray-700 mb-2">Expertise:</p>
                    <div className="flex flex-wrap gap-2">
                      {lecturer.expertise.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-gray-600">Available Quota</p>
                      <p className={lecturer.quota === 0 ? "text-red-600" : "text-green-600"}>
                        {lecturer.quota} / {lecturer.maxQuota}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleOpenDialog(lecturer)}
                      disabled={lecturer.quota === 0 || hasActiveSubmission}
                    >
                      {lecturer.quota === 0 ? "Full" : "Submit"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLecturers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No lecturers found matching your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Submission Form Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit Guidance Application</DialogTitle>
            <DialogDescription>
              Fill out the form below to submit your thesis guidance request.
            </DialogDescription>
          </DialogHeader>

          {selectedLecturer && (
            <div className="space-y-4">
              {/* Lecturer Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-2">Selected Lecturer</p>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedLecturer.photo} alt={selectedLecturer.name} />
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
                <Label htmlFor="title">Thesis Title / Research Topic *</Label>
                <Input
                  id="title"
                  placeholder="Enter your thesis title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Brief Description of Research Plan *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your research objectives, methodology, and expected outcomes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitApplication}
              disabled={!title || !description}
            >
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
