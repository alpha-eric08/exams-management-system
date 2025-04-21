
// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { useData, Application } from '@/contexts/DataContext';
// import MainLayout from '@/components/layout/MainLayout';
// import MobileNavbar from '@/components/layout/MobileNavbar';
// import StatusBadge from '@/components/ui/StatusBadge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Textarea } from '@/components/ui/textarea';
// import { toast } from '@/components/ui/use-toast';
// import { 
//   Search, 
//   Check, 
//   X, 
//   FileText, 
//   FileCheck,
//   CheckCircle,
//   XCircle
// } from 'lucide-react';

// const ApproveApplications = () => {
//   const { isAuthenticated, isAdmin } = useAuth();
//   const { applications, courses, updateApplication } = useData();
//   const navigate = useNavigate();

//   const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
//   const [adminComment, setAdminComment] = useState('');
//   const [showApproveDialog, setShowApproveDialog] = useState(false);
//   const [showRejectDialog, setShowRejectDialog] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Redirect if not authenticated or not admin
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//     } else if (!isAdmin) {
//       navigate('/student/dashboard');
//     }
//   }, [isAuthenticated, isAdmin, navigate]);

//   // Initialize filtered applications
//   useEffect(() => {
//     setFilteredApplications(applications);
//   }, [applications]);

//   // Handle search
//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
    
//     if (!term) {
//       setFilteredApplications(applications);
//       return;
//     }
    
//     const filtered = applications.filter(app => {
//       // Search by application type
//       if (app.type.toLowerCase().includes(term)) return true;
      
//       // Search by status
//       if (app.status.toLowerCase().includes(term)) return true;
      
//       // Search by course code (if we had student data we could search by name too)
//       return app.courses.some(courseId => {
//         const course = courses.find(c => c.id === courseId);
//         return course?.code.toLowerCase().includes(term) || course?.title.toLowerCase().includes(term);
//       });
//     });
    
//     setFilteredApplications(filtered);
//   };

//   // Filter applications by type
//   const resitApplications = filteredApplications.filter(app => app.type === 'RESIT');
//   const supplementaryApplications = filteredApplications.filter(app => app.type === 'SUPPLEMENTARY');
  
//   // Handle approval
//   const handleApprove = async () => {
//     if (!selectedApplication) return;
    
//     setIsProcessing(true);
    
//     try {
//       await updateApplication(selectedApplication.id, {
//         status: 'APPROVED',
//         adminComments: adminComment || 'Application approved',
//       });
      
//       toast({
//         title: 'Application approved',
//         description: 'The application has been successfully approved.',
//       });
      
//       setShowApproveDialog(false);
//       setSelectedApplication(null);
//       setAdminComment('');
//     } catch (error) {
//       console.error('Error approving application:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Error',
//         description: 'Failed to approve application. Please try again.',
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Handle rejection
//   const handleReject = async () => {
//     if (!selectedApplication) return;
//     if (!adminComment) {
//       toast({
//         variant: 'destructive',
//         title: 'Comment required',
//         description: 'Please provide a reason for rejecting this application.',
//       });
//       return;
//     }
    
//     setIsProcessing(true);
    
//     try {
//       await updateApplication(selectedApplication.id, {
//         status: 'REJECTED',
//         adminComments: adminComment,
//       });
      
//       toast({
//         title: 'Application rejected',
//         description: 'The application has been rejected.',
//       });
      
