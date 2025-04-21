// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { useData } from '@/contexts/DataContext';
// import MainLayout from '@/components/layout/MainLayout';
// import MobileNavbar from '@/components/layout/MobileNavbar';
// import StatusBadge from '@/components/ui/StatusBadge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Calendar, FileText, Clock, DollarSign, FileCheck } from 'lucide-react';

// const ApplicationStatus = () => {
//   const { user, isAuthenticated, isAdmin } = useAuth();
//   const { applications, courses, updateApplication } = useData();
//   const navigate = useNavigate();

//   // Redirect if not authenticated or if admin
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//     } else if (isAdmin) {
//       navigate('/admin/dashboard');
//     }
//   }, [isAuthenticated, isAdmin, navigate]);

//   // Get the student's applications
//   const studentApplications = applications.filter(
//     application => application.studentId === user?.id
//   );

//   // Separate applications by type
//   const resitApplications = studentApplications.filter(app => app.type === 'RESIT');
//   const supplementaryApplications = studentApplications.filter(app => app.type === 'SUPPLEMENTARY');

//   // Function to display course names based on course IDs
//   const getCourseNames = (courseIds: string[]) => {
//     return courseIds.map(id => {
//       const course = courses.find(c => c.id === id);
//       return course ? `${course.code} - ${course.title}` : 'Unknown Course';
//     });
//   };

//   // Handle payment simulation
//   const handlePaymentSimulation = async (applicationId: string, totalFee: number = 0) => {
//     try {
//       // In a real app, this would redirect to a payment gateway
//       await updateApplication(applicationId, {
//         paymentStatus: 'PAID',
//       });
//     } catch (error) {
//       console.error('Payment error:', error);
//     }
//   };

//   if (!isAuthenticated || isAdmin) {
//     return null; // Redirect will happen in useEffect
//   }

//   return (
// <>
//   <MobileNavbar />
//   <MainLayout title="Application Status">
//     <div className="mb-6">
//       <h2 className="text-2xl font-bold text-maroon mb-2">Your Applications</h2>
//       <p className="text-gray-600">
//         Track the status of your resit and supplementary applications.
//       </p>
//     </div>

//         <Tabs defaultValue="all" className="w-full">
//           <TabsList className="grid w-full grid-cols-3 mb-6">
//             <TabsTrigger value="all">All Applications</TabsTrigger>
//             <TabsTrigger value="resit">Resit</TabsTrigger>
//             <TabsTrigger value="supplementary">Supplementary</TabsTrigger>
//           </TabsList>

//           {/* All Applications Tab */}
//           <TabsContent value="all">
//             {studentApplications.length === 0 ? (
//               <div className="bg-white rounded-lg shadow-md p-8 text-center">
//                 <h3 className="text-xl font-semibold text-maroon mb-4">No Applications Found</h3>
//                 <p className="text-gray-600 mb-4">
//                   You haven't submitted any resit or supplementary applications yet.
//                 </p>
//                 <div className="flex flex-col sm:flex-row justify-center gap-4">
//                   <Button
//                     className="bg-maroon hover:bg-maroon-dark text-white"
//                     onClick={() => navigate('/student/resit-application')}
//                   >
//                     Apply for Resit
//                   </Button>
//                   <Button
//                     className="bg-maroon hover:bg-maroon-dark text-white"
//                     onClick={() => navigate('/student/supplementary-application')}
//                   >
//                     Apply for Supplementary
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-6">
//                 {studentApplications
//                   .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//                   .map(application => {
//                     const courseNames = getCourseNames(application.courses);

//                     return (
//                       <Card key={application.id} className="border-l-4 border-maroon">
//                         <CardHeader>
//                           <div className="flex flex-col md:flex-row justify-between md:items-center">
//                             <div>
//                               <CardTitle className="flex items-center">
//                                 {application.type === 'RESIT' ? (
//                                   <FileText className="h-5 w-5 mr-2 text-maroon" />
//                                 ) : (
//                                   <FileCheck className="h-5 w-5 mr-2 text-maroon" />
//                                 )}
//                                 {application.type === 'RESIT' ? 'Resit Application' : 'Supplementary Application'}
//                               </CardTitle>
//                               <CardDescription>
//                                 Submitted on: {new Date(application.createdAt).toLocaleDateString()}
//                               </CardDescription>
//                             </div>
//                             <StatusBadge status={application.status} className="md:ml-4 mt-2 md:mt-0" />
//                           </div>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="space-y-3">
//                             <div>
//                               <h4 className="text-sm font-medium text-gray-500 mb-1">Selected Courses:</h4>
//                               <ul className="list-disc pl-5 space-y-1">
//                                 {courseNames.map((name, index) => (
//                                   <li key={index} className="text-sm">{name}</li>
//                                 ))}
//                               </ul>
//                             </div>

