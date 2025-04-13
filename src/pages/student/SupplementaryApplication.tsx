
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import MainLayout from '@/components/layout/MainLayout';
import MobileNavbar from '@/components/layout/MobileNavbar';
import CourseCard from '@/components/ui/CourseCard';
import FileUpload from '@/components/forms/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const SupplementaryApplication = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { courses, createApplication } = useData();
  const navigate = useNavigate();

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Redirect if not authenticated or if admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleCourseSelect = (courseId: string, selected: boolean) => {
    if (selected) {
      setSelectedCourses(prev => [...prev, courseId]);
    } else {
      setSelectedCourses(prev => prev.filter(id => id !== courseId));
    }
  };

  const handleFileUpload = (file: File | null) => {
    if (file) {
      setDocuments([file]); // For now, we only support one document
    } else {
      setDocuments([]);
    }
  };

  const handleSubmit = () => {
    // Validation
    if (selectedCourses.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No courses selected',
        description: 'Please select at least one course to apply for supplementary exam.',
      });
      return;
    }

    if (documents.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Supporting document required',
        description: 'Please upload a supporting document for your application.',
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        variant: 'destructive',
        title: 'Reason required',
        description: 'Please provide a reason for your application.',
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const submitApplication = async () => {
    setIsSubmitting(true);

    try {
      // Mock document URL generation (in a real app, you'd upload to a storage service)
      const mockDocuments = documents.map((file, index) => ({
        id: `doc-${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file), // In a real app, this would be a real URL
      }));

      await createApplication({
        type: 'SUPPLEMENTARY',
        studentId: user!.id,
        courses: selectedCourses,
        status: 'PENDING',
        documents: mockDocuments,
        adminComments: `Reason: ${reason}`,
      });

      toast({
        title: 'Application submitted',
        description: 'Your supplementary application has been successfully submitted.',
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
      <MainLayout title="Supplementary Application">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-maroon mb-2">Supplementary Examination Application</h2>
          <p className="text-gray-600">
            Select the courses you missed and upload supporting documentation.
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Important:</strong> You must provide valid supporting documentation (e.g., medical report) 
                to justify why you missed the examination. Your application will be rejected if the documentation 
                is deemed insufficient.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-maroon mb-4">Select Missed Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                selectable={true}
                onSelect={handleCourseSelect}
              />
            ))}
          </div>
        </div>

        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-maroon mb-4">Supporting Documentation</h3>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="reason" className="text-base">Reason for Missing Examination</Label>
              <Textarea
                id="reason"
                placeholder="Explain why you missed the examination..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2"
              />
            </div>

            <FileUpload
              label="Upload Supporting Document"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
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
            disabled={isSubmitting}
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
                You are about to apply for supplementary examination for {selectedCourses.length} {selectedCourses.length === 1 ? 'course' : 'courses'}.
                Please note that your application will be reviewed by the administration and may be approved or rejected
                based on the validity of your supporting documentation.
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
      </MainLayout>
    </>
  );
};

export default SupplementaryApplication;
