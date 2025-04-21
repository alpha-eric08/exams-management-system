// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { useData } from '@/contexts/DataContext';
// import MainLayout from '@/components/layout/MainLayout';
// import MobileNavbar from '@/components/layout/MobileNavbar';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { toast } from '@/components/ui/use-toast';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
// import { Plus, Calendar, Clock, MapPin, Edit, Trash2 } from 'lucide-react';

// const ManageTimetable = () => {
//   const { isAuthenticated, isAdmin } = useAuth();
//   const { timetableEntries, courses, createTimetableEntry } = useData();
//   const navigate = useNavigate();

//   // State for dialog and form
//   const [addDialogOpen, setAddDialogOpen] = useState(false);
//   const [timetableForm, setTimetableForm] = useState({
//     courseId: '',
//     date: '',
//     startTime: '',
//     endTime: '',
//     venue: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Redirect if not authenticated or not admin
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//     } else if (!isAdmin) {
//       navigate('/student/dashboard');
//     }
//   }, [isAuthenticated, isAdmin, navigate]);

//   const handleAddTimetable = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       await createTimetableEntry({
//         courseId: timetableForm.courseId,
//         date: timetableForm.date,
//         startTime: timetableForm.startTime,
//         endTime: timetableForm.endTime,
//         venue: timetableForm.venue
//       });

//       toast({
//         title: 'Exam scheduled',
//         description: 'The examination has been successfully scheduled.',
//       });

//       setAddDialogOpen(false);
//       setTimetableForm({
//         courseId: '',
//         date: '',
//         startTime: '',
//         endTime: '',
//         venue: ''
//       });