//                             {application.type === 'RESIT' && (
//                               <div>
//                                 <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Details:</h4>
//                                 <div className="bg-gray-50 p-3 rounded-md">
//                                   <p className="text-sm flex justify-between">
//                                     <span>Total Fee:</span>
//                                     <span className="font-semibold">GHS {application.totalFee}</span>
//                                   </p>
//                                   <p className="text-sm flex justify-between mt-1">
//                                     <span>Payment Status:</span>
//                                     <StatusBadge status={application.paymentStatus || 'UNPAID'} />
//                                   </p>
//                                 </div>
//                               </div>
//                             )}

//                             {application.type === 'SUPPLEMENTARY' && application.documents && (
//                               <div>
//                                 <h4 className="text-sm font-medium text-gray-500 mb-1">Supporting Documents:</h4>
//                                 <div className="bg-gray-50 p-3 rounded-md">
//                                   {application.documents.map((doc, index) => (
//                                     <div key={index} className="flex items-center justify-between">
//                                       <span className="text-sm">{doc.name}</span>
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         className="text-maroon hover:text-maroon-dark"
//                                         onClick={() => window.open(doc.url, '_blank')}
//                                       >
//                                         View
//                                       </Button>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}

//                             {application.adminComments && (
//                               <div>
//                                 <h4 className="text-sm font-medium text-gray-500 mb-1">Comments:</h4>
//                                 <div className="bg-gray-50 p-3 rounded-md">
//                                   <p className="text-sm">{application.adminComments}</p>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </CardContent>
//                         <CardFooter>
//                           {application.type === 'RESIT' && application.paymentStatus === 'UNPAID' && application.status === 'PENDING' && (
//                             <Button
//                               className="bg-gold hover:bg-amber-500 text-maroon"
//                               onClick={() => handlePaymentSimulation(application.id, application.totalFee)}
//                             >
//                               <DollarSign className="h-4 w-4 mr-2" />
//                               Pay Now
//                             </Button>
//                           )}
//                         </CardFooter>
//                       </Card>
//                     );
//                   })}
//               </div>
//             )}
//           </TabsContent>

//           {/* Resit Tab */}
//           <TabsContent value="resit">
//             {resitApplications.length === 0 ? (
//               <div className="bg-white rounded-lg shadow-md p-8 text-center">
//                 <h3 className="text-xl font-semibold text-maroon mb-4">No Resit Applications</h3>
//                 <p className="text-gray-600 mb-4">
//                   You haven't submitted any resit applications yet.
//                 </p>
//                 <Button
//                   className="bg-maroon hover:bg-maroon-dark text-white"
//                   onClick={() => navigate('/student/resit-application')}
//                 >
//                   Apply for Resit
//                 </Button>
//               </div>
//             ) : (
//               // Render resit applications (same format as all applications)
//               <div className="space-y-6">
//                 {resitApplications
//                   .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//                   .map(application => {
//                     const courseNames = getCourseNames(application.courses);

//                     return (
//                       <Card key={application.id} className="border-l-4 border-maroon">
//                         <CardHeader>
//                           <div className="flex flex-col md:flex-row justify-between md:items-center">
//                             <div>
//                               <CardTitle className="flex items-center">
//                                 <FileText className="h-5 w-5 mr-2 text-maroon" />
//                                 Resit Application
//                               </CardTitle>
//                               <CardDescription>
//                                 Submitted on: {new Date(application.createdAt).toLocaleDateString()}
//                               </CardDescription>
//                             </div>
//                             <StatusBadge status={application.status} className="md:ml-4 mt-2 md:mt-0" />
//                           </div>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="space-y-3">
//                             <div>
//                               <h4 className="text-sm font-medium text-gray-500 mb-1">Selected Courses:</h4>
//                               <ul className="list-disc pl-5 space-y-1">
//                                 {courseNames.map((name, index) => (
//                                   <li key={index} className="text-sm">{name}</li>
//                                 ))}
//                               </ul>
//                             </div>

//                             <div>
//                               <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Details:</h4>
//                               <div className="bg-gray-50 p-3 rounded-md">
//                                 <p className="text-sm flex justify-between">
//                                   <span>Total Fee:</span>
//                                   <span className="font-semibold">GHS {application.totalFee}</span>
//                                 </p>
//                                 <p className="text-sm flex justify-between mt-1">
//                                   <span>Payment Status:</span>
//                                   <StatusBadge status={application.paymentStatus || 'UNPAID'} />
//                                 </p>
//                               </div>
//                             </div>

