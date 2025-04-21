
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { useData } from '@/contexts/DataContext';
// import MainLayout from '@/components/layout/MainLayout';
// import MobileNavbar from '@/components/layout/MobileNavbar';

// const Timetable = () => {
//   const { user, isAuthenticated, isAdmin } = useAuth();
//   const { applications, timetableEntries, courses } = useData();
//   const navigate = useNavigate();

//   // Redirect if not authenticated or if admin
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//     } else if (isAdmin) {
//       navigate('/admin/dashboard');
//     }
//   }, [isAuthenticated, isAdmin, navigate]);

//   // Get the approved applications for this student
//   const approvedApplications = applications.filter(
//     app => app.studentId === user?.id && app.status === 'APPROVED'
//   );

//   // Get the course IDs from the approved applications
//   const approvedCourseIds = approvedApplications.flatMap(app => app.courses);

//   // Get the timetable entries for the approved courses
//   const studentTimetable = timetableEntries.filter(
//     entry => approvedCourseIds.includes(entry.courseId)
//   );

//   if (!isAuthenticated || isAdmin) {
//     return null; // Redirect will happen in useEffect
//   }

//   return (
    // <>
    //   <MobileNavbar />
    //   <MainLayout title="Exam Timetable">
    //     <div className="mb-6">
    //       <h2 className="text-2xl font-bold text-maroon mb-2">Your Exam Timetable</h2>
    //       <p className="text-gray-600">
    //         View the schedule for your approved resit and supplementary examinations.
    //       </p>
    //     </div>

//         {approvedApplications.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <h3 className="text-xl font-semibold text-maroon mb-4">No Approved Applications</h3>
//             <p className="text-gray-600">
//               You don't have any approved resit or supplementary applications yet.
//               Once your applications are approved, your exam timetable will appear here.
//             </p>
//           </div>
//         ) : studentTimetable.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <h3 className="text-xl font-semibold text-maroon mb-4">Timetable Not Released Yet</h3>
//             <p className="text-gray-600">
//               Your applications have been approved, but the exam timetable has not been released yet.
//               Please check back later.
//             </p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-maroon text-white">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                       Course
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                       Time
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                       Venue
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {studentTimetable.map((entry) => {
//                     const course = courses.find(c => c.id === entry.courseId);
                    
//                     return (
//                       <tr key={entry.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">
//                             {course?.code}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {course?.title}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {entry.date}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {entry.startTime} - {entry.endTime}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {entry.venue}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </MainLayout>
//     </>
//   );
// };

// export default Timetable;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent,  CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const ViewTimetable = () => {
  const navigate = useNavigate();
  const [examType, setExamType] = useState<string>("all");
  
  // Mock exam timetable data
  const exams = [
    {
      id: 1,
      type: "Resit",
      courseCode: "CSC301",
      courseTitle: "Data Structures and Algorithms",
      date: "2025-05-15",
      startTime: "10:00",
      endTime: "12:00",
      venue: "Main Hall, Block A",
      invigilator: "Dr. James Smith"
    },
    {
      id: 2,
      type: "Resit",
      courseCode: "MAT305",
      courseTitle: "Linear Algebra",
      date: "2025-05-17",
      startTime: "14:00",
      endTime: "16:00",
      venue: "Science Block, Room 203",
      invigilator: "Prof. Mary Johnson"
    },
    {
      id: 3,
      type: "Supplementary",
      courseCode: "PHY302",
      courseTitle: "Quantum Mechanics",
      date: "2025-05-12",
      startTime: "09:00",
      endTime: "11:00",
      venue: "Science Block, Room 105",
      invigilator: "Dr. Robert Williams"
    },
    {
      id: 4,
      type: "Supplementary",
      courseCode: "BIO301",
      courseTitle: "Molecular Biology",
      date: "2025-05-20",
      startTime: "13:00",
      endTime: "15:00",
      venue: "Life Sciences Building, Lab 3",
      invigilator: "Dr. Sarah Thompson"
    },
    {
      id: 5,
      type: "Resit",
      courseCode: "ENG202",
      courseTitle: "Technical Writing",
      date: "2025-05-22",
      startTime: "10:00",
      endTime: "12:00",
      venue: "Arts Block, Room 102",
      invigilator: "Prof. Emma Brown"
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const filteredExams = examType === "all" 
    ? exams 
    : exams.filter(exam => exam.type.toLowerCase() === examType);

  // Sort exams by date
  const sortedExams = [...filteredExams].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
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

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <MainLayout title="Exam Timetable">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-maroon mb-2">Your Exam Timetable</h2>
          <p className="text-gray-600">
            View the schedule for your approved resit and supplementary examinations.
          </p>
        </div>

          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-dark-blue" />
              <span className="text-sm font-medium">Exam Period: May 10 - May 25, 2025</span>
            </div>
            
            <div className="w-full sm:w-auto">
              <Select value={examType} onValueChange={setExamType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  <SelectItem value="resit">Resit Exams</SelectItem>
                  <SelectItem value="supplementary">Supplementary Exams</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {Object.keys(examsByDate).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(examsByDate).map(([date, exams]) => (
                <Card key={date}>
                  <CardHeader className="bg-maroon text-white rounded-t-lg">
                    <CardTitle>{formatDate(date)}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {exams.map((exam) => (
                        <div key={exam.id} className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h3 className="font-medium text-lg">{exam.courseCode}: {exam.courseTitle}</h3>
                              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                                <div className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                  <span>{exam.startTime} - {exam.endTime}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                  <span>{exam.venue}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Invigilator: {exam.invigilator}</p>
                            </div>
                            <div className="flex items-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                exam.type === "Resit" 
                                  ? "bg-amber-100 text-amber-800" 
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {exam.type}
                              </span>
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
                <h3 className="text-lg font-medium text-gray-900">No exams found</h3>
                <p className="text-gray-500 text-center mt-1">
                  {examType === "all" 
                    ? "You don't have any scheduled exams at the moment." 
                    : `You don't have any scheduled ${examType} exams at the moment.`}
                </p>
              </CardContent>
            </Card>
          )}
      </MainLayout>
    </>
  );
};

export default ViewTimetable;

