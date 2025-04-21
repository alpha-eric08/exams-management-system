// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { useData } from '@/contexts/DataContext';
// import MainLayout from '@/components/layout/MainLayout';
// import MobileNavbar from '@/components/layout/MobileNavbar';
// import CourseCard from '@/components/ui/CourseCard';
// import { Button } from '@/components/ui/button';
// import { toast } from '@/components/ui/use-toast';
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// const ResitApplication = () => {
//   const { user, isAuthenticated, isAdmin } = useAuth();
//   const { failedCourses, createApplication } = useData();
//   const navigate = useNavigate();

//   const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [totalFee, setTotalFee] = useState(0);

//   // Redirect if not authenticated or if admin
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//     } else if (isAdmin) {
//       navigate('/admin/dashboard');
//     }
//   }, [isAuthenticated, isAdmin, navigate]);

//   // Calculate total fee whenever selected courses change
//   useEffect(() => {
//     const fee = selectedCourses.length * 100; // GHS 100 per course
//     setTotalFee(fee);
//   }, [selectedCourses]);

//   const handleCourseSelect = (courseId: string, selected: boolean) => {
//     if (selected) {
//       setSelectedCourses(prev => [...prev, courseId]);
//     } else {
//       setSelectedCourses(prev => prev.filter(id => id !== courseId));
//     }
//   };

//   const handleSubmit = () => {
//     if (selectedCourses.length === 0) {
//       toast({
//         variant: 'destructive',
//         title: 'No courses selected',
//         description: 'Please select at least one course to apply for resit.',
//       });
//       return;
//     }

//     setShowConfirmDialog(true);
//   };

//   const submitApplication = async () => {
//     setIsSubmitting(true);

//     try {
//       await createApplication({
//         type: 'RESIT',
//         studentId: user!.id,
//         courses: selectedCourses,
//         status: 'PENDING',
//         totalFee,
//         paymentStatus: 'UNPAID',
//       });

//       toast({
//         title: 'Application submitted',
//         description: 'Your resit application has been successfully submitted.',
//       });

//       navigate('/student/application-status');
//     } catch (error) {
//       console.error('Error submitting application:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Error',
//         description: 'Failed to submit your application. Please try again.',
//       });
//     } finally {
//       setIsSubmitting(false);
//       setShowConfirmDialog(false);
//     }
//   };

//   if (!isAuthenticated || isAdmin) {
//     return null; // Redirect will happen in useEffect
//   }

//   return (
//     <>
//       <MobileNavbar />
//       <MainLayout title="Resit Application">
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold text-maroon mb-2">Resit Examination Application</h2>
//           <p className="text-gray-600">
//             Select the failed courses you would like to apply for resit examination.
//             Each course costs GHS 100.
//           </p>
//         </div>

//         {failedCourses.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <h3 className="text-xl font-semibold text-maroon mb-4">No Failed Courses</h3>
//             <p className="text-gray-600 mb-4">
//               You don't have any failed courses eligible for resit examination.
//             </p>
//             <Button
//               className="bg-maroon hover:bg-maroon-dark text-white"
//               onClick={() => navigate('/student/dashboard')}
//             >
//               Back to Dashboard
//             </Button>
//           </div>
//         ) : (
//           <>
//             <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
//               <div className="flex">
//                 <div className="ml-3">
//                   <p className="text-sm text-yellow-700">
//                     <strong>Important:</strong> You need to pay GHS 100 for each course you select.
//                     Payment must be completed for your application to be processed.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-6">
//               <h3 className="text-xl font-semibold text-maroon mb-4">Failed Courses</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {failedCourses.map(course => (
//                   <CourseCard
//                     key={course.id}
//                     course={course}
//                     selectable={true}
//                     onSelect={handleCourseSelect}
//                     showExtraInfo={true}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-md p-4 mb-6">
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
//                 <div>
//                   <h3 className="text-lg font-semibold text-maroon">Fee Calculation</h3>
//                   <p className="text-gray-600">
//                     {selectedCourses.length} {selectedCourses.length === 1 ? 'course' : 'courses'} selected
//                   </p>
//                 </div>
//                 <div className="mt-2 sm:mt-0">
//                   <p className="text-lg font-bold">
//                     Total: GHS {totalFee}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <Button
//                 variant="outline"
//                 className="mr-4"
//                 onClick={() => navigate('/student/dashboard')}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 className="bg-maroon hover:bg-maroon-dark text-white"
//                 onClick={handleSubmit}
//                 disabled={selectedCourses.length === 0 || isSubmitting}
//               >
//                 {isSubmitting ? 'Submitting...' : 'Submit Application'}
//               </Button>
//             </div>