//     } catch (error) {
//       console.error('Error adding timetable entry:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Failed to schedule exam',
//         description: error instanceof Error ? error.message : 'An unknown error occurred',
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!isAuthenticated || !isAdmin) {
//     return null; // Redirect will happen in useEffect
//   }

//   return (
// <>
//   <MobileNavbar />
//   <MainLayout title="Manage Timetable">
//     <div className="mb-6">
//       <h2 className="text-2xl font-bold text-maroon mb-2">Timetable Management</h2>
//       <p className="text-gray-600">
//         Schedule examinations for resit and supplementary applications.
//       </p>
//     </div>

//         <div className="mb-6">
//           <Button
//             className="bg-maroon hover:bg-maroon-dark text-white"
//             onClick={() => setAddDialogOpen(true)}
//           >
//             <Plus className="h-4 w-4 mr-2" /> Schedule Exam
//           </Button>
//         </div>

//         {/* Display timetable in a table */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-maroon text-white">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Course
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Time
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Venue
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {timetableEntries.map((entry) => {
//                   const course = courses.find(c => c.id === entry.courseId);

//                   return (
//                     <tr key={entry.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {course?.code}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {course?.title}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {entry.date}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {entry.startTime} - {entry.endTime}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {entry.venue}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         <div className="flex space-x-2">
//                           <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                             <Edit className="h-4 w-4 text-blue-500" />
//                           </Button>
//                           <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                             <Trash2 className="h-4 w-4 text-red-500" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Add Timetable Entry Dialog */}
//         <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Schedule Examination</DialogTitle>
//               <DialogDescription>
//                 Enter the details for the new examination
//               </DialogDescription>
//             </DialogHeader>

//             <form onSubmit={handleAddTimetable} className="space-y-4 pt-4">
//               <div className="space-y-2">
//                 <Label htmlFor="courseSelect">Course</Label>
//                 <Select
//                   value={timetableForm.courseId}
//                   onValueChange={(value) => setTimetableForm({...timetableForm, courseId: value})}
//                   required
//                 >
//                   <SelectTrigger id="courseSelect" className="w-full">
//                     <SelectValue placeholder="Select a course" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {courses.map((course) => (
//                       <SelectItem key={course.id} value={course.id}>
//                         {course.code} - {course.title}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="examDate">Date</Label>
//                 <Input
//                   id="examDate"
//                   type="date"
//                   value={timetableForm.date}
//                   onChange={(e) => setTimetableForm({...timetableForm, date: e.target.value})}
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="startTime">Start Time</Label>
//                   <Input
//                     id="startTime"
//                     type="time"
//                     value={timetableForm.startTime}
//                     onChange={(e) => setTimetableForm({...timetableForm, startTime: e.target.value})}
//                     required
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="endTime">End Time</Label>
//                   <Input
//                     id="endTime"
//                     type="time"
//                     value={timetableForm.endTime}
//                     onChange={(e) => setTimetableForm({...timetableForm, endTime: e.target.value})}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="venue">Venue</Label>
//                 <Input
//                   id="venue"
//                   value={timetableForm.venue}
//                   onChange={(e) => setTimetableForm({...timetableForm, venue: e.target.value})}
//                   placeholder="e.g., Room 101, Main Building"
//                   required
//                 />
//               </div>

//               <DialogFooter>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setAddDialogOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   type="submit"
//                   className="bg-maroon hover:bg-maroon-dark"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? 'Scheduling...' : 'Schedule Exam'}
//                 </Button>
//               </DialogFooter>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </MainLayout>
//     </>
//   );
// };

// export default ManageTimetable;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Trash2,
  Plus,
  FileUp,
  Download,
  Send,
  ArrowUpDown,
  Users,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MobileNavbar from "@/components/layout/MobileNavbar";
import MainLayout from "@/components/layout/MainLayout";

const ManageTimetable = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddExamOpen, setIsAddExamOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState<any>(null);
  const [isEditExamOpen, setIsEditExamOpen] = useState(false);

  // Sample form data for new exam
  const [newExam, setNewExam] = useState({
    courseCode: "",
    courseTitle: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    invigilator: "",
    examType: "resit",
  });

  // Mock exams data
  const [exams, setExams] = useState([
    {
      id: 1,
      courseCode: "CSC301",
      courseTitle: "Data Structures and Algorithms",
      date: "2025-05-15",
      startTime: "10:00",
      endTime: "12:00",
      venue: "Main Hall, Block A",
      invigilator: "Dr. James Smith",
      examType: "resit",
      published: true,
    },
    {
      id: 2,
      courseCode: "MAT305",
      courseTitle: "Linear Algebra",
      date: "2025-05-17",
      startTime: "14:00",
      endTime: "16:00",
      venue: "Science Block, Room 203",
      invigilator: "Prof. Mary Johnson",
      examType: "resit",
      published: true,
    },
    {
      id: 3,
      courseCode: "PHY302",
      courseTitle: "Quantum Mechanics",
      date: "2025-05-12",
      startTime: "09:00",
      endTime: "11:00",
      venue: "Science Block, Room 105",
      invigilator: "Dr. Robert Williams",
      examType: "supplementary",
      published: true,
    },
    {
      id: 4,
      courseCode: "BIO301",
      courseTitle: "Molecular Biology",
      date: "2025-05-20",
      startTime: "13:00",
      endTime: "15:00",
      venue: "Life Sciences Building, Lab 3",
      invigilator: "Dr. Sarah Thompson",
      examType: "supplementary",
      published: false,
    },
    {
      id: 5,
      courseCode: "ENG202",
      courseTitle: "Technical Writing",
      date: "2025-05-22",
      startTime: "10:00",
      endTime: "12:00",
      venue: "Arts Block, Room 102",
      invigilator: "Prof. Emma Brown",
      examType: "resit",
      published: false,
    },
  ]);

  // Sort exams by date
  const sortedExams = [...exams].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group exams by date
  const examsByDate = sortedExams.reduce((acc, exam) => {
    const dateKey = exam.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(exam);
    return acc;
  }, {} as Record<string, typeof exams>);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleAddExam = () => {
    // Validate form inputs
    if (
      !newExam.courseCode ||
      !newExam.courseTitle ||
      !newExam.date ||
      !newExam.startTime ||
      !newExam.endTime ||
      !newExam.venue ||
      !newExam.invigilator
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(...exams.map((e) => e.id)) + 1;
    const examToAdd = {
      ...newExam,
      id: newId,
      published: false,
    };

    setExams([...exams, examToAdd]);
    setNewExam({
      courseCode: "",
      courseTitle: "",
      date: "",
      startTime: "",
      endTime: "",
      venue: "",
      invigilator: "",
      examType: "resit",
    });
    setIsAddExamOpen(false);

    toast({
      title: "Exam Added",
      description: `${examToAdd.courseCode}: ${examToAdd.courseTitle} has been added to the timetable.`,
    });
  };

  const handleEditExam = () => {
    if (!examToEdit) return;

    const updatedExams = exams.map((exam) =>
      exam.id === examToEdit.id ? examToEdit : exam
    );

    setExams(updatedExams);
    setIsEditExamOpen(false);

    toast({
      title: "Exam Updated",
      description: `${examToEdit.courseCode}: ${examToEdit.courseTitle} has been updated.`,
    });
  };

  const handleDeleteExam = (id: number) => {
    const updatedExams = exams.filter((exam) => exam.id !== id);
    setExams(updatedExams);

    toast({
      title: "Exam Removed",
      description: "The exam has been removed from the timetable.",
    });
  };

  const handlePublishTimetable = () => {
    const updatedExams = exams.map((exam) => ({
      ...exam,
      published: true,
    }));

    setExams(updatedExams);
    setIsPublishDialogOpen(false);

    toast({
      title: "Timetable Published",
      description:
        "The exam timetable has been published and is now visible to students.",
    });
  };

  const unpublishedExams = exams.filter((exam) => !exam.published).length;

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <MobileNavbar />
      <MainLayout title="Manage Timetable">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-maroon mb-2">
            Timetable Management
          </h2>
          <p className="text-gray-600">
            Schedule examinations for resit and supplementary applications.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            className="bg-maroon hover:bg-maroon-dark flex items-center gap-2"
            onClick={() => setIsAddExamOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Exam
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              // In a real app, this would trigger a file upload dialog
              toast({
                title: "Upload Functionality",
                description:
                  "This would allow you to upload timetable data via CSV file in a real application.",
              });
            }}
          >
            <FileUp className="h-4 w-4" />
            Import Timetable
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              // In a real app, this would trigger a file download
              toast({
                title: "Download Functionality",
                description:
                  "This would allow you to download the timetable as CSV file in a real application.",
              });
            }}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            className={`flex items-center gap-2 ${
              unpublishedExams > 0
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400"
            }`}
            disabled={unpublishedExams === 0}
            onClick={() => setIsPublishDialogOpen(true)}
          >
            <Send className="h-4 w-4" />
            Publish Changes {unpublishedExams > 0 && `(${unpublishedExams})`}
          </Button>
        </div>

        {/* Toggle */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"></div>

              <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>

                <TabsContent value="calendar">
                  {Object.keys(examsByDate).length > 0 ? (
                    <div className="space-y-8">
                      {Object.entries(examsByDate).map(([date, exams]) => (
                        <Card key={date}>
                          <CardHeader className="bg-maroon-dark text-white rounded-t-lg">
                            <CardTitle className="flex items-center">
                              <Calendar className="h-5 w-5 mr-2" />
                              {formatDate(date)}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="divide-y">
                              {exams.map((exam) => (
                                <div key={exam.id} className="p-4">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                      <div className="flex items-center">
                                        <h3 className="font-medium text-lg">
                                          {exam.courseCode}: {exam.courseTitle}
                                        </h3>
                                        {!exam.published && (
                                          <Badge className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                            Unpublished
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                                        <div className="flex items-center text-sm">
                                          <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                          <span>
                                            {exam.startTime} - {exam.endTime}
                                          </span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                          <span>{exam.venue}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                          <Users className="h-4 w-4 mr-1 text-gray-500" />
                                          <span>
                                            Invigilator: {exam.invigilator}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Badge
                                        className={`${
                                          exam.examType === "resit"
                                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                            : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                        }`}
                                      >
                                        {exam.examType === "resit"
                                          ? "Resit"
                                          : "Supplementary"}
                                      </Badge>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => {
                                          setExamToEdit(exam);
                                          setIsEditExamOpen(true);
                                        }}
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-primary-red hover:text-red-700"
                                        onClick={() =>
                                          handleDeleteExam(exam.id)
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">
                          No exams scheduled
                        </h3>
                        <p className="text-gray-500 text-center mt-1">
                          There are no exams scheduled yet. Click "Add Exam" to
                          create a new exam.
                        </p>
                        <Button
                          className="mt-4 bg-maroon hover:bg-maroon-dark"
                          onClick={() => setIsAddExamOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Exam
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="list">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <CardTitle>Exam List</CardTitle>
                          <CardDescription>
                            All scheduled exams in list format
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Select defaultValue="date">
                            <SelectTrigger className="w-[180px]">
                              <ArrowUpDown className="h-4 w-4 mr-2" />
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="date">Sort by Date</SelectItem>
                              <SelectItem value="course">
                                Sort by Course
                              </SelectItem>
                              <SelectItem value="type">
                                Sort by Exam Type
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-3 px-4 font-medium text-gray-500">
                                Course
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-500">
                                Type
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-500">
                                Date
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-500">
                                Time
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-500">
                                Venue
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-500">
                                Invigilator
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-500">
                                Status
                              </th>
                              <th className="text-left py-3 px-4 font-medium text-gray-500">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedExams.map((exam) => (
                              <tr key={exam.id} className="border-b">
                                <td className="py-3 px-4">
                                  <div>
                                    <p className="font-medium">
                                      {exam.courseCode}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {exam.courseTitle}
                                    </p>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <Badge
                                    className={`${
                                      exam.examType === "resit"
                                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                        : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    }`}
                                  >
                                    {exam.examType === "resit"
                                      ? "Resit"
                                      : "Supplementary"}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4">
                                  <p className="text-sm">
                                    {formatDate(exam.date)}
                                  </p>
                                </td>
                                <td className="py-3 px-4">
                                  <p className="text-sm">
                                    {exam.startTime} - {exam.endTime}
                                  </p>
                                </td>
                                <td className="py-3 px-4">
                                  <p className="text-sm">{exam.venue}</p>
                                </td>
                                <td className="py-3 px-4">
                                  <p className="text-sm">{exam.invigilator}</p>
                                </td>
                                <td className="py-3 px-4">
                                  {exam.published ? (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                      Published
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                      Draft
                                    </Badge>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => {
                                        setExamToEdit(exam);
                                        setIsEditExamOpen(true);
                                      }}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-primary-red hover:text-red-700"
                                      onClick={() => handleDeleteExam(exam.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {exams.length === 0 && (
                              <tr>
                                <td
                                  colSpan={8}
                                  className="py-6 text-center text-gray-500"
                                >
                                  No exams scheduled yet. Click "Add Exam" to
                                  create a new exam.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

        <div className="min-h-screen bg-bg-gray flex flex-col">
          {/* Add Exam Dialog */}
          <Dialog open={isAddExamOpen} onOpenChange={setIsAddExamOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Exam</DialogTitle>
                <DialogDescription>
                  Schedule a new exam for resit or supplementary students.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseCode">Course Code</Label>
                    <Input
                      id="courseCode"
                      placeholder="e.g. CSC301"
                      value={newExam.courseCode}
                      onChange={(e) =>
                        setNewExam({ ...newExam, courseCode: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="examType">Exam Type</Label>
                    <Select
                      value={newExam.examType}
                      onValueChange={(value) =>
                        setNewExam({ ...newExam, examType: value })
                      }
                    >
                      <SelectTrigger id="examType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resit">Resit</SelectItem>
                        <SelectItem value="supplementary">
                          Supplementary
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseTitle">Course Title</Label>
                  <Input
                    id="courseTitle"
                    placeholder="e.g. Data Structures and Algorithms"
                    value={newExam.courseTitle}
                    onChange={(e) =>
                      setNewExam({ ...newExam, courseTitle: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newExam.date}
                      onChange={(e) =>
                        setNewExam({ ...newExam, date: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={newExam.startTime}
                        onChange={(e) =>
                          setNewExam({ ...newExam, startTime: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={newExam.endTime}
                        onChange={(e) =>
                          setNewExam({ ...newExam, endTime: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    placeholder="e.g. Main Hall, Block A"
                    value={newExam.venue}
                    onChange={(e) =>
                      setNewExam({ ...newExam, venue: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invigilator">Invigilator</Label>
                  <Input
                    id="invigilator"
                    placeholder="e.g. Dr. James Smith"
                    value={newExam.invigilator}
                    onChange={(e) =>
                      setNewExam({ ...newExam, invigilator: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddExamOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-maroon hover:bg-maroon-dark"
                  onClick={handleAddExam}
                >
                  Schedule Exam
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Exam Dialog */}
          <Dialog open={isEditExamOpen} onOpenChange={setIsEditExamOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Exam</DialogTitle>
                <DialogDescription>Update exam details.</DialogDescription>
              </DialogHeader>
              {examToEdit && (
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-courseCode">Course Code</Label>
                      <Input
                        id="edit-courseCode"
                        value={examToEdit.courseCode}
                        onChange={(e) =>
                          setExamToEdit({
                            ...examToEdit,
                            courseCode: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-examType">Exam Type</Label>
                      <Select
                        value={examToEdit.examType}
                        onValueChange={(value) =>
                          setExamToEdit({ ...examToEdit, examType: value })
                        }
                      >
                        <SelectTrigger id="edit-examType">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="resit">Resit</SelectItem>
                          <SelectItem value="supplementary">
                            Supplementary
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-courseTitle">Course Title</Label>
                    <Input
                      id="edit-courseTitle"
                      value={examToEdit.courseTitle}
                      onChange={(e) =>
                        setExamToEdit({
                          ...examToEdit,
                          courseTitle: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-date">Date</Label>
                      <Input
                        id="edit-date"
                        type="date"
                        value={examToEdit.date}
                        onChange={(e) =>
                          setExamToEdit({ ...examToEdit, date: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="edit-startTime">Start Time</Label>
                        <Input
                          id="edit-startTime"
                          type="time"
                          value={examToEdit.startTime}
                          onChange={(e) =>
                            setExamToEdit({
                              ...examToEdit,
                              startTime: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-endTime">End Time</Label>
                        <Input
                          id="edit-endTime"
                          type="time"
                          value={examToEdit.endTime}
                          onChange={(e) =>
                            setExamToEdit({
                              ...examToEdit,
                              endTime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-venue">Venue</Label>
                    <Input
                      id="edit-venue"
                      value={examToEdit.venue}
                      onChange={(e) =>
                        setExamToEdit({ ...examToEdit, venue: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-invigilator">Invigilator</Label>
                    <Input
                      id="edit-invigilator"
                      value={examToEdit.invigilator}
                      onChange={(e) =>
                        setExamToEdit({
                          ...examToEdit,
                          invigilator: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditExamOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-maroon hover:bg-maroon-dark"
                  onClick={handleEditExam}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Publish Timetable Dialog */}
          <Dialog
            open={isPublishDialogOpen}
            onOpenChange={setIsPublishDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Publish Timetable</DialogTitle>
                <DialogDescription>
                  Are you sure you want to publish all unpublished exams to the
                  students?
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="bg-blue-50 p-4 rounded-md flex">
                  <div>
                    <h4 className="font-medium text-blue-700 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Publishing will do the following:
                    </h4>
                    <ul className="text-sm text-blue-600 mt-2 space-y-1">
                      <li>• Make all unpublished exams visible to students</li>
                      <li>• Send email notifications to affected students</li>
                      <li>• Update the student dashboards</li>
                    </ul>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsPublishDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handlePublishTimetable}
                >
                  Publish Timetable
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </MainLayout>
    </>
  );
};

export default ManageTimetable;