//                             {application.adminComments && (
//                               <div>
//                                 <h4 className="text-sm font-medium text-gray-500 mb-1">Comments:</h4>
//                                 <div className="bg-gray-50 p-3 rounded-md">
//                                   <p className="text-sm">{application.adminComments}</p>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </CardContent>
//                         <CardFooter>
//                           {application.paymentStatus === 'UNPAID' && application.status === 'PENDING' && (
//                             <Button
//                               className="bg-gold hover:bg-amber-500 text-maroon"
//                               onClick={() => handlePaymentSimulation(application.id, application.totalFee)}
//                             >
//                               <DollarSign className="h-4 w-4 mr-2" />
//                               Pay Now
//                             </Button>
//                           )}
//                         </CardFooter>
//                       </Card>
//                     );
//                   })}
//               </div>
//             )}
//           </TabsContent>

//           {/* Supplementary Tab */}
//           <TabsContent value="supplementary">
//             {supplementaryApplications.length === 0 ? (
//               <div className="bg-white rounded-lg shadow-md p-8 text-center">
//                 <h3 className="text-xl font-semibold text-maroon mb-4">No Supplementary Applications</h3>
//                 <p className="text-gray-600 mb-4">
//                   You haven't submitted any supplementary applications yet.
//                 </p>
//                 <Button
//                   className="bg-maroon hover:bg-maroon-dark text-white"
//                   onClick={() => navigate('/student/supplementary-application')}
//                 >
//                   Apply for Supplementary
//                 </Button>
//               </div>
//             ) : (
//               // Render supplementary applications (same format as all applications)
//               <div className="space-y-6">
//                 {supplementaryApplications
//                   .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
//                   .map(application => {
//                     const courseNames = getCourseNames(application.courses);

//                     return (
//                       <Card key={application.id} className="border-l-4 border-maroon">
//                         <CardHeader>
//                           <div className="flex flex-col md:flex-row justify-between md:items-center">
//                             <div>
//                               <CardTitle className="flex items-center">
//                                 <FileCheck className="h-5 w-5 mr-2 text-maroon" />
//                                 Supplementary Application
//                               </CardTitle>
//                               <CardDescription>
//                                 Submitted on: {new Date(application.createdAt).toLocaleDateString()}
//                               </CardDescription>
//                             </div>
//                             <StatusBadge status={application.status} className="md:ml-4 mt-2 md:mt-0" />
//                           </div>
//                         </CardHeader>
//                         <CardContent>
//                           <div className="space-y-3">
//                             <div>
//                               <h4 className="text-sm font-medium text-gray-500 mb-1">Selected Courses:</h4>
//                               <ul className="list-disc pl-5 space-y-1">
//                                 {courseNames.map((name, index) => (
//                                   <li key={index} className="text-sm">{name}</li>
//                                 ))}
//                               </ul>
//                             </div>

//                             {application.documents && (
//                               <div>
//                                 <h4 className="text-sm font-medium text-gray-500 mb-1">Supporting Documents:</h4>
//                                 <div className="bg-gray-50 p-3 rounded-md">
//                                   {application.documents.map((doc, index) => (
//                                     <div key={index} className="flex items-center justify-between">
//                                       <span className="text-sm">{doc.name}</span>
//                                       <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         className="text-maroon hover:text-maroon-dark"
//                                         onClick={() => window.open(doc.url, '_blank')}
//                                       >
//                                         View
//                                       </Button>
//                                     </div>
//                                   ))}
//                                 </div>
//                               </div>
//                             )}

//                             {application.adminComments && (
//                               <div>
//                                 <h4 className="text-sm font-medium text-gray-500 mb-1">Comments:</h4>
//                                 <div className="bg-gray-50 p-3 rounded-md">
//                                   <p className="text-sm">{application.adminComments}</p>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </CardContent>
//                       </Card>
//                     );
//                   })}
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </MainLayout>
//     </>
//   );
// };

// export default ApplicationStatus;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
} from "lucide-react";
import MobileNavbar from "@/components/layout/MobileNavbar";
import MainLayout from "@/components/layout/MainLayout";

