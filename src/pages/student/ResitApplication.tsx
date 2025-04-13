
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import MainLayout from '@/components/layout/MainLayout';
import MobileNavbar from '@/components/layout/MobileNavbar';
import CourseCard from '@/components/ui/CourseCard';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const ResitApplication = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { failedCourses, createApplication } = useData();
  const navigate = useNavigate();

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [totalFee, setTotalFee] = useState(0);

  // Redirect if not authenticated or if admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Calculate total fee whenever selected courses change
  useEffect(() => {
    const fee = selectedCourses.length * 100; // GHS 100 per course
    setTotalFee(fee);
  }, [selectedCourses]);

  const handleCourseSelect = (courseId: string, selected: boolean) => {
    if (selected) {
      setSelectedCourses(prev => [...prev, courseId]);
    } else {
      setSelectedCourses(prev => prev.filter(id => id !== courseId));
    }
  };

  const handleSubmit = () => {
    if (selectedCourses.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No courses selected',
        description: 'Please select at least one course to apply for resit.',
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const submitApplication = async () => {
    setIsSubmitting(true);

    try {
      await createApplication({
        type: 'RESIT',
        studentId: user!.id,
        courses: selectedCourses,
        status: 'PENDING',
        totalFee,
        paymentStatus: 'UNPAID',
      });

      toast({
        title: 'Application submitted',
        description: 'Your resit application has been successfully submitted.',
      });

      navigate('/student/application-status');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit your application. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  if (!isAuthenticated || isAdmin) {
    return null; // Redirect will happen in useEffect
  }

  return (
    <>
      <MobileNavbar />
      <MainLayout title="Resit Application">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-maroon mb-2">Resit Examination Application</h2>
          <p className="text-gray-600">
            Select the failed courses you would like to apply for resit examination.
            Each course costs GHS 100.
          </p>
        </div>

        {failedCourses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-semibold text-maroon mb-4">No Failed Courses</h3>
            <p className="text-gray-600 mb-4">
              You don't have any failed courses eligible for resit examination.
            </p>
            <Button 
              className="bg-maroon hover:bg-maroon-dark text-white"
              onClick={() => navigate('/student/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        ) : (
          <>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> You need to pay GHS 100 for each course you select.
                    Payment must be completed for your application to be processed.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-maroon mb-4">Failed Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {failedCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    selectable={true}
                    onSelect={handleCourseSelect}
                    showExtraInfo={true}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-maroon">Fee Calculation</h3>
                  <p className="text-gray-600">
                    {selectedCourses.length} {selectedCourses.length === 1 ? 'course' : 'courses'} selected
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <p className="text-lg font-bold">
                    Total: GHS {totalFee}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                variant="outline" 
                className="mr-4"
                onClick={() => navigate('/student/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                className="bg-maroon hover:bg-maroon-dark text-white"
                onClick={handleSubmit}
                disabled={selectedCourses.length === 0 || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Application</DialogTitle>
                  <DialogDescription>
                    You are about to apply for resit examination for {selectedCourses.length} {selectedCourses.length === 1 ? 'course' : 'courses'}.
                    The total fee is <strong>GHS {totalFee}</strong>. 
                    Payment will be required after submission.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-maroon hover:bg-maroon-dark text-white"
                    onClick={submitApplication}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </MainLayout>
    </>
  );
};

export default ResitApplication;