//       setShowRejectDialog(false);
//       setSelectedApplication(null);
//       setAdminComment('');
//     } catch (error) {
//       console.error('Error rejecting application:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Error',
//         description: 'Failed to reject application. Please try again.',
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (!isAuthenticated || !isAdmin) {
//     return null; // Redirect will happen in useEffect
//   }

//   // Function to display course names based on course IDs
//   const getCourseNames = (courseIds: string[]) => {
//     return courseIds.map(id => {
//       const course = courses.find(c => c.id === id);
//       return course ? `${course.code} - ${course.title}` : 'Unknown Course';
//     });
//   };

//   // Render application table
//   const renderApplicationTable = (apps: Application[]) => {
//     if (apps.length === 0) {
//       return (
//         <div className="bg-white rounded-lg shadow-md p-8 text-center">
//           <p className="text-gray-600">No applications found.</p>
//         </div>
//       );
//     }

//     return (
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-maroon text-white">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Type
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Courses
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Payment
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {apps.map((application) => (
//                 <tr key={application.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {application.type === 'RESIT' ? 'Resit' : 'Supplementary'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(application.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {application.courses.length} courses
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <StatusBadge status={application.status} />
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {application.type === 'RESIT' ? (
//                       <StatusBadge status={application.paymentStatus || 'UNPAID'} />
//                     ) : (
//                       <span className="text-sm text-gray-500">N/A</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex space-x-2">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="text-blue-600 hover:text-blue-800"
//                         onClick={() => {
//                           setSelectedApplication(application);
//                           // Here we would show a details dialog, but for simplicity we just show approve/reject
//                           // For a real app, we'd show all application details in a modal
//                           toast({
//                             title: 'Application Details',
//                             description: `Selected ${application.courses.length} courses. ${
//                               application.type === 'RESIT'
//                                 ? `Fee: GHS ${application.totalFee}`
//                                 : 'Supporting documents available'
//                             }`,
//                           });
//                         }}
//                       >
//                         Details
//                       </Button>
                      
//                       {application.status === 'PENDING' && (
//                         <>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-green-600 hover:text-green-800"
//                             onClick={() => {
//                               // For RESIT applications, only allow approval if paid
//                               if (application.type === 'RESIT' && application.paymentStatus !== 'PAID') {
//                                 toast({
//                                   variant: 'destructive',
//                                   title: 'Cannot approve',
//                                   description: 'This resit application has not been paid for yet.',
//                                 });
//                                 return;
//                               }
                              
//                               setSelectedApplication(application);
//                               setShowApproveDialog(true);
//                             }}
//                           >
//                             Approve
//                           </Button>
                          
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-red-600 hover:text-red-800"
//                             onClick={() => {
//                               setSelectedApplication(application);
//                               setShowRejectDialog(true);
//                             }}
//                           >
//                             Reject
//                           </Button>
//                         </>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   return (
    // <>
    //   <MobileNavbar />
    //   <MainLayout title="Approve Applications">
    //     <div className="mb-6">
    //       <h2 className="text-2xl font-bold text-maroon mb-2">Application Management</h2>
    //       <p className="text-gray-600">
    //         Review and approve/reject student applications for resit and supplementary examinations.
    //       </p>
    //     </div>
        
//         {/* Search and Filter */}
//         <div className="mb-6">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//             <Input
//               className="pl-10"
//               placeholder="Search applications..."
//               value={searchTerm}
//               onChange={handleSearch}
//             />
//           </div>
//         </div>

//         {/* Applications Tabs */}
//         <Tabs defaultValue="all" className="w-full">
//           <TabsList className="grid w-full grid-cols-3 mb-6">
//             <TabsTrigger value="all">All Applications</TabsTrigger>
//             <TabsTrigger value="resit">Resit</TabsTrigger>
//             <TabsTrigger value="supplementary">Supplementary</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="all">
//             {renderApplicationTable(filteredApplications)}
//           </TabsContent>
          
//           <TabsContent value="resit">
//             {renderApplicationTable(resitApplications)}
//           </TabsContent>
          
//           <TabsContent value="supplementary">
//             {renderApplicationTable(supplementaryApplications)}
//           </TabsContent>
//         </Tabs>

//         {/* Approve Dialog */}
//         <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Approve Application</DialogTitle>
//               <DialogDescription>
//                 Are you sure you want to approve this {selectedApplication?.type.toLowerCase()} application?
//                 This will allow the student to attend the examination.
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="mt-2">
//               <label htmlFor="admin-comment" className="block text-sm font-medium text-gray-700 mb-1">
//                 Comments (optional)
//               </label>
//               <Textarea
//                 id="admin-comment"
//                 placeholder="Add any comments or notes..."
//                 value={adminComment}
//                 onChange={(e) => setAdminComment(e.target.value)}
//               />
//             </div>
            
//             <DialogFooter>
//               <Button 
//                 variant="outline" 
//                 onClick={() => setShowApproveDialog(false)}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 className="bg-green-600 hover:bg-green-700 text-white"
//                 onClick={handleApprove}
//                 disabled={isProcessing}
//               >
//                 <CheckCircle className="h-4 w-4 mr-2" />
//                 {isProcessing ? 'Processing...' : 'Confirm Approval'}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Reject Dialog */}
//         <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Reject Application</DialogTitle>
//               <DialogDescription>
//                 Are you sure you want to reject this {selectedApplication?.type.toLowerCase()} application?
//                 The student will not be allowed to attend the examination.
//               </DialogDescription>
//             </DialogHeader>
            
//             <div className="mt-2">
//               <label htmlFor="reject-reason" className="block text-sm font-medium text-gray-700 mb-1">
//                 Reason for rejection <span className="text-red-600">*</span>
//               </label>
//               <Textarea
//                 id="reject-reason"
//                 placeholder="Provide a reason for rejecting this application..."
//                 value={adminComment}
//                 onChange={(e) => setAdminComment(e.target.value)}
//                 className="border-red-200 focus:border-red-300"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 This reason will be visible to the student.
//               </p>
//             </div>
            
//             <DialogFooter>
//               <Button 
//                 variant="outline" 
//                 onClick={() => setShowRejectDialog(false)}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 className="bg-red-600 hover:bg-red-700 text-white"
//                 onClick={handleReject}
//                 disabled={isProcessing || !adminComment}
//               >
//                 <XCircle className="h-4 w-4 mr-2" />
//                 {isProcessing ? 'Processing...' : 'Confirm Rejection'}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </MainLayout>
//     </>
//   );
// };

// export default ApproveApplications;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, XCircle, Eye, Search, Filter, Download, 
  ArrowUpDown, FileText, Clock, BarChart
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import MobileNavbar from "@/components/layout/MobileNavbar";
import MainLayout from "@/components/layout/MainLayout";

const ApproveApplications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  
  // Mock applications data
  const applicationsData = [
    {
      id: "RES-2345",
      studentId: "STU12345",
      studentName: "John Doe",
      type: "Resit",
      course: "CSC301: Data Structures and Algorithms",
      submittedDate: "2025-04-02",
      status: "Pending",
      paymentStatus: "Paid",
      amount: 100,
      previousGrade: "E",
      documents: [],
      notes: ""
    },
    {
      id: "SUP-1234",
      studentId: "STU23456",
      studentName: "Jane Smith",
      type: "Supplementary",
      course: "PHY302: Quantum Mechanics",
      submittedDate: "2025-04-01",
      status: "Pending",
      paymentStatus: "N/A",
      amount: 0,
      previousGrade: "Missed",
      documents: [
        { name: "Medical Report.pdf", url: "#", date: "2025-04-01" }
      ],
      notes: ""
    },
    {
      id: "RES-2346",
      studentId: "STU34567",
      studentName: "Michael Johnson",
      type: "Resit",
      course: "MAT305: Linear Algebra",
      submittedDate: "2025-03-30",
      status: "Approved",
      paymentStatus: "Paid",
      amount: 100,
      previousGrade: "F",
      documents: [],
      notes: "Approved on 2025-04-02"
    },
    {
      id: "SUP-1235",
      studentId: "STU45678",
      studentName: "Sarah Williams",
      type: "Supplementary",
      course: "BIO301: Molecular Biology",
      submittedDate: "2025-03-29",
      status: "Rejected",
      paymentStatus: "N/A",
      amount: 0,
      previousGrade: "Missed",
      documents: [
        { name: "Supporting Document.pdf", url: "#", date: "2025-03-29" }
      ],
      notes: "Insufficient documentation. Student needs to provide official medical report."
    },
    {
      id: "RES-2347",
      studentId: "STU56789",
      studentName: "David Brown",
      type: "Resit",
      course: "ENG202: Technical Writing",
      submittedDate: "2025-04-03",
      status: "Pending",
      paymentStatus: "Paid",
      amount: 100,
      previousGrade: "D",
      documents: [],
      notes: ""
    },
    {
      id: "SUP-1236",
      studentId: "STU67890",
      studentName: "Emily Davis",
      type: "Supplementary",
      course: "CHE305: Organic Chemistry",
      submittedDate: "2025-04-03",
      status: "Pending",
      paymentStatus: "N/A",
      amount: 0,
      previousGrade: "Missed",
      documents: [
        { name: "Hospital Record.pdf", url: "#", date: "2025-04-03" }
      ],
      notes: ""
    },
  ];

  const [applications, setApplications] = useState(applicationsData);

  // Filter applications based on search, type, and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterBy === "resit") {
      matchesFilter = app.type === "Resit";
    } else if (filterBy === "supplementary") {
      matchesFilter = app.type === "Supplementary";
    } else if (filterBy === "pending") {
      matchesFilter = app.status === "Pending";
    } else if (filterBy === "approved") {
      matchesFilter = app.status === "Approved";
    } else if (filterBy === "rejected") {
      matchesFilter = app.status === "Rejected";
    }
    
    return matchesSearch && matchesFilter;
  });

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
    } else if (sortBy === "studentName") {
      return a.studentName.localeCompare(b.studentName);
    } else if (sortBy === "course") {
      return a.course.localeCompare(b.course);
    }
    return 0;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleApproveApplication = (id: string) => {
    const updatedApplications = applications.map(app => 
      app.id === id ? { ...app, status: "Approved", notes: app.notes + "\nApproved on " + new Date().toISOString().split('T')[0] } : app
    );
    setApplications(updatedApplications);
    setIsViewDialogOpen(false);
    
    toast({
      title: "Application Approved",
      description: `Application ${id} has been approved successfully.`,
    });
  };

  const handleRejectApplication = (id: string, reason: string) => {
    const updatedApplications = applications.map(app => 
      app.id === id ? { ...app, status: "Rejected", notes: reason } : app
    );
    setApplications(updatedApplications);
    setIsViewDialogOpen(false);
    
    toast({
      title: "Application Rejected",
      description: `Application ${id} has been rejected.`,
    });
  };

  const pendingCount = applications.filter(app => app.status === "Pending").length;
  const approvedCount = applications.filter(app => app.status === "Approved").length;
  const rejectedCount = applications.filter(app => app.status === "Rejected").length;

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
    <MobileNavbar />
    <MainLayout title="Approve Applications">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-maroon mb-2">Application Management</h2>
        <p className="text-gray-600">
          Review and approve/reject student applications for resit and supplementary examinations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Pending Applications</p>
                    <p className="text-2xl font-bold mt-1">{pendingCount}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Approved Applications</p>
                    <p className="text-2xl font-bold mt-1">{approvedCount}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Rejected Applications</p>
                    <p className="text-2xl font-bold mt-1">{rejectedCount}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Applications</CardTitle>
                  <CardDescription>
                    Review and approve student applications
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search applications..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Applications</SelectItem>
                        <SelectItem value="resit">Resit Only</SelectItem>
                        <SelectItem value="supplementary">Supplementary Only</SelectItem>
                        <SelectItem value="pending">Pending Status</SelectItem>
                        <SelectItem value="approved">Approved Status</SelectItem>
                        <SelectItem value="rejected">Rejected Status</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Sort by Date</SelectItem>
                        <SelectItem value="studentName">Sort by Student Name</SelectItem>
                        <SelectItem value="course">Sort by Course</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Student</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Course</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Submitted</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Payment</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedApplications.map((app) => (
                      <tr key={app.id} className="border-b">
                        <td className="py-3 px-4 font-medium">{app.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{app.studentName}</p>
                            <p className="text-sm text-gray-500">{app.studentId}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            app.type === "Resit" 
                              ? "bg-amber-100 text-amber-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {app.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{app.course}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{formatDate(app.submittedDate)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">
                            {app.type === "Resit" 
                              ? app.paymentStatus 
                              : "N/A"}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => {
                              setSelectedApplication(app);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {sortedApplications.length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-gray-500">
                          No applications found. Try adjusting your search or filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-gray-500">
                Showing {sortedApplications.length} of {applications.length} applications
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => {
                  // In a real app, this would trigger a file download
                  toast({
                    title: "Export Functionality",
                    description: "This would export application data as CSV file in a real application."
                  });
                }}
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </CardFooter>
          </Card>


      <div className="min-h-screen bg-bg-gray flex flex-col">
      {/* View Application Dialog */}
      {selectedApplication && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review application details and approve or reject.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{selectedApplication.id}</h3>
                  <p className="text-gray-500">
                    {selectedApplication.type} Application • Submitted on {formatDate(selectedApplication.submittedDate)}
                  </p>
                </div>
                <div>
                  {getStatusBadge(selectedApplication.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
                <div>
                  <h4 className="font-medium mb-2">Student Information</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Name:</span>
                      <span className="text-sm font-medium">{selectedApplication.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">ID:</span>
                      <span className="text-sm">{selectedApplication.studentId}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Course Information</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Course:</span>
                      <span className="text-sm">{selectedApplication.course}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Previous Grade:</span>
                      <span className="text-sm">{selectedApplication.previousGrade}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedApplication.type === "Resit" && (
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium mb-2">Payment Information</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Payment Status:</span>
                      <span className="text-sm font-medium">{selectedApplication.paymentStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Amount:</span>
                      <span className="text-sm">GHS {selectedApplication.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Transaction ID:</span>
                      <span className="text-sm">TXN-{Math.floor(Math.random() * 10000)}</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedApplication.type === "Supplementary" && selectedApplication.documents.length > 0 && (
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium mb-2">Supporting Documents</h4>
                  <div className="space-y-2">
                    {selectedApplication.documents.map((doc: any, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">{doc.name}</span>
                        </span>
                        <div className="flex gap-2">
                          <span className="text-xs text-gray-500">Uploaded: {formatDate(doc.date)}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedApplication.notes && (
                <div className="border p-4 rounded-md">
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm whitespace-pre-line">{selectedApplication.notes}</p>
                </div>
              )}

              {selectedApplication.status === "Pending" && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      // Open rejection dialog - in a real app, this would be a separate dialog
                      const reason = prompt("Please provide a reason for rejection:");
                      if (reason) {
                        handleRejectApplication(selectedApplication.id, reason);
                      }
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    Reject
                  </Button>
                  <Button 
                    className="flex-1 bg-maroon hover:bg-maroon-dark"
                    onClick={() => handleApproveApplication(selectedApplication.id)}
                    disabled={selectedApplication.type === "Resit" && selectedApplication.paymentStatus !== "Paid"}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
    </MainLayout>
    </>


    
  );
};

export default ApproveApplications;