//             {/* Confirmation Dialog */}
//             <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Confirm Application</DialogTitle>
//                   <DialogDescription>
//                     You are about to apply for resit examination for {selectedCourses.length} {selectedCourses.length === 1 ? 'course' : 'courses'}.
//                     The total fee is <strong>GHS {totalFee}</strong>.
//                     Payment will be required after submission.
//                   </DialogDescription>
//                 </DialogHeader>
//                 <DialogFooter>
//                   <Button
//                     variant="outline"
//                     onClick={() => setShowConfirmDialog(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     className="bg-maroon hover:bg-maroon-dark text-white"
//                     onClick={submitApplication}
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
//                   </Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </>
//         )}
//       </MainLayout>
//     </>
//   );
// };

// export default ResitApplication;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/components/layout/MainLayout";

const ResitApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock failed courses data
  const failedCourses = [
    {
      id: "CSC301",
      code: "CSC301",
      title: "Data Structures and Algorithms",
      grade: "E",
      credits: 3,
    },
    {
      id: "MAT305",
      code: "MAT305",
      title: "Linear Algebra",
      grade: "F",
      credits: 3,
    },
    {
      id: "ENG202",
      code: "ENG202",
      title: "Technical Writing",
      grade: "D",
      credits: 2,
    },
    {
      id: "PHY201",
      code: "PHY201",
      title: "Mechanics",
      grade: "E",
      credits: 3,
    },
  ];

  const handleCourseSelection = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const calculateTotalFee = () => {
    return selectedCourses.length * 100;
  };

  const handleSubmitPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
      toast({
        title: "Payment Successful",
        description:
          "Your payment has been processed and application submitted.",
      });
    }, 2000);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <>
      <MainLayout title="Resit Application">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-maroon mb-2">
            Resit Examination Application
          </h2>
          <p className="text-gray-600">
            Select the failed courses you would like to apply for resit
            examination. Each course costs GHS 100.
          </p>
        </div>

        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1 ? "bg-maroon text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  1
                </div>
              <span className="text-sm mt-1">Select Courses</span>
            </div>
            <div
              className={`h-1 flex-1 mx-2 ${
                step >= 2 ? "bg-maroon" : "bg-gray-200"
              }`}
            ></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-maroon text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <span className="text-sm mt-1">Payment</span>
            </div>
            <div
              className={`h-1 flex-1 mx-2 ${
                step >= 3 ? "bg-maroon" : "bg-gray-200"
              }`}
            ></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 3
                    ? "bg-maroon text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                3
              </div>
              <span className="text-sm mt-1">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Step 1: Course Selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Courses for Resit</CardTitle>
              <CardDescription>
                Choose the courses you want to resit. Each course costs GHS 100.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {failedCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-md"
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={course.id}
                        checked={selectedCourses.includes(course.id)}
                        onCheckedChange={() => handleCourseSelection(course.id)}
                      />
                      <div>
                        <Label
                          htmlFor={course.id}
                          className="font-medium cursor-pointer"
                        >
                          {course.code}: {course.title}
                        </Label>
                        <div className="text-sm text-gray-500">
                          <span>Grade: {course.grade}</span> •{" "}
                          <span>Credits: {course.credits}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-dark-blue">
                        GHS 100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Selected: {selectedCourses.length} courses
                </p>
                <p className="font-medium">Total: GHS {calculateTotalFee()}</p>
              </div>
              <Button
                className="bg-maroon-dark hover:bg-maroon"
                onClick={() => setStep(2)}
                disabled={selectedCourses.length === 0}
              >
                Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                Complete your payment to submit your resit application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-md flex">
                  <AlertCircle className="text-blue-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-700">
                      Payment Information
                    </h4>
                    <p className="text-sm text-blue-600">
                      This is a demo application. In a real app, this would
                      connect to a payment gateway.
                    </p>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="space-y-2">
                    {selectedCourses.map((courseId) => {
                      const course = failedCourses.find(
                        (c) => c.id === courseId
                      );
                      return (
                        <div key={courseId} className="flex justify-between">
                          <span>
                            {course?.code}: {course?.title}
                          </span>
                          <span>GHS 100</span>
                        </div>
                      );
                    })}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total Amount</span>
                        <span>GHS {calculateTotalFee()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button
                className="bg-maroon-dark hover:bg-maroon"
                onClick={handleSubmitPayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Complete Payment"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
              <CardTitle>Application Submitted Successfully</CardTitle>
              <CardDescription>
                Your resit application has been submitted and is pending
                approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Application Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Application ID:</p>
                      <p>RES-{Math.floor(Math.random() * 10000)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date Submitted:</p>
                      <p>{new Date().toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Number of Courses:</p>
                      <p>{selectedCourses.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Amount Paid:</p>
                      <p>GHS {calculateTotalFee()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-md flex">
                  <AlertCircle className="text-yellow-500 h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-700">Next Steps</h4>
                    <p className="text-sm text-yellow-600">
                      Your application will be reviewed by an administrator. You
                      will receive a notification once it's approved. You can
                      check your application status in the "Application Status"
                      page.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate("/application-status")}
              >
                View Application Status
              </Button>
              <Button
                className="bg-maroon-dark hover:bg-maroon"
                onClick={() => navigate("/dashboard")}
              >
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        )}
      </MainLayout>
    </>
  );
};

export default ResitApplication;