const ApplicationStatus = () => {
  const navigate = useNavigate();

  // Mock application data
  const applications = [
    {
      id: "RES-2345",
      type: "Resit",
      course: "CSC301: Data Structures and Algorithms",
      submittedDate: "2025-04-01",
      status: "Approved",
      reviewDate: "2025-04-03",
      examDate: "2025-05-15",
      venue: "Main Hall, Block A",
      paymentStatus: "Paid",
      amount: 100,
      notes: "Approval granted. Please check timetable for exam schedule.",
    },
    {
      id: "RES-2346",
      type: "Resit",
      course: "MAT305: Linear Algebra",
      submittedDate: "2025-04-01",
      status: "Pending",
      reviewDate: null,
      examDate: null,
      venue: null,
      paymentStatus: "Paid",
      amount: 100,
      notes: "Your application is under review.",
    },
    {
      id: "SUP-1234",
      type: "Supplementary",
      course: "PHY302: Quantum Mechanics",
      submittedDate: "2025-03-25",
      status: "Approved",
      reviewDate: "2025-03-28",
      examDate: "2025-05-12",
      venue: "Science Block, Room 105",
      paymentStatus: "N/A",
      amount: 0,
      notes: "Medical documentation verified. Approval granted.",
    },
    {
      id: "SUP-1235",
      type: "Supplementary",
      course: "BIO301: Molecular Biology",
      submittedDate: "2025-03-25",
      status: "Rejected",
      reviewDate: "2025-03-30",
      examDate: null,
      venue: null,
      paymentStatus: "N/A",
      amount: 0,
      notes:
        "Insufficient documentation provided. Please reapply with proper medical documentation.",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "Rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <MobileNavbar />
      <MainLayout title="Application Status">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-maroon mb-2">
            Your Applications
          </h2>
          <p className="text-gray-600">
            Track the status of your resit and supplementary applications.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Applications</CardTitle>
            <CardDescription>
              View and track all your applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Applications</TabsTrigger>
                <TabsTrigger value="resit">Resit</TabsTrigger>
                <TabsTrigger value="supplementary">Supplementary</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="space-y-6">
                  {applications.map((app) => (
                    <ApplicationCard key={app.id} application={app} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="resit">
                <div className="space-y-6">
                  {applications
                    .filter((app) => app.type === "Resit")
                    .map((app) => (
                      <ApplicationCard key={app.id} application={app} />
                    ))}
                </div>
              </TabsContent>
              <TabsContent value="supplementary">
                <div className="space-y-6">
                  {applications
                    .filter((app) => app.type === "Supplementary")
                    .map((app) => (
                      <ApplicationCard key={app.id} application={app} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </MainLayout>
    </>
  );
};

interface ApplicationCardProps {
  application: {
    id: string;
    type: string;
    course: string;
    submittedDate: string;
    status: string;
    reviewDate: string | null;
    examDate: string | null;
    venue: string | null;
    paymentStatus: string;
    amount: number;
    notes: string;
  };
}

const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "Rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Approved
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pending
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon(application.status)}
          <div>
            <h3 className="font-medium">{application.course}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span className="mr-2">{application.id}</span>
              <span className="mr-2">•</span>
              <span>{application.type}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Submitted: {formatDate(application.submittedDate)}
            </p>
            <div>
              {application.status === "Approved" && application.examDate ? (
                <p className="text-sm font-medium text-green-600">
                  Exam: {formatDate(application.examDate)}
                </p>
              ) : (
                getStatusBadge(application.status)
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show Less" : "Show More"}
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Application Details
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Application Type:
                  </span>
                  <span className="text-sm">{application.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Submitted Date:</span>
                  <span className="text-sm">
                    {formatDate(application.submittedDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Review Date:</span>
                  <span className="text-sm">
                    {formatDate(application.reviewDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className="text-sm">{application.status}</span>
                </div>
                {application.type === "Resit" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Payment Status:
                      </span>
                      <span className="text-sm">
                        {application.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Amount Paid:
                      </span>
                      <span className="text-sm">GHS {application.amount}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

{/* Exams info */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">
                Exam Information
              </h4>
              <div className="space-y-1">
                {application.examDate ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Exam Date:</span>
                      <span className="text-sm">
                        {formatDate(application.examDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Venue:</span>
                      <span className="text-sm">{application.venue}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    {application.status === "Approved"
                      ? "Exam details will be published soon."
                      : "Exam details not available."}
                  </p>
                )}
              </div>

              <h4 className="text-sm font-medium text-gray-500 mt-4 mb-1">
                Notes
              </h4>
              <p className="text-sm">{application.notes}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t flex justify-end space-x-3">
            {application.status === "Approved" && application.examDate && (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center"
                onClick={() => window.open("/view-timetable", "_blank")}
              >
                <Calendar className="h-4 w-4 mr-1" />
                View Timetable
              </Button>
            )}
            <Button variant="outline" size="sm" className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              Download Receipt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;
